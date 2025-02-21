<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }}</h1>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            로딩 중...
          </div>
          <div v-else-if="post" class="post-detail">
            <div class="post-header">
              <h2 class="post-title">{{ post.title }}</h2>
              <div class="post-meta">
                <div class="post-info">
                  <span class="author-name">
                    <i class="fas fa-user"></i> {{ post.author?.nickname }}
                  </span>
                  <span class="post-date">
                    <i class="fas fa-clock"></i> {{ formatDate(post.createdAt) }}
                  </span>
                  <span class="post-views">
                    <i class="fas fa-eye"></i> 조회 {{ post.views }}
                  </span>
                  <span class="post-likes">
                    <i class="fas fa-heart"></i> 좋아요 {{ post.likes }}
                  </span>
                </div>
                <div v-if="isAuthor" class="author-actions">
                  <button @click="editPost" class="btn btn-secondary">수정</button>
                  <button @click="deletePost" class="btn btn-danger">삭제</button>
                </div>
              </div>
            </div>

            <div class="post-content">
              {{ post.content }}
            </div>

            <div class="post-actions">
              <button @click="likePost" class="btn btn-primary" :class="{ 'liked': isLiked }">
                <i class="fas" :class="isLiked ? 'fa-heart' : 'fa-heart'"></i>
                좋아요
              </button>
            </div>
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
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';

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
  category: string;
}

const route = useRoute();
const router = useRouter();
const post = ref<Post | null>(null);
const loading = ref(true);
const isLiked = ref(false);
const userStore = useUserStore();

// 카테고리 타입 계산
const postType = computed(() => {
  const category = (route.query.category as string || 'FREE').toUpperCase();

  switch (category) {
    case 'FREE':
      return '자유';
    case 'QUESTION':
      return '질문';
    case 'SUGGESTION':
      return '건의';
    default:
      return '게시글';
  }
});

// 컨텐츠 형식화
const formattedContent = computed(() => {
  return post.value?.content?.replace(/\n/g, '<br>') || '';
});

// 게시글 상세정보 가져오기
const fetchPost = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`/post-detail/${route.params.id}`);
    post.value = response.data;

    if (response.data.category && !route.query.category) {
      await router.replace({
        path: route.path,
        query: { category: response.data.category }
      });
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

// 날짜 형식화
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};

// 목록으로 이동
const goBack = () => {
  router.push({
    path: '/post-list',
    query: { category: route.query.category }
  });
};

// 수정 페이지로 이동
const editPost = () => {
  router.push(`/edit-post/${route.params.id}`);
};

// 게시글 삭제
const deletePost = async () => {
  if (!confirm('정말로 삭제하시겠습니까?')) return;

  try {
    await axios.delete(`/posts/${route.params.id}`);

    window.alert('게시글이 삭제되었습니다.');
    await router.push({
      path: '/post-list',
      query: { category: route.query.category }
    });
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      const errorMessage = error.response?.data?.message || '게시글 삭제에 실패했습니다.';
      window.alert(errorMessage);
    }
  }
};

// 좋아요 처리
const toggleLike = async () => {
  try {
    const response = await axios.post(`/posts/${route.params.id}/toggle-like`);
    isLiked.value = response.data.liked;
    if (post.value) {
      post.value.likes += response.data.liked ? 1 : -1;
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      console.error('좋아요 처리 실패:', error);
    }
  }
};

// 대신 userStore를 사용
const isAuthor = computed(() => {
  return post.value?.author.id === userStore.user?.id;
});

const likePost = async () => {
  try {
    // 세션 기반 인증 확인
    if (!userStore.isLoggedIn) {
      router.push('/login');
      return;
    }
    const response = await axios.post(`/posts/${route.params.id}/toggle-like`);
    isLiked.value = response.data.liked;
    if (post.value) {
      post.value.likes += response.data.liked ? 1 : -1;
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      console.error('좋아요 처리 실패:', error);
    }
  }
};

const categoryTitle = computed(() => {
  // ... 구현
});

onMounted(() => {
  fetchPost();
});
</script>

<style scoped>
/* 페이지별 고유한 스타일만 추가 */
.post-detail {
  background: white;
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

.post-actions {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.liked {
  background: #e53e3e !important;
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
