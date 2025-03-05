<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h5 class="modal-title">비밀번호 찾기</h5>
        <button type="button" class="close-button" @click="closeModal">&times;</button>
      </header>
      
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">아이디</label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              required 
              placeholder="아이디를 입력하세요"
            >
          </div>
          
          <div class="form-group">
            <label for="email">이메일 주소</label>
            <input 
              type="email" 
              id="email" 
              v-model="form.email" 
              required 
              placeholder="이메일 주소를 입력하세요"
            >
          </div>
          
          <div v-if="message" class="message" :class="messageType">
            {{ message }}
          </div>

          <div class="button-group">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              비밀번호 찾기
              <span v-if="loading">처리 중...</span>
            </button>
            <button type="button" class="btn btn-secondary" @click="closeModal">
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, reactive, ref } from 'vue';
import axios from '../utils/axios';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits(['close']);

const form = reactive({
  username: '',
  email: ''
});

const loading = ref(false);
const message = ref('');
const messageType = ref('');

const handleSubmit = async () => {
  loading.value = true;
  message.value = '';
  
  try {
    const response = await axios.post('/auth/find-password', form);
    message.value = response.data.message || '이메일로 비밀번호 재설정 링크가 발송되었습니다.';
    messageType.value = 'success';
  } catch (error: any) {
    message.value = error.response?.data?.message || '비밀번호 찾기 요청에 실패했습니다.';
    messageType.value = 'error';
  } finally {
    loading.value = false;
  }
};

const closeModal = () => emit('close');
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.message {
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
