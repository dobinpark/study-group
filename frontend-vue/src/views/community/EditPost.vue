<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>게시글 수정</h1>
        </header>

        <main class="page-content">
          <form @submit.prevent="handleSubmit" class="post-form">
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" v-model="title" placeholder="제목을 입력하세요" 
                     :class="{ 'error': errors.title }">
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
              <button type="submit" class="btn btn-primary">수정</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '@/store';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const title = ref('');
const content = ref('');
const errors = ref({
  title: '',
  content: ''
});

// 게시글 데이터 가져오기
const fetchPost = async () => {
  try {
    const response = await axios.get(`/posts/${route.params.id}`);
    title.value = response.data.title;
    content.value = response.data.content;

    if (response.data.category && !route.query.category) {
      await router.replace({
        path: route.path,
        query: {category: response.data.category}
      });
    }
  } catch (error: any) {
    // 세션 기반 인증에서는 401 또는 403 에러가 인증 실패를 의미할 수 있습니다.
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login'); // 로그인 페이지로 리다이렉트
    } else {
      console.error('게시글 조회 실패:', error);
      await router.push({
        path: '/post-list',
        query: {category: route.query.category}
      });
    }
  }
};

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

// 게시글 수정 제출
const submitEdit = async () => {
  if (!validateForm()) return;

  try {
    await axios.put(`/edit-post/${route.params.id}`, {
      title: title.value.trim(),
      content: content.value.trim()
    });

    await router.push({
  path: `/post-detail/${route.params.id}`,
      query: { category: route.query.category }
    });
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      alert(error.response?.data?.message || '게시글 수정에 실패했습니다.');
    }
  }
};

// 뒤로 가기
const goBack = () => {
  // 취소 시에도 카테고리 정보 유지
  router.push({
path: `/post-detail/${route.params.id}`,
    query: { category: route.query.category }
  });
};

// 컴포넌트가 마운트될 때 게시글 데이터 가져오기
onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  fetchPost();
});
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
