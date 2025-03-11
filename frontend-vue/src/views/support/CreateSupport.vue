<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }} 게시글 작성</h1>
        </header>

        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" v-model="form.title" required class="form-control" />
            </div>
            <div class="form-group">
              <label for="content">내용</label>
              <textarea id="content" v-model="form.content" rows="15" required class="form-control"></textarea>
            </div>
            <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="!isSubmitting">작성 완료</span>
                <span v-else>작성 중...</span>
              </button>
              <button type="button" @click="goBack" class="btn btn-secondary">취소</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../../utils/axios';
import { SupportCategoryKorean } from '../../types/models';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const form = ref({
  category: route.query.category || 'NOTICE',
  title: '',
  content: '',
});
const isSubmitting = ref(false);

// 카테고리 제목 표시
const categoryTitle = computed(() => {
  const category = route.query.category as keyof typeof SupportCategoryKorean;
  return SupportCategoryKorean[category] || '고객센터';
});

const errorMessage = ref('');
const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  if (isSubmitting.value) {
    return;
  }
  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    if (!form.value.category) {
      errorMessage.value = '카테고리를 선택해주세요.';
      return;
    }
    if (!form.value.title) {
      errorMessage.value = '제목을 입력해주세요.';
      return;
    }
    if (!form.value.content) {
      errorMessage.value = '내용을 입력해주세요.';
      return;
    }

    // 게시글 작성
    const response = await axios.post('/supports', { // API 엔드포인트 수정: /supports
      title: form.value.title,
      content: form.value.content,
      category: String(form.value.category).toUpperCase()
    });
    if (response.data.success) {
      router.push(`/supports/${response.data.data.id}`); // 경로 수정: /supports/:id
    }
  } catch (error: any) {
    errorMessage.value = '게시글 작성에 실패했습니다.';
    console.error('Error creating post:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// 뒤로 가기
const goBack = () => {
  router.push({ // 목록 페이지로 돌아갈 때 카테고리 쿼리 파라미터 유지
    path: '/supports',
    query: { category: form.value.category } // 쿼리 파라미터 유지
  });
};
</script>

<style scoped>
@import '../../assets/styles/common.css';

.page-container {
  min-height: calc(100vh - 200px); /* 다른 페이지와 통일된 min-height 값 적용 */
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
}

.form-control:focus {
  border-color: #4A90E2;
  box-shadow: 0 0 0 0.15rem rgba(74, 144, 226, 0.25);
  outline: 0;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
}

.button-group {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

textarea.form-control {
  min-height: 300px;
}
</style>
<style>
.support-header h1 {
  color: #333;
}

/* header 폰트 색상 변경 */
.content-card {
  background-color: #f8f8f8;
}

/* content-card 배경색 변경 */
</style>
