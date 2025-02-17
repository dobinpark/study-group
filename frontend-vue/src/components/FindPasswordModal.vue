<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h5 class="modal-title">비밀번호 찾기</h5>
        <button type="button" class="close-button" @click="closeModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div class="modal-body">
        <form @submit.prevent="findPassword" class="find-password-form">
          <div class="form-group">
            <label for="email">이메일 주소</label>
            <input type="email" id="email" v-model="email" required placeholder="이메일 주소를 입력하세요" class="form-control">
            <div v-if="emailError" class="validation-error">{{ emailError }}</div>
          </div>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          <div class="button-group">
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              비밀번호 찾기
              <span v-if="isLoading">비밀번호 찾는 중...</span>
              <span v-if="isLoading" class="spinner"></span>
            </button>
          </div>
          <div class="button-group">
            <button type="button" class="btn btn-secondary" @click="closeModal">닫기</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
    name: 'FindPasswordModal'
};
</script>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import axios from '../utils/axios';

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

const email = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);
const emailError = ref('');

const findPassword = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;
  emailError.value = '';

  if (!isValidEmail(email.value)) { // 이메일 유효성 검사
    emailError.value = '올바른 이메일 주소 형식이 아닙니다.';
    isLoading.value = false;
    return;
  }

  try {
    const response = await axios.post('/users/find-password', { email: email.value }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    if (response.status === 200) {
      successMessage.value = '비밀번호 찾기 요청이 완료되었습니다.\n입력하신 이메일 주소로 비밀번호 재설정 메일이 발송되었습니다.\n메일함을 확인해주세요.';
    } else {
      errorMessage.value = response.data?.message || '비밀번호 찾기 요청에 실패했습니다.\n이메일 주소를 다시 확인하거나, 잠시 후 다시 시도해주세요.';
    }
  } catch (error: any) {
    console.error('비밀번호 찾기 오류:', error);
    errorMessage.value = error.response?.data?.message || '비밀번호 찾기 요청 중 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.';
  } finally {
    isLoading.value = false;
  }
};

// 이메일 유효성 검사 함수
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* 더 어두운 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px; /* 더 둥근 모서리 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* 더 부드러운 그림자 */
  width: 90%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 내용이 넘치지 않도록 */
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7fafc; /* 헤더 배경색 추가 */
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.5rem; /* 더 큰 글꼴 크기 */
  font-weight: 600;
  color: #2d3748; /* 더 진한 글꼴 색상 */
}

.close-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.close-button:hover {
  opacity: 0.8;
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
  background-color: #f9fafb; /* 모달 본문 배경색 추가 */
}

.find-password-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-control:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  outline: none;
}

.validation-error {
  color: #e53e3e; /* 더 진한 에러 색상 */
  font-size: 0.875rem;
}

.error-message, .success-message {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  border: none;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
}

.btn-primary:hover {
  background-color: #357ABD;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.spinner {
  margin-left: 0.5rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #4A90E2;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
