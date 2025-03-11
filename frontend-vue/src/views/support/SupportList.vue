<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }}</h1>
        </header>
        <main class="page-content">
          <div class="action-bar">
            <div class="search-box">
              <input type="text" v-model="searchQuery" placeholder="검색어 입력" @keyup.enter="search" :disabled="loading" />
              <button class="search-button" @click="search" :disabled="loading">검색</button>
            </div>
          </div>

          <!-- 게시글 목록 - 데이터가 없어도 테이블 구조를 보여줌 -->
          <div class="post-list" v-if="!loading && supports">
            <table>
              <thead>
                <tr>
                  <th width="10%">번호</th>
                  <th width="50%">제목</th>
                  <th width="15%">작성자</th>
                  <th width="15%">작성일</th>
                  <th width="10%">조회수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="supports.length === 0">
                  <td colspan="5" class="no-posts">게시글이 없습니다.</td>
                </tr>
                <tr v-for="support in supports" :key="support.id" @click="viewSupport(support.id)">
                  <td>{{ support.displayNumber || '-' }}</td>
                  <td class="title">{{ support.title }}</td>
                  <td>{{ support.author?.nickname || support.author?.username || '알 수 없음' }}</td>
                  <td>{{ formatDate(support.createdAt) }}</td>
                  <td>{{ support.views }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 로딩 중일 때 표시 -->
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>게시글을 불러오는 중입니다...</p>
          </div>
          <div v-else-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-else-if="!supports" class="loading">
            게시글 목록이 없습니다.
          </div>

          <!-- 페이지네이션 및 글쓰기 버튼 -->
          <div class="bottom-actions">
            <div class="pagination" v-if="totalPages > 0">
              <button :disabled="loading || page === 1" @click="changePage(page - 1)">
                이전
              </button>
              <span>{{ page }} / {{ totalPages }}</span>
              <button :disabled="loading || page === totalPages || totalPages === 0" @click="changePage(page + 1)">
                다음
              </button>
            </div>
            <button class="write-button" @click="createSupport" v-if="userStore.isLoggedIn"
              :disabled="loading">글쓰기</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { PostCategoryKorean } from '../../types/models';
dayjs.locale('ko');

// SupportList.vue 스크립트 setup 바깥쪽에 상수 정의
const categoryTitles = {
  NOTICE: '공지사항',
  FAQ: '자주 묻는 질문',
  INQUIRY: '1:1 문의'
} as const;

// Support 타입 정의 - 백엔드 응답 구조에 맞게 조정
interface Support {
  id: number;
  title: string;
  content: string;
  author: {
    id?: number; // id 속성 추가 (null 또는 undefined일 수 있음)
    username: string;
    nickname?: string;
  } | null;
  createdAt: string;
  views: number;
  likes: number;
  displayNumber?: number;
  category?: string;
}

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const supports = ref<Support[] | null>(null);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const category = ref((route.query.category as string) || 'NOTICE');
const errorMessage = ref('');
const currentPage = ref(1);
const pageSize = 10;

// 카테고리 제목 표시
const categoryTitle = computed(() => {
  return categoryTitles[category.value as keyof typeof categoryTitles] || '공지사항';
});

watch(() => route.query.category, (newCategory) => {
  category.value = newCategory as string || 'NOTICE';
  currentPage.value = 1;
  console.log('watch: route.query.category 변경 감지 - newCategory:', newCategory, 'category.value:', category.value);
  fetchPosts();
});

// 고객센터 게시글 목록 불러오기
const fetchPosts = async () => {
  loading.value = true;
  errorMessage.value = '';
  supports.value = null;
  try {
    console.log('fetchPosts: category.value:', category.value);

    const response = await axios.get('/supports', {
      params: {
        category: category.value,
        page: currentPage.value,
        limit: pageSize,
        search: searchQuery.value,
      },
    });
    console.log('fetchSupports: API 요청 params:', response.config.params);
    console.log('fetchSupports: API 응답 데이터:', response.data);
    console.log('fetchSupports: 전체 API 응답 객체:', response);
    if (response.status === 200) {
      supports.value = response.data.data.items;
      totalPages.value = response.data.data.totalPages;
    } else {
      errorMessage.value = `게시글 목록을 불러올 수 없습니다. 상태 코드: ${response.status}`;
      supports.value = null;
    }
  } catch (error: any) {
    console.error('게시글 목록 불러오기 오류', error);
    errorMessage.value = '게시글 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    supports.value = null;
  } finally {
    loading.value = false;
  }
};

// 날짜 형식 변환 (유틸 함수로 분리 가능)
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// 검색
const search = () => {
  currentPage.value = 1;
  fetchPosts();
};

// 페이지 변경
const changePage = (newPage: number) => {
  currentPage.value = newPage;
  fetchPosts();
};

// 고객센터 게시글 작성 페이지로 이동
const createSupport = () => {
  router.push({
    path: '/supports/create',
    query: { category: route.query.category }
  });
};

// 고객센터 게시글 상세 페이지로 이동
const viewSupport = (id: number) => router.push(`/supports/${id}`);

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.post-list table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.post-list th,
.post-list td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd; /* border 색상 변경 */
}

.post-list th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.post-list td.title {
  text-align: left;
  cursor: pointer;
}

.post-list tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ccc; /* border 색상 변경 */
  border-radius: 4px;
  width: 300px;
}

.search-button,
.write-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button {
  background-color: #6c757d;
  color: white;
}

.write-button {
  background-color: #4A90E2;
  color: white;
}

.search-button:hover {
  background-color: #5a6268;
}

.write-button:hover {
  background-color: #357ABD;
}

/* 페이지네이션과 글쓰기 버튼 컨테이너 */
.bottom-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  position: relative;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0 auto;
}

.pagination span {
  padding: 0 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc; /* border 색상 변경 */
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.write-button {
  position: absolute;
  right: 0;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-posts {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-size: 0.95rem;
}

/* 카테고리 탭 스타일 추가 */
.category-tabs {
  display: flex;
  margin-top: 1rem;
  gap: 0.5rem;
}

.category-tab {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc; /* border 색상 변경 */
  background: #f8f9fa;
  cursor: pointer;
  border-radius: 4px;
}

.category-tab.active {
  background: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.category-tab:hover {
  background: #e9ecef;
}

.category-tab.active:hover {
  background: #357ABD;
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #e74c3c;
  text-align: center;
}

@media (max-width: 768px) {
  .bottom-actions {
    flex-direction: column;
    gap: 1rem;
    position: static;
  }

  .pagination {
    width: 100%;
    justify-content: center;
    margin: 0;
  }

  .write-button {
    width: 100%;
    position: static;
    margin-top: 1rem;
  }
}
</style>
<style>
.support-list-page .content-card {background-color: #f8f8f8;} /* content-card 배경색 변경 */
.support-list-page .page-header { background: #e0e0e0; } /* page-header 배경색 변경 */
</style>
