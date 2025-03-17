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
                <div class="validation-message" v-if="!form.username">아이디를 입력해주세요.</div>
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
                <div class="validation-message" v-if="form.password.length < 8">비밀번호는 최소 8자 이상이어야 합니다.</div>
                <div class="validation-message" v-if="!passwordRegex.test(form.password)">
                  영문, 숫자, 특수문자를 포함해야 합니다.
                  <br>
                  허용되는 특수문자: !@#$%^&*()
                </div>
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
                <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required placeholder="01012345678" />
                <div class="validation-message" v-if="form.phoneNumber && !phoneNumberRegex.test(form.phoneNumber)">
                  올바른 전화번호 형식이 아닙니다. (예: 01012345678)
                </div>
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
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';
import { useAuthStore } from '../store/auth';
import { getErrorMessage } from '../utils/axios';
import { PASSWORD_REGEX } from '../utils/validation';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
  email: '',
  phoneNumber: ''
});

const passwordRegex = PASSWORD_REGEX;
const phoneNumberRegex = ref(/^[0-9]{10,11}$/);

const handleSubmit = async () => {
  if (form.password.trim() !== form.confirmPassword.trim()) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  if (!phoneNumberRegex.value.test(form.phoneNumber)) {
    alert('올바른 전화번호 형식이 아닙니다. (예: 01012345678)');
    return;
  }

  if (!passwordRegex.test(form.password)) {
    alert('비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
    return;
  }

  try {
    const response = await axios.post('/auth/signup', {
      username: form.username,
      password: form.password,
      confirmPassword: form.confirmPassword,
      nickname: form.nickname,
      email: form.email,
      phoneNumber: form.phoneNumber
    });

    if (response.data.success) {
      console.log('회원가입 성공:', response.data.message);
      alert('회원가입이 완료되었습니다.');
      router.push('/login');
    }
  } catch (error: any) {
    const message = getErrorMessage(error);
    console.error('회원가입 실패:', message);
    alert(`회원가입에 실패했습니다: ${message}`);
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
  justify-content: center !important;
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

.validation-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
