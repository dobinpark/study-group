<template>
  <div class="login-container">
    <div class="login-content">
      <h1>로그인</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model="form.username" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
        <div class="button-group">
          <button type="submit">로그인</button>
          <button type="button" @click="$router.push('/signup')">회원가입</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  try {
    const success = await userStore.login(form);
    if (success) {
      console.log('로그인 성공, 홈으로 이동');
      await router.push('/');
    } else {
      console.log('로그인 실패');
      alert('로그인에 실패했습니다');
    }
  } catch (error: any) {
    console.error('로그인 에러:', error);
    alert(error.response?.data?.message || '로그인에 실패했습니다');
  }
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
