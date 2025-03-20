<template>
  <div class="page-container login-page">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>로그인</h1>
        </header>
        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="username">아이디</label>
              <input type="text" id="username" v-model="form.username" required autocomplete="username" :disabled="isLoading" />
            </div>
            <div class="form-group">
              <label for="password">비밀번호</label>
              <input type="password" id="password" v-model="form.password" required autocomplete="current-password" :disabled="isLoading" />
            </div>
            <div class="form-group remember-me">
              <input type="checkbox" id="rememberMe" v-model="form.rememberMe" />
              <label for="rememberMe">로그인 상태 유지</label>
            </div>
            <div v-if="loginError" class="error-message">
              {{ loginError }}
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                {{ isLoading ? '로그인 중...' : '로그인' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="$router.push('/signup')">
                회원가입
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
    <FindPasswordModal :is-open="isFindPasswordModalOpen" @close="closeFindPasswordModal" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const userStore = useUserStore();
const isLoading = ref(false);
const loginError = ref('');
const isFindPasswordModalOpen = ref(false);

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const handleSubmit = async () => {
  isLoading.value = true;
  loginError.value = '';
  
  try {
    console.log('로그인 시도:', { username: form.username, password: form.password, rememberMe: form.rememberMe });
    
    const success = await authStore.login(form.username, form.password);
    
    if (success) {
      console.log('로그인 성공, 메인 페이지로 이동');
      const redirectPath = route.query.redirect as string || '/';
      router.push(redirectPath);
    } else {
      loginError.value = '아이디 또는 비밀번호를 확인해주세요.';
    }
  } catch (error: any) {
    console.error('로그인 에러:', error);
    loginError.value = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  form.username = '';
  form.password = '';
  form.rememberMe = false;
  loginError.value = '';
};

const openFindPasswordModal = () => {
  isFindPasswordModalOpen.value = true;
};

const closeFindPasswordModal = () => {
  isFindPasswordModalOpen.value = false;
};

onMounted(() => {
  resetForm();
  if (route.query.expired === 'true') {
    loginError.value = '세션이 만료되었습니다. 다시 로그인해주세요.';
  } else if (route.query.loggedOut === 'true') {
    // 로그아웃 후 로그인 페이지 접근 시
    console.log('로그인 페이지: 로그아웃 후 접근');
  } else {
    console.log('로그인 페이지: 일반 접근');
  }

  // 로그인 페이지 접근 시 잠재적인 세션 문제 해결을 위한 추가 작업
  const clearSessionState = async () => {
    // 인증 상태 초기화 (로그인 페이지 접근 시)
    if (authStore.isAuthenticated) {
      console.log('로그인 페이지 접근: 클라이언트 인증 상태 초기화');
      authStore.clearUser();
      userStore.clearUser();
    }

    // 브라우저 재시작 후 쿠키가 남아있는 문제를 해결하기 위해 쿠키 정리
    if (authStore.clearCookies && typeof authStore.clearCookies === 'function') {
      authStore.clearCookies();
    }
  };

  clearSessionState();
});
</script>

<style scoped>
@import '../assets/styles/common.css';

.login-container {
  width: 100%;
  max-width: 450px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-content {
  max-width: 500px !important;
  margin: 0 auto;
}

.form-group {
  margin-bottom: var(--spacing-md) !important;
}

.form-group input {
  padding: 0.75rem var(--spacing-md) !important;
  font-size: 1rem !important;
}

.button-group {
  display: flex !important;
  gap: var(--spacing-md) !important;
  margin-top: var(--spacing-lg) !important;
}

.btn {
  flex: 1 !important;
  padding: 0.75rem 0 !important;
}

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  text-align: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.remember-me input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.auth-links {
  margin-top: 1rem;
  text-align: center;
}

.auth-links a, .auth-links button.find-password-link {
  margin: 0 0.5rem;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
}

.auth-links a:hover, .auth-links button.find-password-link:hover {
  color: #4A90E2;
  text-decoration: underline;
}
</style>
