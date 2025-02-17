<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="login-title">로그인</h1>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model="username" required placeholder="아이디를 입력하세요"
            :class="{ 'error': errorType === 'validation' }" ref="usernameInputRef" />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required placeholder="비밀번호를 입력하세요"
            :class="{ 'error': errorType === 'validation' }" />
        </div>
        <div class="button-group">
          <button type="submit" class="submit-button" :disabled="userStore.loading">
            로그인
            <span v-if="userStore.loading" class="spinner"></span>
            <span v-if="userStore.loading" class="loading-text">로그인 중...</span>
          </button>
        </div>
        <div v-if="loginError" class="error-message">로그인 실패</div>
        <div class="signup-link">
          계정이 없으신가요? <router-link to="/signup">회원가입</router-link>
        </div>
        <div class="find-password-link">
          비밀번호를 잊으셨나요? <a href="#" @click.prevent="openFindPasswordModal">비밀번호 찾기</a>
        </div>
      </form>
    </div>
    <FindPasswordModal :is-open="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { type AxiosError, isAxiosError } from 'axios';
import { useUserStore } from '../store/index';
import { Store } from 'pinia';
import type { AuthState } from '../store/index';
import FindPasswordModal from '../components/FindPasswordModal.vue';
import type { User } from '../types/user';

function isAxiosErrorType(error: unknown): error is AxiosError {
  return isAxiosError(error);
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore() as Store<'user', AuthState, {}, {
  login: (credentials: any) => Promise<{ success: boolean; message?: string; accessToken: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  setUser: (userData: User) => void;
  clearUser: () => void;
  loadUserFromStorage: () => void;
}>;
const username = ref('');
const password = ref('');
const isModalOpen = ref(false);
const errorType = ref('');
const usernameInputRef = ref<HTMLInputElement | null>(null);
const loginError = ref(false);

onMounted(() => {
  nextTick(() => {
    usernameInputRef.value?.focus();
  });
});

const login = async () => {
  errorType.value = '';
  userStore.error = null;
  loginError.value = false;

  try {
    if (!username.value || !password.value) {
      errorType.value = 'validation';
      userStore.error = '아이디와 비밀번호를 모두 입력해주세요.';
      return;
    }

    const loginPayload = {
      username: username.value,
      password: password.value,
    };
    const result = await userStore.login(loginPayload);

    if (result.success) {
      loginError.value = false;
      localStorage.setItem('accessToken', result.accessToken);
      const redirect = Array.isArray(route.query.redirect) ? route.query.redirect[0] : route.query.redirect;
      const redirectTo = redirect || '/';
      await router.push(redirectTo);
    } else {
      errorType.value = 'server';
      userStore.error = result.message || '로그인에 실패했습니다.';
      loginError.value = true;
    }

  } catch (error: unknown) {
    let errorMessageText = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    errorType.value = 'server';
    loginError.value = true;

    if (isAxiosErrorType(error)) {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessageText = '잘못된 요청입니다. 아이디 또는 비밀번호를 확인해주세요.';
            break;
          case 401:
            errorMessageText = '아이디 또는 비밀번호가 일치하지 않습니다.';
            break;
          case 500:
            errorMessageText = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            break;
          default:
            errorMessageText = (error.response.data as { message?: string })?.message || errorMessageText;
        }
      }
      console.error('Login failed:', error);
    } else {
      console.error('Login failed: An unknown error occurred', error);
    }
    userStore.error = errorMessageText;
  }
};

const openFindPasswordModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.login-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.login-content {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 3.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Pretendard', 'Arial', sans-serif;
}

.login-form {
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #4A90E2;
}

input.error {
  border-color: red;
  /* validation error 시 input 테두리 빨간색 */
}

.button-group {
  margin-top: 1.5rem;
  text-align: center;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #357abd;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spinner 0.6s linear infinite;
  margin-left: 8px;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #4a5568;
}

.signup-link a {
  color: #4A90E2;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.find-password-link {
  text-align: center;
  margin-top: 1rem;
  color: #4a5568;
}

.find-password-link a {
  color: #4A90E2;
  text-decoration: none;
  font-weight: 600;
}

.find-password-link a:hover {
  text-decoration: underline;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.error-message.validation {
  color: red;
  /* validation 에러 메시지 스타일 (현재는 .error-message 와 동일) */
}

.error-message.server {
  color: orange;
  /* server 에러 메시지 스타일 */
}

.loading-text {
  margin-left: 8px;
  color: white;
}

@media (max-width: 768px) {
  .login-content {
    width: 90%;
    padding: 2rem;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>
