<template>
  <div id="app">
    <div v-if="!sessionChecked" class="loading-indicator">
      Loading ...
    </div>
    <div v-else>
      <Header />
      <main>
        <router-view :key="$route.fullPath" v-if="sessionChecked"></router-view>
        <div v-else class="loading">
          <div class="loading-spinner"></div>
          <p>로딩 중...</p>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useAuthStore } from './store/auth';
import { useUserStore } from './store/user';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'App',
  components: {
    Header,
    Footer
  },
  setup() {
    const authStore = useAuthStore();
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const sessionChecked = ref(false);

    // 401 오류 처리를 위한 이벤트 리스너
    const handleUnauthorized = () => {
      console.log('인증되지 않은 요청 감지');
      
      // 현재 메인 페이지인 경우 로그아웃만 처리하고 리다이렉트는 하지 않음
      if (router.currentRoute.value.path === '/') {
        console.log('메인 페이지에서 인증 오류, 로그아웃만 처리');
        authStore.clearUser();
      } else {
        console.log('메인 페이지가 아닌 곳에서 인증 오류, 로그인 페이지로 이동');
        authStore.logout();
      }
    };

    // 세션 만료 처리를 위한 이벤트 리스너
    const handleSessionExpired = () => {
      console.log('세션이 만료되었습니다');
      
      // 현재 메인 페이지인 경우 로그아웃만 처리하고 리다이렉트는 하지 않음
      if (router.currentRoute.value.path === '/') {
        console.log('메인 페이지에서 세션 만료, 로그아웃만 처리');
        authStore.clearUser();
      } else {
        console.log('메인 페이지가 아닌 곳에서 세션 만료, 로그인 페이지로 이동');
        authStore.logout();
      }
    };

    // 앱 마운트 시 이벤트 리스너 등록 및 세션 체크
    onMounted(async () => {
      sessionChecked.value = false;
      console.log('App.vue: onMounted - 세션 체크 시작');
      
      try {
        // 현재 경로가 메인 페이지인지 확인
        const isMainPage = router.currentRoute.value.path === '/';
        console.log('App.vue: 현재 경로:', router.currentRoute.value.path, '메인 페이지:', isMainPage);
        
        // 세션 체크 시도
        await authStore.checkSession()
          .then(() => {
            console.log('App.vue: 세션 체크 성공');
          })
          .catch((error) => {
            console.log('App.vue: 세션 체크 실패:', error);
            
            // 메인 페이지가 아닐 때만 로그인 페이지로 이동 고려
            if (!isMainPage && !router.currentRoute.value.path.includes('/login')) {
              console.log('App.vue: 메인 페이지가 아니고 세션 체크 실패, 로그인 페이지 이동 필요');
              // 로그인 상태 초기화 하지만 리다이렉트는 하지 않음 (axios 인터셉터에서 처리)
              authStore.clearUser();
            } else if (isMainPage) {
              console.log('App.vue: 메인 페이지에서 세션 체크 실패, 페이지 유지');
              // 메인 페이지이므로 로그인하지 않은 상태로 허용
              authStore.clearUser();
            }
          })
          .finally(() => {
            sessionChecked.value = true;
          });
      } catch (error) {
        console.error('App.vue: 세션 체크 중 예외 발생:', error);
        sessionChecked.value = true;
      }
      
      console.log('App.vue: onMounted - 세션 체크 완료, sessionChecked:', sessionChecked.value);

      // 이벤트 리스너 등록
      window.addEventListener('auth:unauthorized', handleUnauthorized);
      window.addEventListener('auth:session-expired', handleSessionExpired);

      // 세션 연장 인터벌 처리 개선
      const extendSessionInterval = setInterval(async () => {
        // 로그인된 상태일 때만 세션 연장 시도
        if (authStore.isAuthenticated) {
          try {
            await axios.post('/auth/extend-session');
            console.log('세션 연장 성공');
          } catch (error) {
            console.warn('세션 연장 실패:', error);
            
            // 현재 메인 페이지인 경우 오류를 무시
            if (router.currentRoute.value.path === '/') {
              console.log('메인 페이지에서 세션 연장 실패, 무시함');
            }
          }
        }
      }, 5 * 60 * 1000);
      
      // 인터벌 정리를 위해 저장
      onBeforeUnmount(() => {
        clearInterval(extendSessionInterval);
      });
    });

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    onBeforeUnmount(() => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    });

    return {
      sessionChecked,
    };
  }
});
</script>

<style>
@import './assets/styles/common.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 전역 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #f5f7fa;
  line-height: 1.5;
}

/* 링크 스타일 */
a {
  color: inherit;
  text-decoration: none;
}

/* 버튼 기본 스타일 */
button {
  cursor: pointer;
  border: none;
  outline: none;
}

.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
}
</style>
