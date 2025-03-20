<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>쪽지 상세</h1>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>로딩 중...</p>
          </div>
          <div v-else-if="message" class="message-detail">
            <div class="message-header">
              <h2 class="message-title">{{ message.title }}</h2>
              <div class="message-meta">
                <div class="message-info">
                  <span>보낸 사람: {{ message.sender?.nickname || '알 수 없음' }}</span>
                  <span>작성일: {{ formatDate(message.createdAt) }}</span>
                  <span>읽음 상태: {{ message.read ? '읽음' : '안읽음' }}</span>
                </div>
                <div class="message-actions">
                  <button @click="replyMessage" class="btn btn-primary">답장</button>
                  <button @click="deleteMessage" class="btn btn-danger">삭제</button>
                </div>
              </div>
            </div>

            <div class="message-content">{{ message.content }}</div>
          </div>

          <div v-else class="error-message">
            <p>쪽지를 불러올 수 없습니다.</p>
            <button @click="goBack" class="btn btn-secondary">목록</button>
          </div>

          <div class="button-group">
            <button @click="goBack" class="btn btn-secondary">목록</button>
          </div>
        </main>
      </div>
    </div>
    
    <!-- 답장 쪽지 작성 모달 -->
    <div v-if="showReplyModal" class="modal-backdrop" @click="showReplyModal = false">
      <div class="reply-modal" @click.stop>
        <div class="modal-header">
          <h3>답장 쪽지 작성</h3>
          <button class="close-button" @click="showReplyModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="reply-title">제목</label>
            <input 
              type="text" 
              id="reply-title" 
              v-model="replyData.title" 
              class="form-control"
              placeholder="제목을 입력하세요"
            />
          </div>
          <div class="form-group">
            <label for="reply-content">내용</label>
            <textarea 
              id="reply-content" 
              v-model="replyData.content" 
              class="form-control"
              rows="5"
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showReplyModal = false">취소</button>
          <button 
            class="btn btn-primary" 
            @click="sendReply" 
            :disabled="isSending || !replyData.title || !replyData.content"
          >
            {{ isSending ? '전송 중...' : '전송' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import axios from '../../utils/axios';

// 쪽지 타입 정의
interface Message {
  id: number;
  title: string;
  content: string;
  sender: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  read: boolean;
  isRead: boolean;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const message = ref<Message | null>(null);
const loading = ref(true);
const showReplyModal = ref(false);
const isSending = ref(false);

// 답장 데이터
const replyData = ref({
  title: '',
  content: '',
  receiverId: 0
});

// 쪽지 상세 정보 가져오기
const fetchMessage = async () => {
  console.log('메시지 상세 정보 가져오기 시작');
  try {
    const response = await axios.get(`/messages/${route.params.id}`);
    console.log('메시지 상세 정보 응답:', response.data);
    message.value = response.data.data;
    
    // 쪽지를 읽으면 자동으로 읽음 상태로 변경
    if (message.value && !message.value.read) {
      console.log('읽지 않은 메시지 발견, 읽음 상태로 변경 시도');
      await markAsRead();
    } else {
      console.log('이미 읽은 메시지이거나 메시지 정보 없음:', message.value);
    }
  } catch (error) {
    console.error('쪽지를 불러올 수 없습니다', error);
    alert('쪽지를 불러올 수 없습니다');
    router.push('/messages');
  } finally {
    loading.value = false;
  }
};

// 쪽지 읽음 상태로 변경
const markAsRead = async () => {
  if (!message.value) {
    console.log('메시지 정보가 없어 읽음 상태 변경 불가');
    return;
  }
  
  console.log('메시지 읽음 상태 변경 시도:', message.value.id);
  try {
    const response = await axios.patch(`/messages/${message.value.id}/read`);
    console.log('메시지 읽음 상태 변경 응답:', response.data);
    
    if (message.value) {
      message.value.read = true;
      message.value.isRead = true;
      console.log('메시지 읽음 상태 변경 완료');
      
      // 알림 카운트 즉시 업데이트를 위해 이벤트 발생
      try {
        if (window.dispatchEvent) {
          console.log('updateNotificationCount 이벤트 발생 - 읽음 상태 변경 후');
          window.dispatchEvent(new CustomEvent('updateNotificationCount'));
        }
      } catch (e) {
        console.error('알림 이벤트 발생 오류:', e);
      }
    }
  } catch (error) {
    console.error('쪽지 읽음 상태 변경 실패:', error);
  }
};

// 날짜 형식 변환
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 정보 없음';
    }
    return date.toLocaleDateString();
  } catch (e) {
    console.error('날짜 형식 변환 오류:', e);
    return '날짜 정보 없음';
  }
};

// 쪽지 답장 모달 열기
const replyMessage = () => {
  if (!message.value || !message.value.sender) return;
  
  replyData.value = {
    title: `RE: ${message.value.title}`,
    content: '',
    receiverId: message.value.sender.id
  };
  
  showReplyModal.value = true;
};

// 답장 쪽지 전송
const sendReply = async () => {
  if (!message.value || !replyData.value.title || !replyData.value.content) return;
  
  isSending.value = true;
  try {
    await axios.post('/messages', {
      title: replyData.value.title,
      content: replyData.value.content,
      receiverId: replyData.value.receiverId,
    });
    
    showReplyModal.value = false;
    alert('답장이 전송되었습니다.');
  } catch (error: any) {
    alert(error.response?.data?.message || '쪽지 전송에 실패했습니다');
  } finally {
    isSending.value = false;
  }
};

// 쪽지 삭제
const deleteMessage = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await axios.delete(`/messages/${route.params.id}`);
    router.push('/messages');
  } catch (error: any) {
    alert(error.response?.data?.message || '쪽지 삭제에 실패했습니다');
  }
};

const goBack = () => {
  router.push('/messages');
};

onMounted(() => {
  // 로그인 상태 확인
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  fetchMessage();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.message-detail {
  border-radius: 8px;
}

.message-header {
  margin-bottom: 2rem;
}

.message-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.message-info {
  display: flex;
  gap: 1.5rem;
  color: #718096;
  font-size: 0.875rem;
}

.message-info i {
  margin-right: 0.5rem;
  color: #4a90e2;
}

.message-content {
  min-height: 200px;
  line-height: 1.7;
  color: #2d3748;
  margin: 2rem 0;
  white-space: pre-wrap;
}

.message-actions {
  display: flex;
  gap: 1rem;
}

.button-group {
  margin-top: 2rem;
  text-align: center;
  justify-content: center;
}

/* 로딩 애니메이션 */
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #e53e3e;
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}

/* 모달 스타일 */
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

.reply-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
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
  margin-bottom: 1rem;
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
  border-radius: 4px;
  font-size: 1rem;
}

.form-control:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
}

.btn-primary:hover {
  background-color: #357ABD;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.btn-danger {
  background-color: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background-color: #c53030;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .message-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .message-info {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .message-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style> 