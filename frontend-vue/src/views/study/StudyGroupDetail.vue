<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1 class="title">{{ studyGroup?.name }}</h1>
          <div class="category-path">
            <span>{{ studyGroup?.mainCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup?.subCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup?.detailCategory }}</span>
          </div>
        </header>

        <main class="page-content" v-if="studyGroup">
          <div class="content-section">
            <div class="info-card">
              <div class="info-header">
                <h2>스터디 정보</h2>
                <div class="meta-info">
                  <span class="creator">
                    <i class="fas fa-user"></i>
                    개설자: {{ studyGroup.creator?.nickname }}
                  </span>
                  <span class="date">
                    <i class="fas fa-calendar"></i>
                    개설일: {{ formatDate(studyGroup.createdAt) }}
                  </span>
                  <span class="members">
                    <i class="fas fa-users"></i>
                    참여인원: {{ studyGroup.members?.length || 0 }}/{{ studyGroup.maxMembers }}
                  </span>
                  <span class="study-way" v-if="studyGroup.isOnline">
                    <i class="fas fa-globe"></i>
                    스터디 방식: 온라인
                  </span>
                  <span class="study-way" v-else>
                    <i class="fas fa-map-marker-alt"></i>
                    스터디 방식: 오프라인
                  </span>
                </div>
              </div>
              <div class="description">
                {{ studyGroup.content }}
              </div>
            </div>

            <div class="members-card">
              <h2>참여 멤버 ({{ studyGroup.members?.length || 0 }}명)</h2>
              <div v-if="studyGroup.members?.length" class="members-list">
                <div 
                  v-for="member in studyGroup.members" 
                  :key="member.id" 
                  class="member-item"
                  @click.stop="handleMemberClick(member, $event)"
                >
                  <div class="member-avatar">{{ member.nickname[0] }}</div>
                  <span class="member-name">
                    {{ member.nickname }}
                    <span v-if="member.id === studyGroup.creator?.id" class="creator-badge">방장</span>
                  </span>
                </div>
              </div>
              <div v-else class="no-members">
                아직 참여한 멤버가 없습니다.
              </div>
            </div>

            <!-- 멤버 메뉴를 별도로 분리 -->
            <div v-if="selectedMember" class="menu-container-wrapper">
              <div class="member-menu-container" :style="menuPosition ? { top: menuPosition.top, left: menuPosition.left } : {}">
                <MemberActionMenu
                  :isCreator="isCreator"
                  :isMemberCreator="selectedMember.id === studyGroup?.creator?.id"
                  @sendMessage="openSendMessageModal(selectedMember)"
                  @removeMember="openRemoveMemberConfirm(selectedMember)"
                  @close="selectedMember = null"
                />
              </div>
            </div>

            <div class="action-buttons">
              <button v-if="userStore.isLoggedIn && studyGroup" @click="joinStudyGroup" class="join-button"
                :disabled="isJoinLoading || isAlreadyMember || isCreator">
                <i class="fas fa-sign-in-alt"></i>
                <span>{{ joinButtonText }}</span>
              </button>
              <template v-if="isCreator">
                <button @click="handleEdit" class="edit-button">
                  <i class="fas fa-edit"></i>
                  수정
                </button>
                <button @click="handleDelete" class="delete-button" :disabled="isDeleteLoading">
                  <i class="fas fa-trash"></i>
                  {{ isDeleteLoading ? '삭제 중...' : '삭제' }}
                </button>
              </template>
              <button @click="goToList" class="list-button">
                <i class="fas fa-list"></i>
                목록
              </button>
            </div>
          </div>
        </main>
        <main v-else-if="isLoading" class="page-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">스터디 그룹 정보를 불러오는 중입니다...</p>
        </main>
        <main v-else class="page-content">
          <div class="error-message">
            {{ error }}
          </div>
        </main>
      </div>
    </div>
    
    <!-- 쪽지 보내기 모달 -->
    <SendMessageModal
      v-if="showSendMessageModal && messageRecipient"
      :receiverId="messageRecipient.id"
      :receiverName="messageRecipient.nickname"
      :studyGroupId="studyGroup?.id"
      @close="showSendMessageModal = false"
      @sent="handleMessageSent"
    />
    
    <!-- 스터디 참여 신청 모달 -->
    <div v-if="showJoinRequestModal" class="modal-backdrop" @click="showJoinRequestModal = false">
      <div class="join-request-modal" @click.stop>
        <div class="modal-header">
          <h3>스터디 참여 신청</h3>
          <button class="close-button" @click="showJoinRequestModal = false">×</button>
        </div>
        <div class="modal-body">
          <p class="join-modal-description">스터디 참여를 위한 정보를 작성해주세요. 방장이 이 정보를 확인하고 참여 여부를 결정합니다.</p>
          
          <div class="form-group">
            <label for="joinReason">1. 참여 동기를 알려주세요. (필수)</label>
            <textarea 
              id="joinReason" 
              v-model="joinRequest.reason" 
              class="form-control" 
              placeholder="이 스터디에 참여하고자 하는 동기가 무엇인가요?"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="joinExperience">2. 관련 경험이나 스킬을 알려주세요. (필수)</label>
            <textarea 
              id="joinExperience" 
              v-model="joinRequest.experience" 
              class="form-control" 
              placeholder="관련 경험이나 스킬에 대해 간략히 설명해주세요."
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <div class="agreement-checkbox">
              <input 
                type="checkbox" 
                id="joinAgreement" 
                v-model="joinRequest.agreement"
              >
              <label for="joinAgreement">스터디 규칙을 읽었으며, 성실히 참여할 것을 약속합니다. (필수)</label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showJoinRequestModal = false">취소</button>
          <button 
            class="btn btn-primary" 
            @click="submitJoinRequest"
            :disabled="!isJoinRequestValid || isJoinRequestSubmitting"
          >
            {{ isJoinRequestSubmitting ? '처리 중...' : '신청하기' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 확인 모달 -->
    <div v-if="showConfirmModal" class="modal-backdrop" @click="showConfirmModal = false">
      <div class="confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>멤버 강제 퇴출</h3>
          <button class="close-button" @click="showConfirmModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>
            <strong>{{ confirmTargetMember?.nickname }}</strong> 님을 스터디에서 강제로 탈퇴시키겠습니까?
          </p>
          <p class="warning-text">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showConfirmModal = false">취소</button>
          <button 
            class="btn btn-danger" 
            @click="removeMember" 
            :disabled="isRemoving"
          >
            {{ isRemoving ? '처리 중...' : '강제 탈퇴' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';
import SendMessageModal from '../../components/messages/SendMessageModal.vue';
import MemberActionMenu from '../../components/messages/MemberActionMenu.vue';
import type { User, StudyGroup } from '../../types/models';
import studyGroupService from '../../utils/studyGroupService';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const studyGroup = ref<StudyGroup | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isJoinLoading = ref(false);
const isDeleteLoading = ref(false);
const joinRequestStatus = ref<string | null>(null);

// 멤버 관리 관련 상태
const selectedMember = ref<User | null>(null);
const messageRecipient = ref<User | null>(null);
const showSendMessageModal = ref(false);
const showConfirmModal = ref(false);
const confirmTargetMember = ref<User | null>(null);
const isRemoving = ref(false);
const menuPosition = ref<{ top: string, left: string } | null>(null);

// 참여 신청 모달 관련 상태
const showJoinRequestModal = ref(false);
const isJoinRequestSubmitting = ref(false);
const joinRequest = ref({
  reason: '',
  experience: '',
  agreement: false
});

const isCreator = computed(() => {
  return studyGroup.value?.creator
    ? studyGroup.value.creator.id === userStore.user?.id
    : false;
});

const isAlreadyMember = computed(() => {
  return studyGroup.value && studyGroup.value.members
    ? studyGroup.value.members.some(m => m.id === userStore.user?.id)
    : false;
});

// 참여 버튼 텍스트 계산
const joinButtonText = computed(() => {
  if (isJoinLoading.value) return '처리 중...';
  if (isCreator.value) return '소유자 (참여 불가)';
  if (isAlreadyMember.value) return '이미 참여중';
  if (joinRequestStatus.value === 'pending') return '승인 대기중';
  if (joinRequestStatus.value === 'rejected') return '재신청하기';
  return '참여 신청';
});

// 참여 신청 버튼 클릭 처리
const joinStudyGroup = async () => {
  if (!userStore.isLoggedIn || !studyGroup.value) return;
  if (isAlreadyMember.value || isCreator.value) return;
  
  // 승인 대기 중이면 신청 불가
  if (joinRequestStatus.value === 'pending') {
    alert('이미 참여 신청이 진행 중입니다. 방장의 승인을 기다려주세요.');
    return;
  }
  
  // 참여 신청 모달 표시
  showJoinRequestModal.value = true;
};

// 스터디 그룹 참여 요청 상태 확인
const checkJoinRequestStatus = async () => {
  if (!userStore.isLoggedIn || !studyGroup.value || isCreator.value || isAlreadyMember.value) return;
  
  try {
    const response = await studyGroupService.checkJoinRequestStatus(studyGroup.value.id);
    if (response.data && response.data.status) {
      joinRequestStatus.value = response.data.status;
    } else {
      joinRequestStatus.value = null;
    }
  } catch (error) {
    console.error('참여 요청 상태 확인 실패:', error);
    joinRequestStatus.value = null;
  }
};

// 스터디 그룹 정보 로드
const loadStudyGroup = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const id = route.params.id;
    const response = await axios.get(`/study-groups/${id}`);
    studyGroup.value = response.data.data;
    
    // 참여 요청 상태 확인
    await checkJoinRequestStatus();
  } catch (err: any) {
    error.value = err.response?.data?.message || '스터디 그룹 정보를 불러오는데 실패했습니다.';
    console.error('스터디 그룹 불러오기 실패:', err);
  } finally {
    isLoading.value = false;
  }
};

const handleEdit = () => {
  router.push(`/study-groups/${route.params.id}/edit`);
};

const handleDelete = async () => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;

  isDeleteLoading.value = true;
  try {
    await axios.delete(`/study-groups/${route.params.id}`);
    alert('스터디 그룹이 삭제되었습니다.');
    await router.push('/study-groups');
  } catch (error: any) {
    console.error('스터디 그룹 삭제 실패:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      error.value = '로그인이 필요합니다. 다시 로그인해주세요.';
    } else {
      error.value = '스터디 그룹 삭제에 실패했습니다: ' + (error.response?.data?.message || error.message);
    }
  } finally {
    isDeleteLoading.value = false;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

const goToList = () => {
  router.push({
    path: '/study-groups',
    query: {
      mainCategory: studyGroup.value?.mainCategory,
      subCategory: studyGroup.value?.subCategory,
      detailCategory: studyGroup.value?.detailCategory,
    },
  });
};

// 멤버 클릭 핸들러
const handleMemberClick = (member: User, event: MouseEvent) => {
  // 이벤트 전파 중지
  event.stopPropagation();
  
  if (selectedMember.value?.id === member.id) {
    selectedMember.value = null;
  } else {
    selectedMember.value = member;
    
    // 클릭한 요소의 위치 정보 저장
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    
    // 메뉴가 멤버 바로 아래에 표시되도록 설정 (fixed 위치는 viewport 기준)
    menuPosition.value = {
      top: `${rect.bottom + 5}px`, // viewport 상단에서부터의 거리
      left: `${rect.left}px` // viewport 왼쪽에서부터의 거리
    };
  }
};

// 쪽지 보내기 모달 열기
const openSendMessageModal = (member: User) => {
  messageRecipient.value = member;
  showSendMessageModal.value = true;
  selectedMember.value = null;
};

// 쪽지 전송 완료 핸들러
const handleMessageSent = () => {
  alert(`${messageRecipient.value?.nickname}님에게 쪽지를 보냈습니다.`);
};

// 멤버 강제 탈퇴 모달 열기
const openRemoveMemberConfirm = (member: User) => {
  confirmTargetMember.value = member;
  showConfirmModal.value = true;
  selectedMember.value = null;
};

// 멤버 강제 탈퇴 실행
const removeMember = async () => {
  if (!confirmTargetMember.value || !studyGroup.value) return;
  
  isRemoving.value = true;
  try {
    // 스터디 그룹장이 강제 탈퇴시키는 API 호출 (백엔드에서 구현 필요)
    await axios.delete(`/study-groups/${studyGroup.value.id}/members/${confirmTargetMember.value.id}`);
    alert(`${confirmTargetMember.value.nickname}님을 스터디에서 탈퇴시켰습니다.`);
    
    // 스터디 그룹 정보 새로고침
    await loadStudyGroup();
    
    // 모달 닫기
    showConfirmModal.value = false;
    confirmTargetMember.value = null;
  } catch (error: any) {
    console.error('멤버 강제 탈퇴 실패:', error);
    alert(error.response?.data?.message || '멤버 강제 탈퇴에 실패했습니다.');
  } finally {
    isRemoving.value = false;
  }
};

// 문서 클릭 이벤트로 메뉴 닫기
const handleDocumentClick = (event: MouseEvent) => {
  if (selectedMember.value) {
    const menuContainer = document.querySelector('.member-menu-container');
    if (menuContainer && !menuContainer.contains(event.target as Node)) {
      selectedMember.value = null;
    }
  }
};

// 참여 신청 유효성 검사
const isJoinRequestValid = computed(() => {
  return joinRequest.value.reason.trim() !== '' && 
         joinRequest.value.experience.trim() !== '' && 
         joinRequest.value.agreement === true;
});

// 참여 신청서 제출
const submitJoinRequest = async () => {
  if (!userStore.isLoggedIn || !studyGroup.value) return;

  isJoinRequestSubmitting.value = true;
  try {
    // 스터디 그룹 신청 API 호출
    await studyGroupService.joinStudyGroup(Number(route.params.id), {
      reason: joinRequest.value.reason,
      experience: joinRequest.value.experience
    });
    
    // 참여 신청 완료 후 처리
    alert('스터디 그룹 참여 신청이 완료되었습니다. 방장의 승인을 기다려주세요.');
    showJoinRequestModal.value = false;
    
    // 방장에게 쪽지 보내기
    if (studyGroup.value.creator) {
      try {
        await axios.post('/messages', {
          receiverId: studyGroup.value.creator.id,
          content: `[스터디 참여 신청] ${userStore.user?.nickname || '사용자'}님이 '${studyGroup.value.name}' 스터디에 참여를 신청했습니다. 마이페이지에서 신청을 확인해주세요.`,
          studyGroupId: studyGroup.value.id
        });
      } catch (error) {
        console.error('방장에게 메시지 전송 실패:', error);
      }
    }
    
    // 폼 초기화
    joinRequest.value = {
      reason: '',
      experience: '',
      agreement: false
    };
    
  } catch (error: any) {
    console.error('스터디 그룹 참여 신청 실패:', error);
    alert(error.response?.data?.message || '참여 신청에 실패했습니다.');
  } finally {
    isJoinRequestSubmitting.value = false;
  }
};

onMounted(async () => {
  await loadStudyGroup();
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick);
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
}

.page-header {
  color: white;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
}

.page-header h1.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
}

.category-path {
  font-size: 1.1rem;
  opacity: 0.9;
}

.separator {
  margin: 0 0.5rem;
  opacity: 0.7;
}

.page-content {
  padding: 2rem;
}

.content-section {
  padding: 2rem;
}

.info-card {
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-header {
  margin-bottom: 1.5rem;
}

.info-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.meta-info {
  display: flex;
  gap: 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;
}

.meta-info span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.meta-info .study-way {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.meta-info .study-way i {
  color: #4A90E2;
}

.description {
  color: #4a5568;
  line-height: 1.7;
  white-space: pre-wrap;
}

.members-card {
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.members-card h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.members-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 50px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
}

.member-item:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  background-color: #f7fafc;
  transform: translateY(-2px);
}

.member-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: #4A90E2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.member-name {
  font-weight: 500;
  color: #2d3748;
}

.creator-badge {
  background: #4A90E2;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}

.member-menu-container {
  position: fixed;
  z-index: 1001;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  padding: 0;
  min-width: 160px;
  max-width: 90vw; /* 화면 너비의 90%를 넘지 않도록 */
}

/* 화살표 추가 - 메뉴 상단 중앙에 작은 삼각형 화살표 */
.member-menu-container::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 20px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.04);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.action-buttons button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.join-button {
  background: #4A90E2;
  color: white;
  border: none;
}

.join-button:hover {
  background: #357ABD;
  transform: translateY(-2px);
}

.join-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.edit-button {
  background: #48BB78;
  color: white;
  border: none;
}

.edit-button:hover {
  background: #38A169;
}

.delete-button {
  background: #F56565;
  color: white;
  border: none;
}

.delete-button:hover {
  background: #E53E3E;
}

.list-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
}

.list-button:hover {
  background: #cbd5e0;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: #4a5568;
  font-size: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .meta-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}

.no-members {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-size: 0.95rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--primary-color);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: var(--danger-color);
  text-align: center;
  margin-top: 2rem;
  font-weight: bold;
}

/* 확인 모달 스타일 */
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

.confirm-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
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

.warning-text {
  color: #e53e3e;
  font-size: 0.9rem;
  margin-top: 0.5rem;
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

.btn-danger:disabled {
  background-color: #feb2b2;
  cursor: not-allowed;
}

.document-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999; /* 메뉴보다 낮은 z-index */
}

.menu-container-wrapper {
  position: relative;
  z-index: 1000;
}

/* 참여 신청 모달 스타일 */
.join-request-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.join-modal-description {
  margin-bottom: 1.5rem;
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2d3748;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #4A90E2;
  outline: none;
}

.agreement-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.agreement-checkbox input[type="checkbox"] {
  margin-top: 0.25rem;
}

.agreement-checkbox label {
  margin-bottom: 0;
  font-size: 0.95rem;
  line-height: 1.5;
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

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.btn-danger {
  background-color: #F56565;
  color: white;
}

.btn-danger:hover {
  background-color: #E53E3E;
}
</style>
