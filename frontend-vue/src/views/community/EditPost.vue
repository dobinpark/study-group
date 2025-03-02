<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>게시글 수정</h1>
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
              <button type="submit" class="btn btn-primary">수정</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import { useUserStore } from '../../store/user';
import axios from '../../utils/axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  title: '',
  content: '',
  category: ''
});

const fetchPost = async () => {
  try {
    const response = await axios.get(`/posts/${route.params.id}`);
    if (response.data.success) {
      form.title = response.data.data.title;
      form.content = response.data.data.content;
      form.category = response.data.data.category;
    }
  } catch (error: any) {
    alert('게시글을 불러올 수 없습니다');
    router.push('/posts');
  }
};

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }
  
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
  
  try {
    const response = await axios.put(`/posts/${route.params.id}`, form);
    if (response.data.success) {
      router.push(`/posts/${route.params.id}`);
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '게시글 수정에 실패했습니다');
  }
};

const goBack = () => {
  router.push(`/posts/${route.params.id}`);
};

onMounted(async () => {
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
  
  await fetchPost();
});
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
