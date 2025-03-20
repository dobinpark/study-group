<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>스터디 참여 요청 관리</h1>
          <p class="header-description">당신이 생성한 스터디에 대한 참여 요청을 확인하고 관리할 수 있습니다.</p>
        </header>
        
        <main class="page-content">
          <!-- 로딩 상태 -->
          <div v-if="isLoading" class="loading-spinner-container">
            <div class="loading-spinner"></div>
            <p>요청 목록을 불러오는 중입니다...</p>
          </div>
          
          <!-- 참여 요청이 없는 경우 -->
          <div v-else-if="joinRequests.length === 0" class="empty-state">
            <i class="fas fa-inbox empty-icon"></i>
            <h3>처리할 참여 요청이 없습니다</h3>
            <p>현재 생성한 스터디에 대한 참여 요청이 없습니다.</p>
            <button @click="navigateTo('/study-groups')" class="btn btn-primary">
              <i class="fas fa-search"></i>
              스터디 목록으로 이동
            </button>
          </div>
          
          <!-- 참여 요청 목록 -->
          <div v-else class="requests-container">
            <div v-for="request in joinRequests" :key="request.id" class="request-card">
              <div class="request-header">
                <div class="user-info">
                  <div class="user-avatar">{{ request.user.nickname[0] }}</div>
                  <div class="user-details">
                    <h3 class="user-name">{{ request.user.nickname }}</h3>
                    <span class="request-time">{{ formatDate(request.createdAt) }}에 요청됨</span>
                  </div>
                </div>
                <div class="study-info">
                  <span class="study-name">{{ request.studyGroup.name }}</span>
                </div>
              </div>
              
              <div class="request-content">
                <div class="info-section">
                  <h4>참여 동기</h4>
                  <p>{{ request.reason }}</p>
                </div>
                
                <div class="info-section">
                  <h4>경험 및 스킬</h4>
                  <p>{{ request.experience }}</p>
                </div>
              </div>
              
              <div class="request-actions">
                <button 
                  class="btn btn-reject" 
                  @click="handleReject(request)"
                  :disabled="request.isProcessing"
                >
                  <i class="fas fa-times"></i>
                  {{ request.isProcessing ? '처리 중...' : '거절' }}
                </button>
                <button 
                  class="btn btn-approve" 
                  @click="handleApprove(request)"
                  :disabled="request.isProcessing"
                >
                  <i class="fas fa-check"></i>
                  {{ request.isProcessing ? '처리 중...' : '승인' }}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios';
import type { JoinRequest } from '../../types/models';
import studyGroupService from '../../utils/studyGroupService';

const router = useRouter();
const joinRequests = ref<(JoinRequest & { isProcessing?: boolean })[]>([]);
const isLoading = ref(true);

// 페이지 이동 함수
const navigateTo = (path: string) => {
  router.push(path);
};

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// 승인 처리 함수
const handleApprove = async (request: JoinRequest & { isProcessing?: boolean }) => {
  if (request.isProcessing) return;
  
  // 현재 처리 중인 요청 표시
  request.isProcessing = true;
  
  try {
    // 승인 API 호출
    await studyGroupService.approveJoinRequest(request.studyGroupId, request.id);
    
    // 쪽지 보내기
    await axios.post('/messages', {
      receiverId: request.userId,
      content: `스터디 '${request.studyGroup.name}'에 참여 요청이 승인되었습니다. 스터디에 참여해 주셔서 감사합니다.`,
      studyGroupId: request.studyGroupId
    });
    
    // 목록에서 제거
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);
    
    // 성공 메시지
    alert(`${request.user.nickname}님의 참여 요청이 승인되었습니다.`);
  } catch (error) {
    console.error('참여 요청 승인 실패:', error);
    alert('요청 처리 중 오류가 발생했습니다.');
    request.isProcessing = false;
  }
};

// 거절 처리 함수
const handleReject = async (request: JoinRequest & { isProcessing?: boolean }) => {
  if (request.isProcessing) return;
  
  // 거절 사유 입력 (선택 사항)
  const rejectReason = prompt('거절 사유를 입력하세요 (선택 사항):') || '';
  
  // 현재 처리 중인 요청 표시
  request.isProcessing = true;
  
  try {
    // 거절 API 호출
    await studyGroupService.rejectJoinRequest(request.studyGroupId, request.id);
    
    // 쪽지 보내기
    let messageContent = `스터디 '${request.studyGroup.name}'에 참여 요청이 거절되었습니다.`;
    if (rejectReason) {
      messageContent += ` 사유: ${rejectReason}`;
    }
    
    await axios.post('/messages', {
      receiverId: request.userId,
      content: messageContent,
      studyGroupId: request.studyGroupId
    });
    
    // 목록에서 제거
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);
    
    // 성공 메시지
    alert(`${request.user.nickname}님의 참여 요청이 거절되었습니다.`);
  } catch (error) {
    console.error('참여 요청 거절 실패:', error);
    alert('요청 처리 중 오류가 발생했습니다.');
    request.isProcessing = false;
  }
};

// 참여 요청 데이터 로드
const loadJoinRequests = async () => {
  isLoading.value = true;
  try {
    const response = await studyGroupService.getPendingJoinRequests();
    if (response.data) {
      joinRequests.value = response.data.map((req: JoinRequest) => ({
        ...req,
        isProcessing: false
      }));
    }
  } catch (error) {
    console.error('참여 요청 목록 로드 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadJoinRequests();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.page-container {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: white;
}

.page-header {
  padding: 2rem;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header-description {
  opacity: 0.9;
  font-size: 1.1rem;
}

.page-content {
  padding: 2rem;
}

.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  color: #a0aec0;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #718096;
  margin-bottom: 2rem;
  max-width: 400px;
}

.requests-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-card {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: white;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.request-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.request-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background-color: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 1.25rem;
  margin: 0 0 0.25rem;
  color: #2d3748;
}

.request-time {
  font-size: 0.85rem;
  color: #718096;
}

.study-info {
  padding: 0.5rem 1rem;
  background-color: #ebf8ff;
  border-radius: 8px;
}

.study-name {
  font-weight: 600;
  color: #2c5282;
}

.request-content {
  padding: 1.5rem;
  background-color: #f8fafc;
}

.info-section {
  margin-bottom: 1.25rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h4 {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.info-section p {
  margin: 0;
  color: #2d3748;
  line-height: 1.7;
  white-space: pre-wrap;
}

.request-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.25rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
}

.btn-primary:hover {
  background-color: #357ABD;
}

.btn-reject {
  background-color: #f8f9fa;
  color: #e53e3e;
  border: 1px solid #e2e8f0;
}

.btn-reject:hover {
  background-color: #fee2e2;
  border-color: #feb2b2;
}

.btn-approve {
  background-color: #4A90E2;
  color: white;
}

.btn-approve:hover {
  background-color: #357ABD;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .request-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .study-info {
    align-self: flex-start;
  }
  
  .request-actions {
    flex-direction: column-reverse;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style> 