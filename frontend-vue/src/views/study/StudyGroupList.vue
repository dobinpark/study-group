<template>
  <div class="study-list-container">
    <h1 class="title">스터디 그룹 목록</h1>
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
      <button @click="createStudyGroup" class="create-button">
        스터디 만들기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';
import type { Category } from '../../types/category';

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
const studyGroups = ref<StudyGroup[]>([]);
const searchQuery = ref('');
const loading = ref(true);
const categories = ref<Category[]>([]);

// 현재 선택된 메인 카테고리
const currentMainCategory = computed(() => route.query.mainCategory as string);
// 현재 선택된 서브 카테고리
const currentSubCategory = computed(() => route.query.subCategory as string);

// 스터디 그룹 목록 가져오기
const fetchStudyGroups = async () => {
  loading.value = true;
  try {
    const response = await axios.get('/study-groups');
    studyGroups.value = response.data;
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      alert('스터디 그룹 목록을 불러오는데 실패했습니다.');
    }
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
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      console.error('카테고리 조회 실패:', error);
      alert('카테고리 정보를 불러오는데 실패했습니다.');
    }
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
const createStudyGroup = () => {
  if (!userStore.isLoggedIn) {
    alert('로그인이 필요한 서비스입니다.');
    router.push('/login');
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

// 세부 카테고리 선택
const selectDetailCategory = (detailCategory: string) => {
  router.push({
    query: {
      ...route.query,
      detailCategory,
    },
  });
};

// 컴포넌트가 마운트될 때 스터디 그룹 및 카테고리 목록 가져오기
onMounted(() => {
  fetchStudyGroups();
  fetchCategories();
});

// 라우트 쿼리가 변경될 때마다 스터디 그룹 목록 새로 가져오기
watch(
  () => route.query,
  () => {
    fetchStudyGroups();
  },
  { deep: true },
);

// 스터디 그룹 목록이 변경될 때마다 카테고리 목록 새로 가져오기
watch(studyGroups, () => {
  fetchCategories();
});

// 현재 선택된 메인/서브 카테고리에 해당하는 카테고리만 필터링
const filteredCategories = computed(() => {
  return categories.value.filter(
    (category) =>
      category.mainCategory === currentMainCategory.value &&
      category.subCategory === currentSubCategory.value,
  );
});

// 카테고리 데이터가 변경될 때마다 로그 출력
watch(
  categories,
  (newCategories) => {
    console.log('Categories updated:', newCategories);
  },
  { deep: true },
);

// 스터디 그룹이나 카테고리가 변경될 때마다 카테고리 정보 새로 로드
watch(
  [studyGroups, route.query],
  () => {
    fetchCategories();
  },
  { deep: true },
);
</script>

<style scoped>
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
  background: white;
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
  background-color: #f7fafc;
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
  background-color: #f8f9fa;
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
  background-color: white;
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
</style>
