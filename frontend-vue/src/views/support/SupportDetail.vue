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
                    <span>작성자: {{ post.author?.nickname }}</span>
                    <span>작성일: {{ formatDate(post.createdAt) }}</span>
                    <span>조회수: {{ post.views }}</span>
                    <span>좋아요: {{ post.likes }}</span>
                  </div>
                  <div v-if="isAuthor" class="author-actions">
                    <button @click="editPost" class="btn btn-secondary">수정</button>
                    <button @click="deletePost" class="btn btn-danger">삭제</button>
                  </div>
                </div>
              </div>
  
              <div class="post-content">{{ post.content }}</div>
  
              <div class="post-actions">
                <button @click="handleLike" class="btn btn-primary">좋아요</button>
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
  import { useUserStore } from '../../store/user';
  import axios from '../../utils/axios';
  import { SupportCategoryKorean } from '../../types/models';
  import dayjs from 'dayjs';
  import 'dayjs/locale/ko';
  dayjs.locale('ko');
  
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
    category: string;
  }
  
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  
  const post = ref<Post | null>(null);
  const loading = ref(true);
  const supportId = ref(route.params.id as string);
  const support = ref(null);
  const isLoading = ref(true);
  const errorMessage = ref('');
  
  // 카테고리 제목 계산
  const categoryTitle = computed(() => {
    const category = route.params.category as keyof typeof SupportCategoryKorean;
    return SupportCategoryKorean[category] || '게시판';
  });
  
  const isAuthor = computed(() => {
    if (!post.value || !userStore.user) return false;
    return post.value.author.id === userStore.user.id;
  });
  
  const fetchPost = async () => {
    try {
      const response = await axios.get(`/supports/${route.params.id}`);
      post.value = response.data.data;
    } catch (error) {
      alert('게시글을 불러올 수 없습니다');
      router.push('/supports');
    } finally {
      loading.value = false;
    }
  };
  
  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  
  const handleLike = async () => {
    if (!userStore.isLoggedIn) {
      alert('로그인이 필요합니다');
      router.push('/login');
      return;
    }
  
    try {
      const response = await axios.post(`/supports/${route.params.id}/like`);
      if (response.data.success && post.value) {
        post.value.likes = response.data.data.likes;
      }
    } catch (error: any) {
      alert(error.response?.data?.message || '좋아요 처리에 실패했습니다');
    }
  };
  
  const editPost = () => router.push(`/supports/${route.params.id}/edit`);
  
  const deletePost = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
      await axios.delete(`/supports/${route.params.id}`);
      router.push('/supports');
    } catch (error: any) {
      alert(error.response?.data?.message || '게시글 삭제에 실패했습니다');
    }
  };
  
  const goBack = () => router.push('/supports');
  
  const fetchSupport = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.get(`/support/${supportId.value}`); // 백엔드 API 엔드포인트 (frontend-vue proxy 설정 확인 필요)
      if (response.status === 200) {
        support.value = response.data;
      } else {
        errorMessage.value = '문의사항 정보를 불러올 수 없습니다.';
      }
    } catch (error: any) {
      console.error('문의사항 정보 불러오기 오류', error);
      errorMessage.value = '문의사항 정보를 불러오는 중 오류가 발생했습니다.';
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(async () => {
    await fetchPost();
    await fetchSupport();
  });
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
  
  .post-actions {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  
  .btn-primary.liked {
    background: var(--danger-color) !important;
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
  