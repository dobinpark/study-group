<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1 class="title">{{ studyGroup.name }}</h1>
          <div class="category-path">
            <span>{{ studyGroup.mainCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup.subCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup.detailCategory }}</span>
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
                <div v-for="member in studyGroup.members" :key="member.id" class="member-item">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';

interface User {
  id: number;
  nickname: string;
}

interface StudyGroup {
  id: number;
  name: string;
  content: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  creator: User;
  members: User[];
  maxMembers: number;
  createdAt: string;
  isOnline: boolean;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const studyGroup = ref<StudyGroup | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isJoinLoading = ref(false);
const isDeleteLoading = ref(false);

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

const joinButtonText = computed(() => {
  if (!userStore.isLoggedIn) return '로그인 후 참여';
  if (isCreator.value) return '내가 만든 스터디입니다';
  if (isAlreadyMember.value) return '이미 참여하였습니다';
  return '스터디 참여하기';
});

const loadStudyGroup = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`/study-groups/${route.params.id}`);

    console.log('API 응답 데이터 (response.data):', response.data);
    console.log('스터디 그룹 데이터 (studyGroup.value):', studyGroup.value);

    studyGroup.value = response.data.data;

  } catch (error: any) {
    console.error('스터디 그룹 정보 로딩 실패:', error);
    error.value = error.response?.data?.message || '스터디 그룹 정보를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

const joinStudyGroup = async () => {
  if (!userStore.isLoggedIn) {
    await router.push('/login');
    return;
  }

  isJoinLoading.value = true;
  try {
    await axios.post(`/study-groups/${route.params.id}/join`);
    await loadStudyGroup();
    alert('스터디 그룹에 참여하였습니다.');
  } catch (error: any) {
    console.error('스터디 그룹 참여 실패:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      error.value = '로그인이 필요합니다. 다시 로그인해주세요.';
    } else {
      error.value = error.response?.data?.message || '참여에 실패했습니다.';
    }
  } finally {
    isJoinLoading.value = false;
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
  router.push('/study-groups');
};

onMounted(async () => {
  await loadStudyGroup();
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

.page-inner {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
</style>
