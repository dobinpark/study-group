<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header support-header">
          <h1>{{ getCategoryTitle(support?.category) }}</h1>
        </header>

        <main class="page-content">
          <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            <p>로딩 중...</p>
          </div>
          <div v-else-if="support" class="support-detail">
            <div class="support-header">
              <h2 class="support-title">{{ support.title }}</h2>
              <div class="support-meta">
                <div class="support-info">
                  <span>작성자: {{ support.author?.nickname || '알 수 없음' }}</span>
                  <span>작성일: {{ formatDate(support.createdAt) }}</span>
                  <span>조회수: {{ support.views || 0 }}</span>
                </div>
                <div v-if="isAuthor" class="author-actions">
                  <button @click="editSupport" class="btn btn-secondary">수정</button>
                  <button @click="deleteSupport" class="btn btn-danger">삭제</button>
                </div>
              </div>
            </div>
            <div class="support-content" v-html="support.content">
            </div>
          </div>

          <div v-else class="error-message">
            <p>게시글을 불러올 수 없습니다.</p>
            <button @click="goBack" class="btn btn-secondary">목록으로</button>
          </div>

          <div class="button-group">
            <button @click="goBack" class="list-button">목록</button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
import axios from '../../utils/axios';
import { PostCategoryKorean } from '../../types/models';
import { SupportCategoryKorean } from '../../types/models';

// Support 타입 정의
interface Support {
  title: string;
  content: string;
  author: {
    id?: number;
    username: string;
    nickname?: string;
  } | null;
  createdAt: string;
  views: number;
  likes: number;
  category?: string;
}

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const support = ref<Support | null>(null);
const loading = ref(true);

// 카테고리 제목 가져오기
const getCategoryTitle = (category?: string) => {
  if (!category) return '게시판';
  return SupportCategoryKorean[category as keyof typeof SupportCategoryKorean] || '고객센터';
};

const isAuthor = computed(() => {
  if (!support.value || !userStore.user) return false;
  return support.value.author?.id === userStore.user.id;
});

const fetchSupport = async () => {
  try {
    const response = await axios.get(`/supports/${route.params.id}`);
    support.value = response.data.data;
  } catch (error) {
    alert('게시글을 불러올 수 없습니다');
    router.push('/supports');
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '날짜 정보 없음';
    }
    return date.toLocaleDateString();
  } catch (e) {
    console.error('날짜 형식 변환 오류', e);
    return '날짜 정보 없음';
  }
};

const editSupport = () => router.push(`/supports/${route.params.id}/edit`);

const deleteSupport = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await axios.delete(`/supports/${route.params.id}`);
    router.push('/supports');
  } catch (error: any) {
    alert(error.response?.data?.message || '게시글 삭제에 실패했습니다');
  }
};

const goBack = () => {
  router.push({
    path: '/supports',
    query: { category: support.value?.category }
  });
};

onMounted(() => {
  fetchSupport();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.support-detail {
  border-radius: 8px;
}

.support-header {
  margin-bottom: 2rem;
}

.support-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1rem;
}

.support-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #ddd;
}

.support-info {
  display: flex;
  gap: 1.5rem;
  color: #555;
  font-size: 0.875rem;
}

.author-actions button {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #4a90e2;
}

.support-content {
  min-height: 200px;
  line-height: 1.7;
  color: #2d3748;
  white-space: pre-line;
}

.button-group {
  margin-top: 2rem;
  text-align: center;
}

.list-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #4a90e2;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-button:hover {
  background-color: #f8f9fa;
}

@media (max-width: 768px) {
  .support-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .support-info {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .author-actions {
    justify-content: space-between;
  }
}
</style>
<style>
.support-header h1 {color: #333;}
</style>

