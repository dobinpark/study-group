<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>{{ categoryTitle }} 글쓰기</h1>
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
              <button type="submit" class="btn btn-primary">등록</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { SupportCategoryKorean } from '../../types/models';

const route = useRoute();
const router = useRouter();

// 단순한 폼 데이터 관리
const form = reactive({
  title: '',
  content: '',
  category: route.params.category
});

// 카테고리 제목 표시
const categoryTitle = computed(() => {
  const category = route.params.category as keyof typeof SupportCategoryKorean;
  return SupportCategoryKorean[category] || '게시판';
});

// 단순 API 호출
const handleSubmit = async () => {
  try {
    const response = await axios.post('/supports', form);
    if (response.data.success) {
      router.push(`/supports/${response.data.data.id}`);
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '게시글 작성에 실패했습니다');
  }
};

const goBack = () => {
  router.push('/supports');
};
</script>

<style scoped>
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
</style>