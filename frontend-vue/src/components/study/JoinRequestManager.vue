<template>
  <div class="join-request-manager">
    <h3 class="section-title">스터디 참여 요청 관리</h3>
    
    <div v-if="isLoading" class="loading-spinner-container">
      <div class="loading-spinner"></div>
      <p>요청 목록을 불러오는 중입니다...</p>
    </div>
    
    <div v-else-if="joinRequests.length === 0" class="empty-state">
      <p>현재 처리할 스터디 참여 요청이 없습니다.</p>
    </div>
    
    <div v-else class="requests-list">
      <div v-for="request in joinRequests" :key="request.id" class="request-card">
        <div class="request-header">
          <div class="user-info">
            <div class="user-avatar">{{ request.user.nickname[0] }}</div>
            <h4 class="user-name">{{ request.user.nickname }}</h4>
          </div>
          <div class="study-info">
            <span class="study-name">{{ request.studyGroup.name }}</span>
            <span class="request-date">요청일: {{ formatDate(request.createdAt) }}</span>
          </div>
        </div>
        
        <div class="request-body">
          <div class="info-section">
            <h5>참여 동기</h5>
            <p>{{ request.reason }}</p>
          </div>
          
          <div class="info-section">
            <h5>경험 및 스킬</h5>
            <p>{{ request.experience }}</p>
          </div>
        </div>
        
        <div class="request-actions">
          <button 
            class="btn btn-primary" 
            @click="handleApprove(request)"
            :disabled="request.isProcessing"
          >
            {{ request.isProcessing ? '처리 중...' : '승인' }}
          </button>
          <button 
            class="btn btn-danger" 
            @click="handleReject(request)"
            :disabled="request.isProcessing"
          >
            {{ request.isProcessing ? '처리 중...' : '거절' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue';
import axios from '../../utils/axios';
import type { JoinRequest } from '../../types/models';

// 참여 요청 목록
const joinRequests = ref<(JoinRequest & { isProcessing?: boolean })[]>([]);
const isLoading = ref(true);

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

// 참여 요청 승인 처리
const handleApprove = async (request: JoinRequest & { isProcessing?: boolean }) => {
  if (request.isProcessing) return;
  
  // 현재 처리 중인 요청 표시
  request.isProcessing = true;
  
  try {
    // 참여 요청 승인 API 호출
    await axios.patch(`/study-groups/${request.studyGroupId}/join-requests/${request.id}/approve`);
    
    // 요청자에게 알림 메시지 보내기
    await axios.post('/messages', {
      receiverId: request.userId,
      content: `스터디 '${request.studyGroup.name}'에 참여 요청이 승인되었습니다. 스터디에 참여해 주셔서 감사합니다.`,
      studyGroupId: request.studyGroupId
    });
    
    // 요청 목록에서 제거
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);
    
    // 성공 메시지
    alert(`${request.user.nickname}님의 참여 요청이 승인되었습니다.`);
  } catch (error) {
    console.error('참여 요청 승인 실패:', error);
    alert('참여 요청 승인 중 오류가 발생했습니다.');
    // 처리 중 상태 해제
    request.isProcessing = false;
  }
};

// 참여 요청 거절 처리
const handleReject = async (request: JoinRequest & { isProcessing?: boolean }) => {
  if (request.isProcessing) return;
  
  // 거절 사유 입력 확인 (선택 사항)
  const rejectReason = prompt('거절 사유를 입력하세요 (선택 사항):') || '';
  
  // 현재 처리 중인 요청 표시
  request.isProcessing = true;
  
  try {
    // 참여 요청 거절 API 호출
    await axios.patch(`/study-groups/${request.studyGroupId}/join-requests/${request.id}/reject`);
    
    // 요청자에게 알림 메시지 보내기
    let messageContent = `스터디 '${request.studyGroup.name}'에 참여 요청이 거절되었습니다.`;
    if (rejectReason) {
      messageContent += ` 사유: ${rejectReason}`;
    }
    
    await axios.post('/messages', {
      receiverId: request.userId,
      content: messageContent,
      studyGroupId: request.studyGroupId
    });
    
    // 요청 목록에서 제거
    joinRequests.value = joinRequests.value.filter(r => r.id !== request.id);
    
    // 성공 메시지
    alert(`${request.user.nickname}님의 참여 요청이 거절되었습니다.`);
  } catch (error) {
    console.error('참여 요청 거절 실패:', error);
    alert('참여 요청 거절 중 오류가 발생했습니다.');
    // 처리 중 상태 해제
    request.isProcessing = false;
  }
};

// 참여 요청 데이터 로드
const loadJoinRequests = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/study-groups/join-requests/pending');
    if (response.status === 200 && response.data.data) {
      joinRequests.value = response.data.data.map((req: JoinRequest) => ({
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

// 컴포넌트 외부로 노출할 속성 및 메서드 정의
defineExpose({
  loadJoinRequests,
  joinRequests,
  isLoading
});
</script>

<style scoped>
.join-request-manager {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #718096;
  background-color: #f8fafc;
  border-radius: 8px;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.request-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
}

.request-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.request-header {
  padding: 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background-color: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.study-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.study-name {
  font-weight: 600;
  color: #4A90E2;
}

.request-date {
  font-size: 0.9rem;
  color: #718096;
}

.request-body {
  padding: 1.25rem;
  background-color: #f8fafc;
}

.info-section {
  margin-bottom: 1rem;
}

.info-section:last-child {
  margin-bottom: 0;
}

.info-section h5 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.info-section p {
  margin: 0;
  color: #2d3748;
  line-height: 1.6;
  white-space: pre-wrap;
}

.request-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
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

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.btn-danger {
  background-color: #F56565;
  color: white;
}

.btn-danger:hover {
  background-color: #E53E3E;
}

.btn-danger:disabled {
  background-color: #feb2b2;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .request-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .study-info {
    align-items: flex-start;
  }
  
  .request-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style> 