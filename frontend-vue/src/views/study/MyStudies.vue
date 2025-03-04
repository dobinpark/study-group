<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>내 스터디</h1>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            로딩 중...
          </div>

          <div v-else>
            <section class="study-section">
              <h2>내가 만든 스터디</h2>
              <div v-if="createdStudies.length === 0" class="empty-state">
                <p>아직 만든 스터디가 없습니다.</p>
                <p class="empty-state-description">새로운 스터디를 만들어 함께 공부해보세요!</p>
                <router-link to="/study-groups/create" class="btn btn-primary">스터디 만들기</router-link>
              </div>
              <div v-else class="study-grid">
                <div v-for="study in createdStudies" :key="study.id" class="study-card">
                  <div class="study-card-header">
                    <h3>{{ study.name }}</h3>
                    <div class="category-path">
                      {{ study.mainCategory }} > {{ study.subCategory }} > {{ study.detailCategory }}
                    </div>
                  </div>
                  <div class="study-card-content">
                    <p>{{ study.content }}</p>
                    <div class="study-meta">
                      <span>참여 인원: {{ study.members?.length || 0 }}/{{ study.maxMembers }}</span>
                      <span>생성일: {{ formatDate(study.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="study-card-footer">
                    <button @click="goToDetail(study.id)" class="btn btn-primary">상세보기</button>
                    <button @click="goToEdit(study.id)" class="btn btn-secondary">수정</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="study-section">
              <h2>참여 중인 스터디</h2>
              <div v-if="joinedStudies.length === 0" class="empty-state">
                <p>아직 참여 중인 스터디가 없습니다.</p>
                <p class="empty-state-description">관심 있는 스터디에 참여해보세요!</p>
                <router-link to="/study-groups" class="btn btn-primary">스터디 찾아보기</router-link>
              </div>
              <div v-else class="study-grid">
                <div v-for="study in joinedStudies" :key="study.id" class="study-card">
                  <div class="study-card-header">
                    <h3>{{ study.name }}</h3>
                    <div class="category-path">
                      {{ study.mainCategory }} > {{ study.subCategory }} > {{ study.detailCategory }}
                    </div>
                  </div>
                  <div class="study-card-content">
                    <p>{{ study.content }}</p>
                    <div class="study-meta">
                      <span>참여 인원: {{ study.members?.length || 0 }}/{{ study.maxMembers }}</span>
                      <span>생성일: {{ formatDate(study.createdAt) }}</span>
                    </div>
                  </div>
                  <div class="study-card-footer">
                    <button @click="goToDetail(study.id)" class="btn btn-primary">상세보기</button>
                    <button @click="leaveStudy(study.id)" class="btn btn-danger">탈퇴</button>
                  </div>
                </div>
              </div>
            </section>
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
import { isAxiosError } from 'axios';
import type { StudyGroup } from '../../types/models';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

const router = useRouter();
const createdStudies = ref<StudyGroup[]>([]);
const joinedStudies = ref<StudyGroup[]>([]);
const loading = ref(true);
const errorMessage = ref('');

// 인터페이스 직접 정의
interface StudyGroupResponse {
  success: boolean;
  message?: string;
  data: {
    created: StudyGroup[];
    joined: StudyGroup[];
  };
}

// 내 스터디 목록 가져오기
const fetchMyStudies = async () => {
  try {
    loading.value = true;
    const response = await axios.get<StudyGroupResponse>('study-groups/my-studies');

    if (response.data.success) {
      createdStudies.value = response.data.data.created || [];
      joinedStudies.value = response.data.data.joined || [];
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
        await router.push('/login');
      } else if (error.response?.status === 403) {
        alert('접근 권한이 없습니다.');
        await router.push('/');
      } else {
        const errorMessage = error.response?.data?.message || '스터디 그룹 조회에 실패했습니다.';
        alert(errorMessage);
      }
    }
  } finally {
    loading.value = false;
  }
};

// 날짜 형식 변환
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

// 텍스트 자르기
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// 스터디 상세 페이지로 이동
const goToDetail = (studyId: number) => {
  router.push(`/study-groups/${studyId}`);
};

// 스터디 수정 페이지로 이동
const goToEdit = (studyId: number) => {
  router.push(`/study-groups/${studyId}/edit`);
};

// 스터디 탈퇴
const leaveStudy = async (studyId: number) => {
  try {
    if (!confirm('정말로 스터디를 탈퇴하시겠습니까?')) {
      return;
    }

    await axios.delete(`/study-groups/${studyId}/leave`);
    await fetchMyStudies(); // 목록 새로고침
    alert('스터디를 탈퇴했습니다.');
  } catch (error) {
    console.error('스터디 탈퇴 실패:', error);
    alert('스터디 탈퇴에 실패했습니다.');
  }
};

// 컴포넌트가 마운트될 때 내 스터디 목록 가져오기
onMounted(() => {
  fetchMyStudies();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

/* 페이지별 고유한 스타일만 추가 */
.study-section {
  margin-bottom: 3rem;
}

.study-section h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.study-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.study-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.study-card:hover {
  transform: translateY(-5px);
}

.study-card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.study-card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.category-path {
  font-size: 0.875rem;
  color: #718096;
}

.study-card-content {
  padding: 1.5rem;
}

.study-meta {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.study-card-footer {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  display: flex;
  gap: 1rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
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
  .study-grid {
    grid-template-columns: 1fr;
  }

  .study-card-footer {
    flex-direction: column;
  }
}

.empty-state {
  text-align: center;
  padding: 2rem;
  border-radius: 8px;
  color: #64748b;
}

.empty-state .btn {
  margin-top: 1rem;
}

.empty-state-description {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #94a3b8;
}
</style>
