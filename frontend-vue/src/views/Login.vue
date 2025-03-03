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

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const handleSubmit = async () => {
  isLoading.value = true;
  loginError.value = '';
  
  try {
    console.log('로그인 시도:', { username: form.username, rememberMe: form.rememberMe });
    
    const success = await authStore.login(form.username, form.password);
    
    if (success) {
      console.log('로그인 성공, 메인 페이지로 이동');
      const redirectPath = route.query.redirect as string || '/';
      router.push(redirectPath);
    } else {
      loginError.value = '로그인에 실패했습니다.';
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

onMounted(() => {
  resetForm();
  if (route.query.expired === 'true') {
    loginError.value = '세션이 만료되었습니다. 다시 로그인해주세요.';
  }
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
</style>
