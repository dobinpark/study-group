<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h2>{{ categoryTitle }}</h2>
        </header>

        <main class="page-content">
          <div v-if="loading">로딩 중...</div>
          <div v-else>
            <table class="post-list">
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
                <tr v-for="post in posts" :key="post.id" @click="viewPost(post.id)">
                  <td>{{ post.id }}</td>
                  <td>{{ post.title }}</td>
                  <td>{{ post.author.nickname }}</td>
                  <td>{{ formatDate(post.createdAt) }}</td>
                  <td>{{ post.views }}</td>
                  <td>{{ post.likes }}</td>
                </tr>
              </tbody>
            </table>

            <div class="action-bar">
              <div class="search-box">
                <input v-model="searchQuery" @keyup.enter="search" placeholder="검색어 입력" />
                <button @click="search">검색</button>
              </div>
              <button @click="createPost">글쓰기</button>
            </div>

            <div class="pagination">
              <button :disabled="page === 1" @click="changePage(page - 1)">이전</button>
              <span>{{ page }} / {{ totalPages }}</span>
              <button :disabled="page === totalPages" @click="changePage(page + 1)">다음</button>
            </div>
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

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    nickname: string;
  };
  createdAt: string;
  views: number;
  likes: number;
}

const route = useRoute();
const router = useRouter();

const posts = ref<Post[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');

const categoryTitle = computed(() => {
  const category = String(route.query.category || 'FREE');
  const titles = {
    FREE: '자유게시판',
    QUESTION: '질문게시판',
    SUGGESTION: '건의게시판'
  } as const;
  
  return titles[category as keyof typeof titles] || '게시판';
});

const fetchPosts = async () => {
  try {
    const response = await axios.get('/posts', {
      params: {
        category: route.query.category,
        page: page.value,
        search: searchQuery.value
      }
    });
    posts.value = response.data.data.items;
    totalPages.value = Math.ceil(response.data.data.total / 10);
  } catch (error) {
    alert('게시글 목록을 불러올 수 없습니다');
  } finally {
    loading.value = false;
  }
};

const formatDate = (date: string) => new Date(date).toLocaleDateString();

const search = () => {
  page.value = 1;
  fetchPosts();
};

const changePage = (newPage: number) => {
  page.value = newPage;
  fetchPosts();
};

const createPost = () => router.push('/posts/create');

const viewPost = (id: number) => router.push(`/posts/${id}`);

onMounted(fetchPosts);
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
