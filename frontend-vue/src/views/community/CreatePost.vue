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
              <input type="text" id="title" v-model="form.title" required />
            </div>

            <div class="form-group">
              <label for="content">내용</label>
              <textarea id="content" v-model="form.content" rows="15" required></textarea>
            </div>

            <div class="button-group">
              <button type="button" @click="goBack" class="btn btn-secondary">취소</button>
              <button type="submit" class="btn btn-primary">생성하기</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { PostCategoryKorean } from '../../types/models';
import { useUserStore } from '../../store/user';
import { useAuthStore } from '../../store/auth';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

// 폼 데이터에 카테고리 자동 설정
const form = reactive({
  title: '',
  content: '',
  category: String(route.query.category || 'FREE')
});

// 카테고리 제목 표시
const categoryTitle = computed(() => {
  const category = route.query.category as keyof typeof PostCategoryKorean;
  return PostCategoryKorean[category] || '게시판';
});

const errorMessage = ref('');

// 게시글 작성
const handleSubmit = async () => {
  errorMessage.value = '';
  if (!form.title.trim() || !form.content.trim()) {
    errorMessage.value = '제목과 내용을 모두 입력해주세요.';
    return;
  }

  try {
    // 로그인 상태 확인
    if (!userStore.isLoggedIn) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    // 세션 확인 추가
    await authStore.checkSession();

    // 다시 로그인 상태 확인
    if (!userStore.isLoggedIn) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/login');
      return;
    }

    // 게시글 작성
    const response = await axios.post('/posts', {
      title: form.title,
      content: form.content,
      category: form.category.toUpperCase()
    });
    if (response.data.success) {
      router.push(`/posts/${response.data.data.id}`);
    }
  } catch (error: any) {
    errorMessage.value = '게시글 작성에 실패했습니다.';
    console.error(error);
  }
};

// 뒤로 가기
const goBack = () => {
  router.push({
    path: '/posts',
    query: { category: form.category }
  });
};
</script>

<style scoped>
@import '../../assets/styles/common.css';

.error-message {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.error {
  border-color: #e53e3e !important;
}

.error:focus {
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
}

textarea {
  resize: vertical;
  min-height: 200px;
}

.form-group textarea {
  min-height: 300px;
}

/* 버튼 그룹 오른쪽 정렬 */
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* 에디터 관련 추가 스타일 (common.css에 없는 경우) */
.editor-container {
  margin-bottom: 20px;
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}
</style>
