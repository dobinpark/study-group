<template>
  <div class="modal-backdrop" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>쪽지 보내기</h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="sendMessage">
          <div class="form-group">
            <label for="message-title">제목</label>
            <input
              type="text"
              id="message-title"
              v-model="messageForm.title"
              class="form-control"
              required
              maxlength="100"
              placeholder="쪽지 제목을 입력하세요"
            />
          </div>
          <div class="form-group">
            <label for="message-content">내용</label>
            <textarea
              id="message-content"
              v-model="messageForm.content"
              class="form-control"
              required
              rows="5"
              placeholder="쪽지 내용을 입력하세요"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">취소</button>
            <button type="submit" class="btn btn-primary" :disabled="isSending">
              {{ isSending ? '전송 중...' : '전송하기' }}
            </button>
          </div>
        </form>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from '../../utils/axios';

const props = defineProps<{
  receiverId: number;
  receiverName: string;
  studyGroupId?: number;
}>();

const emit = defineEmits(['close', 'sent']);

const isSending = ref(false);
const error = ref<string | null>(null);

const messageForm = reactive({
  title: '',
  content: '',
});

const closeModal = () => {
  emit('close');
};

const sendMessage = async () => {
  if (!messageForm.title.trim() || !messageForm.content.trim()) {
    error.value = '제목과 내용을 모두 입력해주세요.';
    return;
  }

  isSending.value = true;
  error.value = null;

  try {
    const payload = {
      title: messageForm.title,
      content: messageForm.content,
      receiverId: props.receiverId,
      ...(props.studyGroupId && { studyGroupId: props.studyGroupId }),
    };

    await axios.post('/messages', payload);
    
    // 전송 성공 후 처리
    emit('sent');
    closeModal();
  } catch (err: any) {
    console.error('쪽지 전송 실패:', err);
    error.value = err.response?.data?.message || '쪽지 전송에 실패했습니다.';
  } finally {
    isSending.value = false;
  }
};

defineExpose({
  closeModal,
  sendMessage
});
</script>

<script lang="ts">
export default {
  name: 'SendMessageModal'
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #718096;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

textarea.form-control {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #357ABD;
}

.btn-primary:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.error-message {
  padding: 0.75rem 1.5rem;
  margin: 0 1.5rem 1.5rem;
  color: #e53e3e;
  background-color: #fff5f5;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid #feb2b2;
}
</style> 