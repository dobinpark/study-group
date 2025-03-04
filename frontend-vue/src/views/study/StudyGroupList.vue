<template>
  <div class="study-list-container">
    <div class="page-container">
      <div class="page-inner">
        <div class="content-card">
          <header class="page-header">
            <h1>스터디 그룹 찾기</h1>
            <div class="category-path">
              <span v-if="mainCategory">{{ mainCategory }}</span>
              <span v-if="mainCategory && subCategory" class="path-separator">></span>
              <span v-if="subCategory">{{ subCategory }}</span>
              <span v-if="(mainCategory || subCategory) && detailCategory" class="path-separator">></span>
              <span v-if="detailCategory" class="detail-category">{{ detailCategory }}</span>
            </div>
          </header>

          <main class="page-content">
            <div v-if="route.query.mainCategory" class="category-path">
              <span class="main-category">{{ route.query.mainCategory }}</span>
              <span v-if="route.query.subCategory" class="path-separator"> > </span>
              <span v-if="route.query.subCategory" class="sub-category">{{ route.query.subCategory }}</span>
            </div>
            <div v-if="loading" class="loading">로딩 중...</div>
            <div v-else-if="studyGroups && studyGroups.length > 0" class="study-groups">
              <div v-for="studyGroup in studyGroups" :key="studyGroup.id" class="study-group-card"
                @click="goToDetail(studyGroup.id)">
                <h2 class="study-group-title">{{ studyGroup.name }}</h2>
                <div class="study-group-meta">
                  <span class="category">{{ studyGroup.mainCategory }} >
                    {{ studyGroup.subCategory }} >
                    {{ studyGroup.detailCategory }}</span>
                  <span class="creator">작성자: {{ studyGroup.creator?.nickname }}</span>
                  <span class="members">참여 인원: {{ studyGroup.members?.length || 0 }}/{{
                    studyGroup.maxMembers
                    }}</span>
                  <span class="date">{{
                    formatDate(studyGroup.createdAt)
                    }}</span>
                </div>
                <p class="study-group-content">
                  {{ truncateContent(studyGroup?.description) }}
                </p>
              </div>
            </div>
            <div v-else class="no-results">검색 결과가 없습니다.</div>

            <div class="action-bar">
              <div class="search-box">
                <input type="text" v-model="searchQuery" placeholder="스터디 그룹 검색" @keyup.enter="search" />
                <button @click="search" class="search-button">검색</button>
              </div>
              <button @click="goToCreateStudyGroup" class="create-button">
                스터디 만들기
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';
import type { Category } from '../../types/models';
import { useAuthStore } from '../../store/auth';

// 사용자 인터페이스 정의
interface User {
  id: number;
  nickname: string;
}

// 스터디 그룹 인터페이스 정의
interface StudyGroup {
  id: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  description: string;
  creator: User;
  members: User[];
  maxMembers: number;
  createdAt: string;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const studyGroups = ref<StudyGroup[]>([]);
const searchQuery = ref('');
const loading = ref(true);
const categories = ref<Category[]>([]);

// 카테고리 정보
const mainCategory = ref('');
const subCategory = ref('');
const detailCategory = ref('');

// 스터디 그룹 목록 가져오기
const fetchStudyGroups = async () => {
  loading.value = true;
  try {
    const params: any = { page: 1, limit: 9 }; // 페이지네이션 기본값 및 limit 상수화
    if (mainCategory.value) {
      params.mainCategory = mainCategory.value;
    }
    if (subCategory.value) {
      params.subCategory = subCategory.value;
    }
    if (detailCategory.value) {
      params.detailCategory = detailCategory.value;
    }

    const response = await axios.get('/study-groups', { params });

    if (response.data.success) {
      studyGroups.value = response.data.data || [];
      // totalItems, totalPages는 템플릿에서 직접 계산하거나 computed 속성으로 처리
    }
  } catch (error) {
    console.error('스터디 그룹 목록 로드 실패:', error);
    const errorMsg = error instanceof Error ? error.message : '스터디 그룹 목록을 불러오는데 실패했습니다.';
    alert(errorMsg);
  } finally {
    loading.value = false;
  }
};

// 카테고리 목록 가져오기
const fetchCategories = async () => {
  try {
    const response = await axios.get('/study-groups/categories/stats');
    categories.value = response.data;
    console.log('카테고리 데이터:', response.data);
  } catch (error: any) {
    console.error('카테고리 조회 실패:', error);
    alert('카테고리 정보를 불러오는데 실패했습니다.');
  }
};

// 스터디 그룹 상세 페이지로 이동
const goToDetail = (id: number) => {
  if (!id || isNaN(id)) {
    console.error('유효하지 않은 스터디 그룹 ID:', id);
    return;
  }
  router.push(`/study-groups/${id}`);
};

// 스터디 그룹 생성 페이지로 이동
const goToCreateStudyGroup = () => {
  if (!authStore.isAuthenticated) {
    alert('스터디 그룹 생성은 로그인이 필요합니다.');
    router.push('/login?redirect=/study-groups/create');
    return;
  }
  router.push('/study-groups/create');
};

// 날짜 형식 변환
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR');
};

// 텍스트 자르기
const truncateContent = (content: string | undefined) => {
  if (!content) return '';
  return content.length > 100 ? content.substring(0, 100) + '...' : content;
};

// 검색 기능
const search = () => {
  fetchStudyGroups();
};

// 세부 카테고리 선택 (더 이상 router.push 사용하지 않음)
const selectDetailCategory = (selectedDetail: string) => {
  detailCategory.value = selectedDetail;
  fetchStudyGroups(); // API 호출을 통해 목록 업데이트
};

// 카테고리 선택 처리
const handleCategoryClick = (selectedMain: string, selectedSub: string, selectedDetail: string) => {
  mainCategory.value = selectedMain;
  subCategory.value = selectedSub;
  detailCategory.value = selectedDetail;
  fetchStudyGroups(); // API 호출을 통해 목록 업데이트
};

// 컴포넌트가 마운트될 때 스터디 그룹 및 카테고리 목록 가져오기
onMounted(() => {
  fetchStudyGroups();
  fetchCategories();
  updateCategoryInfoFromRoute();
});

// route.query 감시 및 스터디 그룹 다시 로드 (페이지네이션, 검색, 카테고리 변경에 대응)
watch(
  () => route.query,
  () => {
    updateCategoryInfoFromRoute(); // route 변경 시 카테고리 정보 업데이트
    fetchStudyGroups(); // 변경된 쿼리에 따라 스터디 그룹 다시 로드
  },
  { deep: true }
);

// studyGroups가 변경될 때 카테고리 다시 가져오기 (필요 없을 수 있음)
watch(studyGroups, () => {
  fetchCategories();
});

// 카테고리 데이터 변경 감시 (디버깅 용도, 실제 기능에는 불필요할 수 있음)
watch(
  categories,
  (newCategories) => {
    console.log('Categories updated:', newCategories);
  },
  { deep: true }
);

// 카테고리 정보 업데이트 함수 (route.query 기반)
const updateCategoryInfoFromRoute = () => {
  mainCategory.value = route.query.mainCategory as string || '';
  subCategory.value = route.query.subCategory as string || '';
  detailCategory.value = route.query.detailCategory as string || '';
};
</script>

<style scoped>
@import '../../assets/styles/common.css';

.study-list-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 2rem;
  text-align: center;
}

.study-groups {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.study-group-card {
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.study-group-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.study-group-title {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.study-group-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #4a5568;
}

.category {
  color: #4a90e2;
}

.study-group-content {
  color: #4a5568;
  font-size: 0.875rem;
  line-height: 1.5;
}

.action-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 0 1rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  max-width: 400px;
}

.search-box input {
  height: 40px;
  padding: 0 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 300px;
  transition: border-color 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #4a90e2;
}

.search-button {
  height: 40px;
  padding: 0 1.2rem;
  background-color: #4a90e2;
  color: white;
  font-weight: 500;
  border-radius: 6px;
  font-size: 0.95rem;
  width: 80px;
}

.search-button:hover {
  background-color: #357abd;
}

.create-button {
  height: 40px;
  padding: 0 1.5rem;
  background-color: #4a90e2;
  color: white;
  font-weight: 600;
  border-radius: 6px;
  font-size: 0.95rem;
  box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
  transition: all 0.2s ease;
}

.create-button:hover {
  background-color: #357abd;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.3);
}

.loading {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4a5568;
}

.no-results {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #4a5568;
}

.category-path {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 8px;
  color: #4a5568;
}

.main-category {
  font-weight: 600;
  color: #4a90e2;
}

.path-separator {
  margin: 0 0.5rem;
  color: #718096;
}

.sub-category {
  font-weight: 600;
  color: #4a90e2;
}

.category-section {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.category-item {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.category-item:hover {
  background-color: #4a90e2;
  color: white;
}

.category-name {
  font-weight: 500;
}

.category-count {
  margin-left: 0.5rem;
  font-weight: 600;
  color: #4a90e2;
}

.category-item:hover .category-count {
  color: white;
}

/* 카테고리 경로 스타일 */
.category-path {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-color-light);
}

.path-separator {
  margin: 0 0.5rem;
  color: var(--text-color-lighter);
}

.detail-category {
  color: var(--primary-color);
  font-weight: 500;
}
</style>
