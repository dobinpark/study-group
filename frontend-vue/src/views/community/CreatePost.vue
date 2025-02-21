<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }} 글쓰기</h1>
        </header>

        <main class="page-content">
          <form @submit.prevent="handleSubmit" class="post-form">
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" v-model="title" placeholder="제목을 입력하세요" :class="{ 'error': errors.title }">
              <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
            </div>

            <div class="form-group">
              <label for="content">내용</label>
              <textarea id="content" v-model="content" rows="15" placeholder="내용을 입력하세요"
                :class="{ 'error': errors.content }"></textarea>
              <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
            </div>

            <div class="button-group">
              <button type="button" @click="goBack" class="btn btn-secondary">취소</button>
              <button type="submit" class="btn btn-primary">등록</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { PostCategoryKorean } from '../../types/post';
import { useUserStore } from '../../store/user';

const route = useRoute();
const router = useRouter();

const userStore = useUserStore();

const title = ref('');
const content = ref('');
const errors = ref({
  title: '',
  content: ''
});

// 카테고리 제목 계산
const categoryTitle = computed(() => {
  const category = route.params.category as keyof typeof PostCategoryKorean;
  return PostCategoryKorean[category] || '게시판';
});

// 폼 유효성 검사
const validateForm = () => {
  let isValid = true;
  errors.value = {
    title: '',
    content: ''
  };

  if (!title.value.trim()) {
    errors.value.title = '제목을 입력해주세요.';
    isValid = false;
  }

  if (!content.value.trim()) {
    errors.value.content = '내용을 입력해주세요.';
    isValid = false;
  }

  return isValid;
};

// 게시글 제출
const createPost = async () => {
  try {
    if (!userStore.isLoggedIn) {
      router.push('/login');
      return;
    }

    const response = await axios.post('/posts', {
      title: title.value,
      content: content.value,
      category: getCategory(String(route.params.category))
    });

    window.alert('게시글이 성공적으로 작성되었습니다.');
    await router.push({
      path: `/post-detail/${response.data.id}`,
      query: { category: response.data.category }
    });
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      window.alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      window.alert(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
  }
};

// 취소 버튼 클릭 시
const cancel = () => {
  router.push({
    path: '/post-list',
    query: { category: getCategory(String(route.params.category)) }
  });
};

// 카테고리 매핑
const getCategory = (category: string): string => {
  console.log('Incoming category parameter:', category);
  const categoryMap: { [key: string]: string } = {
    'free': 'FREE',
    'question': 'QUESTION',
    'suggestion': 'SUGGESTION'
  };
  const mappedCategory = categoryMap[category.toLowerCase()];
  console.log('Category mapping:', { original: category, mapped: mappedCategory });
  return mappedCategory || 'FREE';
};

const handleSubmit = () => {
  // 폼 유효성 검사 및 게시글 제출 로직
  createPost();
};

const goBack = () => {
  cancel();
};
</script>

<style scoped>
/* 페이지별 고유한 스타일만 추가 */
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
</style>
