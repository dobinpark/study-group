<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }}</h1>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>로딩 중...</p>
          </div>
          <div v-else-if="post" class="post-detail">
            <div class="post-header">
              <h2 class="post-title">{{ post.title }}</h2>
              <div class="post-meta">
                <div class="post-info">
                  <span>작성자: {{ post.author?.nickname || '알 수 없음' }}</span>
                  <span>작성일: {{ formatDate(post.createdAt) }}</span>
                  <span>조회수: {{ post.views || 0 }}</span>
                </div>
                <div v-if="isAuthor" class="author-actions">
                  <button @click="editPost" class="btn btn-secondary">수정</button>
                  <button @click="deletePost" class="btn btn-danger">삭제</button>
                </div>
              </div>
            </div>

            <div class="post-content">{{ post.content }}</div>
          </div>

          <div v-else class="error-message">
            <p>게시글을 불러올 수 없습니다.</p>
            <button @click="goBack" class="btn btn-secondary">목록으로</button>
          </div>

          <div class="button-group">
            <button @click="goBack" class="btn btn-secondary">목록으로</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import axios from '../../utils/axios';
import { PostCategoryKorean } from '../../types/models';

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
  category: string;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const post = ref<Post | null>(null);
const loading = ref(true);

// 카테고리 제목 계산
const categoryTitle = computed(() => {
  const category = route.params.category as keyof typeof PostCategoryKorean;
  return PostCategoryKorean[category] || '게시판';
});

const isAuthor = computed(() => {
  if (!post.value || !userStore.user) return false;
  return post.value.author.id === userStore.user.id;
});

const fetchPost = async () => {
  try {
    const response = await axios.get(`/posts/${route.params.id}`);
    post.value = response.data.data;
  } catch (error) {
    alert('게시글을 불러올 수 없습니다');
    router.push('/posts');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '날짜 정보 없음';
    }
    return date.toLocaleDateString();
  } catch (e) {
    console.error('날짜 형식 변환 오류:', e);
    return '날짜 정보 없음';
  }
};

const editPost = () => router.push(`/posts/${route.params.id}/edit`);

const deletePost = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`/posts/${route.params.id}`);
    router.push('/posts');
  } catch (error: any) {
    alert(error.response?.data?.message || '게시글 삭제에 실패했습니다');
  }
};

const goBack = () => router.push('/posts');

onMounted(fetchPost);
</script>

<style scoped>
.post-detail {
  border-radius: 8px;
}

.post-header {
  margin-bottom: 2rem;
}

.post-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.post-info {
  display: flex;
  gap: 1.5rem;
  color: #718096;
  font-size: 0.875rem;
}

.post-info i {
  margin-right: 0.5rem;
  color: #4a90e2;
}

.post-content {
  min-height: 200px;
  line-height: 1.7;
  color: #2d3748;
  margin: 2rem 0;
  white-space: pre-wrap;
}

.author-actions {
  display: flex;
  gap: 1rem;
}

@media (max-width: 768px) {
  .post-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .post-info {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
