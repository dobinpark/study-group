<template>
  <div class="signup-container">
    <div class="signup-content">
      <h1>회원가입</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">아이디</label>
          <input type="text" id="username" v-model="form.username" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인</label>
          <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input type="text" id="nickname" v-model="form.nickname" required />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">전화번호</label>
          <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
        </div>
        <div class="button-group">
          <button type="button" @click="$router.push('/login')">취소</button>
          <button type="submit">가입하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phoneNumber: ''
});

const handleSubmit = async () => {
  try {
    const response = await axios.post('/auth/signup', form);
    if (response.data.success) {
      alert('회원가입이 완료되었습니다');
      router.push('/login');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '회원가입에 실패했습니다');
  }
};
</script>

<style scoped>
.signup-container {
  width: 100%;
  max-width: 1200px;
  /* 네비게이션 바와 동일한 최대 너비 설정 */
  margin: 0 auto;
  min-height: calc(100vh - 140px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.signup-content {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Pretendard', 'Arial', sans-serif;
}

.signup-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-row .form-group {
  flex: 1;
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
  transition: all 0.2s;
}

input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.submit-button,
.cancel-button {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-button {
  background-color: #4A90E2;
  color: white;
}

.submit-button:hover {
  background-color: #357abd;
  transform: translateY(-1px);
}

.cancel-button {
  background-color: #e2e8f0;
  color: #4a5568;
}

.cancel-button:hover {
  background-color: #cbd5e0;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .signup-content {
    width: 90%;
    padding: 2rem;
  }

  .signup-title {
    font-size: 2rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .button-group {
    flex-direction: column;
  }

  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
