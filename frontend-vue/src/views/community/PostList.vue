<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h2 class="board-title">{{ categoryTitle }}</h2>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            로딩 중...
          </div>
          <div v-else>
            <div class="post-list">
              <table>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(post, index) in posts" :key="post.id" @click="viewPost(post.id)">
                    <td>{{ totalPosts - ((currentPage - 1) * itemsPerPage + index) }}</td>
                    <td class="title">{{ post.title }}</td>
                    <td>{{ post.author.nickname }}</td>
                    <td>{{ formatDate(post.createdAt) }}</td>
                    <td>{{ post.views }}</td>
                    <td>{{ post.likes }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="action-bar">
              <div class="search-box">
                <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" @keyup.enter="search">
                <button @click="search" class="search-button">검색</button>
              </div>
              <button @click="createPost" class="write-button">글쓰기</button>
            </div>

            <div class="pagination">
              <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">&lt;</button>
              <span v-for="page in totalPages" :key="page">
                <button :class="{ active: page === currentPage }" @click="changePage(page)">{{ page }}</button>
              </span>
              <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">&gt;</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { PostCategory } from '../../types/post';
import { useStore } from 'vuex';

interface Author {
  id: number;
  nickname: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author: Author;
  views: number;
  likes: number;
  createdAt: string;
  category: PostCategory;
  displayId: number;
}

interface Props {
  category?: string;
}

const props = defineProps<Props>();
const route = useRoute();
const router = useRouter();
const posts = ref<Post[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const itemsPerPage = 10;
const totalPosts = ref(0);
const loading = ref(true);
const store = useStore();
const isAuthenticated = computed(() => store.state.isLoggedIn);

// 카테고리 제목 계산
const categoryTitle = computed(() => {
  const category = (route.query.category as string || props.category || 'FREE').toUpperCase();

  switch (category) {
    case 'FREE':
      return '자유게시판';
    case 'QUESTION':
      return '질문게시판';
    case 'SUGGESTION':
      return '건의게시판';
    default:
      return '게시판';
  }
});

// 게시글 목록 가져오기
const fetchPosts = async () => {
  try {
    const category = (route.query.category as string || props.category || 'FREE').toUpperCase();
    console.log('Fetching posts for category:', category);

    const response = await axios.get('/post-list', {
      params: {
        category: category,
        page: currentPage.value,
        limit: itemsPerPage,
        search: searchQuery.value
      }
    });

    if (response.data) {
      posts.value = response.data.items;
      totalPosts.value = response.data.total;
      totalPages.value = Math.ceil(response.data.total / itemsPerPage);
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      console.error('게시글 조회 실패:', error);
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

// 검색 기능
const search = () => {
  currentPage.value = 1;
  fetchPosts();
};

// 글쓰기 페이지로 이동
const createPost = () => {
  if (!store.state.isLoggedIn) {
    router.push('/login');
    return;
  }
  router.push('/create-post');
};

// 게시글 상세 페이지로 이동
const viewPost = (id: number) => {
  router.push(`/post-detail/${id}`);
};

// 페이지 변경
const changePage = (page: number) => {
  currentPage.value = page;
  fetchPosts();
};

// 컴포넌트가 마운트될 때 게시글 목록 가져오기
onMounted(() => {
  fetchPosts();
});

// route.query.category가 변경될 때마다 게시글 다시 가져오기
watch(() => route.query.category, () => {
  currentPage.value = 1;
  searchQuery.value = '';
  fetchPosts();
});
</script>

<style scoped>
/* 페이지별 고유한 스타일만 추가 */
.category-path {
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

/* 테이블 스타일 등 페이지별 특수한 스타일 */
.post-list-container {
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

.board-title {
  font-size: 2rem;
  color: white;
  margin-bottom: 2rem;
  text-align: center;
}

.post-list table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.post-list th,
.post-list td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eee;
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
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ddd;
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

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button.active {
  background-color: #4A90E2;
  color: white;
  border-color: #4A90E2;
}

.pagination button:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}
</style>
