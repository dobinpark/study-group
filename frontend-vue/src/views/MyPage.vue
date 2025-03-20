<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>마이페이지</h1>
        </header>
        <main class="page-content">
          <div class="user-profile">
            <div class="profile-avatar">
              <span v-if="userStore.user">{{ userStore.user.nickname?.[0] || userStore.user.username?.[0] || '?' }}</span>
            </div>
            <div class="profile-info">
              <h2>{{ userStore.user?.nickname || userStore.user?.username || '사용자' }}님</h2>
              <p>환영합니다!</p>
            </div>
          </div>

          <div class="menu-cards">
            <div class="menu-card" @click="navigateTo('/messages')">
              <div class="card-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="card-content">
                <h3>쪽지함</h3>
                <p>받은 쪽지를 확인하고 답장을 보내세요</p>
              </div>
              <div class="card-action">
                <button class="btn btn-primary">바로가기</button>
              </div>
            </div>

            <div class="menu-card" @click="navigateTo('/profile')">
              <div class="card-icon">
                <i class="fas fa-user-edit"></i>
              </div>
              <div class="card-content">
                <h3>프로필 수정</h3>
                <p>내 정보를 관리하고 수정하세요</p>
              </div>
              <div class="card-action">
                <button class="btn btn-primary">바로가기</button>
              </div>
            </div>

            <div class="menu-card" @click="navigateTo('/my-studies')">
              <div class="card-icon">
                <i class="fas fa-book"></i>
              </div>
              <div class="card-content">
                <h3>내 스터디</h3>
                <p>참여 중인 스터디를 확인하세요</p>
              </div>
              <div class="card-action">
                <button class="btn btn-primary">바로가기</button>
              </div>
            </div>
          </div>

          <!-- 내 활동 요약과 스터디 참여 요청 관리를 그리드로 배치 -->
          <div class="dashboard-grid">
            <!-- 내 활동 요약 카드 (왼쪽) -->
            <div class="stat-card">
              <h4>내 활동 요약</h4>
              <div class="stat-items">
                <div class="stat-item">
                  <span class="stat-label">참여 스터디</span>
                  <span class="stat-value">{{ studyCount }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">안읽은 쪽지</span>
                  <span class="stat-value">{{ unreadMessageCount }}</span>
                </div>
              </div>
            </div>

            <!-- 스터디 참여 요청 관리 카드 (오른쪽) -->
            <div v-if="hasCreatedStudies" class="request-manage-card">
              <h4>스터디 참여 요청 관리</h4>
              <p class="card-description">생성한 스터디의 참여 요청을 확인하고 관리하세요.</p>
              <button @click="navigateTo('/study-requests')" class="btn-action">
                <i class="fas fa-clipboard-list"></i>
                참여 요청 관리하기
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import axios from '../utils/axios';
import type { StudyGroup } from '../types/models';

const router = useRouter();
const userStore = useUserStore();
const studyCount = ref(0);
const unreadMessageCount = ref(0);
const createdStudyCount = ref(0);

// 방장인 스터디가 있는지 확인
const hasCreatedStudies = computed(() => createdStudyCount.value > 0);

// 페이지 이동 함수
const navigateTo = (path: string) => {
  router.push(path);
};

// 내 스터디 수 가져오기
const fetchStudyCount = async () => {
  try {
    const response = await axios.get('/study-groups/my-studies');
    console.log('스터디 응답 데이터:', response.data);
    
    // 응답 구조에 따라 데이터 추출
    if (response.status === 200) {
      if (response.data.data && Array.isArray(response.data.data)) {
        // 배열인 경우 길이를 사용
        studyCount.value = response.data.data.length;
      } else if (response.data.data && typeof response.data.data === 'object') {
        // 객체인 경우 키의 개수를 사용
        studyCount.value = Object.keys(response.data.data).length;
      } else if (response.data.count !== undefined) {
        // count 속성이 있는 경우
        studyCount.value = response.data.count;
      } else if (typeof response.data.data === 'number') {
        // 숫자 값인 경우
        studyCount.value = response.data.data;
      } else {
        console.error('스터디 데이터 형식을 인식할 수 없습니다:', response.data);
        studyCount.value = 0;
      }
      
      // 생성한 스터디 개수 확인 (방장인 스터디)
      if (response.data.data && Array.isArray(response.data.data)) {
        createdStudyCount.value = response.data.data.filter(
          (study: StudyGroup) => study.creator && study.creator.id === userStore.user?.id
        ).length;
      } else if (response.data.created && Array.isArray(response.data.created)) {
        createdStudyCount.value = response.data.created.length;
      }
    }
  } catch (error) {
    console.error('스터디 정보를 불러오는데 실패했습니다:', error);
    studyCount.value = 0;
    createdStudyCount.value = 0;
  }
};

// 안읽은 쪽지 수 가져오기
const fetchUnreadMessageCount = async () => {
  try {
    const response = await axios.get('/messages/unread-count');
    if (response.status === 200 && response.data.data !== undefined) {
      unreadMessageCount.value = response.data.data;
    }
  } catch (error) {
    console.error('안읽은 쪽지 수를 불러오는데 실패했습니다:', error);
  }
};

onMounted(async () => {
  // 로그인 상태 확인
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  // 데이터 로드
  fetchStudyCount();
  fetchUnreadMessageCount();
});
</script>

<style scoped>
@import '../assets/styles/common.css';

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8fafc;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #4A90E2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1.5rem;
}

.profile-info h2 {
  font-size: 2.0rem;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.profile-info p {
  color: #718096;
  font-size: 1.5rem;
}

.menu-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.menu-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 1.5rem;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background-color: #EBF4FF;
  margin-bottom: 1rem;
}

.card-icon i {
  color: #4A90E2;
  font-size: 1.5rem;
}

.card-content {
  flex-grow: 1;
}

.card-content h3 {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.card-content p {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}

.card-action {
  margin-top: auto;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  text-align: center;
}

.btn-primary {
  background-color: #4A90E2;
  color: white;
  width: 100%;
}

.btn-primary:hover {
  background-color: #357ABD;
}

/* 대시보드 그리드 레이아웃 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  height: 100%;
}

.stat-card h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.stat-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #4A90E2;
}

.request-manage-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.request-manage-card h4 {
  font-size: 1.1rem;
  color: #2d3748;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.card-description {
  color: #718096;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #4A90E2;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
  margin-top: auto;
}

.btn-action:hover {
  background-color: #357ABD;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .request-manage-card {
    margin-top: 1.5rem;
  }
  
  .menu-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-items {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  
  .stat-item {
    width: 45%;
  }
  
  .btn-action {
    width: 100%;
    justify-content: center;
  }
}
</style> 