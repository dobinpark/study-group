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
import axios from '../utils/axios';

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
    
    // 로그인 전에 세션 상태 초기화 (문제 방지)
    await clearSessionState();
    
    const success = await authStore.login(form.username, form.password);
    
    if (success) {
      console.log('로그인 성공, 메인 페이지로 이동');
      const redirectPath = route.query.redirect as string || '/';
      router.push(redirectPath);
    } else {
      loginError.value = '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.';
    }
  } catch (error: any) {
    console.error('로그인 에러:', error);
    loginError.value = error.response?.data?.message || '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
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

// 세션 상태를 초기화하는 함수
const clearSessionState = async () => {
  console.log('로그인 페이지: 세션 상태 초기화 시작');
  
  // 로컬 스토리지 인증 상태 초기화
  try {
    window.localStorage.removeItem('auth-session');
    console.log('로그인 페이지: 로컬 스토리지 인증 상태 초기화 완료');
  } catch (err) {
    console.error('로그인 페이지: 로컬 스토리지 초기화 실패', err);
  }
  
  // 인증 스토어 상태 초기화
  authStore.clearUser();
  userStore.clearUser();
  
  // 쿠키 정리
  try {
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    console.log('로그인 페이지: 쿠키 정리 완료');
  } catch (cookieErr) {
    console.error('로그인 페이지: 쿠키 정리 실패', cookieErr);
  }
  
  // 백엔드 세션도 정리 (선택적)
  try {
    await axios.post('/auth/logout', {}, { 
      // 오류가 발생해도 계속 진행하도록 설정
      validateStatus: (status) => true 
    });
    console.log('로그인 페이지: 백엔드 세션 정리 완료');
  } catch (err) {
    console.log('로그인 페이지: 백엔드 세션 정리 실패 (무시됨)');
  }
  
  console.log('로그인 페이지: 세션 상태 초기화 완료');
};

onMounted(() => {
  resetForm();
  
  // 페이지 접근 이유에 따른 메시지 표시
  if (route.query.expired === 'true') {
    loginError.value = '세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
    console.log('로그인 페이지: 세션 만료로 인한 접근');
  } else if (route.query.loggedOut === 'true') {
    // 로그아웃 후 로그인 페이지 접근 시
    console.log('로그인 페이지: 로그아웃 후 접근');
  } else {
    console.log('로그인 페이지: 일반 접근');
  }

  // 로그인 페이지 접근 시 인증 및 세션 상태 초기화
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
