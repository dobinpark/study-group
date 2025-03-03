<template>
  <div class="page-container signup-page">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>회원가입</h1>
        </header>
        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="username">아이디</label>
                <input type="text" id="username" v-model="form.username" required />
              </div>
              <div class="form-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="nickname" v-model="form.nickname" required />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" v-model="form.password" required />
              </div>
              <div class="form-group">
                <label for="confirmPassword">비밀번호 확인</label>
                <input type="password" id="confirmPassword" v-model="form.confirmPassword" required />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="email">이메일</label>
                <input type="email" id="email" v-model="form.email" required />
              </div>
              <div class="form-group">
                <label for="phoneNumber">전화번호</label>
                <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
              </div>
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">회원가입</button>
              <button type="button" class="btn btn-secondary" @click="$router.push('/login')">취소</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phoneNumber: ''
});

const handleSubmit = async () => {
  if (form.password !== form.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const response = await axios.post('/auth/signup', {
      username: form.username,
      password: form.password,
      nickname: form.nickname,
      email: form.email,
      phoneNumber: form.phoneNumber
    });

    if (response.data.success) {
      alert('회원가입이 완료되었습니다. 로그인해주세요.');
      router.push('/login');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '회원가입에 실패했습니다');
  }
};
</script>

<style scoped>
@import '../assets/styles/common.css';

.page-content {
  max-width: 1200px !important;
  margin: 0 auto;
  padding: 2rem 4rem !important;
}

.form-group {
  margin-bottom: var(--spacing-md) !important;
}

.form-group input {
  padding: 0.75rem var(--spacing-md) !important;
  font-size: 1rem !important;
}

.form-row {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: var(--spacing-md) !important;
  margin-bottom: var(--spacing-md) !important;
}

.button-group {
  display: flex !important;
  gap: var(--spacing-md) !important;
  margin-top: var(--spacing-lg) !important;
  justify-content: flex-end !important;
}

.btn {
  min-width: 120px !important;
  padding: 0.75rem 2rem !important;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr !important;
  }
  
  .page-content {
    padding: 1rem !important;
  }
  
  .button-group {
    flex-direction: column !important;
  }
  
  .btn {
    width: 100% !important;
  }
}

.signup-container {
  width: 100%;
  max-width: 450px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
