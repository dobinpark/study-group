<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>고객센터 게시글 수정</h1>
        </header>

        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="title">제목</label>
              <input type="text" id="title" v-model="form.title" required class="form-control" />
            </div>
            <div class="form-group">
              <label for="content">내용</label>
              <textarea id="content" v-model="form.content" rows="10" required class="form-control"></textarea>
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                <span v-if="!isSubmitting">수정</span>
                <span v-else>수정 중...</span>
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../store/auth';
import axios from '../../utils/axios';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  title: '',
  content: '',
 });
const isSubmitting = ref(false);
const loading = ref(true);

// 게시글 불러오기
const fetchSupport = async () => {
  try {
    const response = await axios.get(`/supports/${route.params.id}`);
    if (response.data.success) {
      form.value = {
        title: response.data.data.title,
        content: response.data.data.content,
      };
    } else {
      alert('게시글을 불러올 수 없습니다');
      router.push('/supports'); // 경로 수정: /supports
    }
  } catch (error: any) {
    alert('게시글을 불러올 수 없습니다');
    router.push('/supports'); // 경로 수정: /supports
  } finally {
    loading.value = false;
  }
};

// 게시글 수정
const handleSubmit = async () => { // 함수 이름 유지 (handleSubmit)
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.');
    router.push('/login');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const response = await axios.put(`/supports/${route.params.id}`, form.value);
    if (response.data.success) {
      router.push(`/supports/${route.params.id}`);
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '게시글 수정에 실패했습니다');
  } finally {
    isSubmitting.value = false;
  }
};

// 뒤로 가기
const goBack = () => {
  router.push(`/supports/${route.params.id}`); // 경로 수정: /supports/:id
};

// 마운트 시 게시글 불러오기
onMounted(async () => {
  if (!authStore.sessionChecked) { // 세션 체크 유지
    await authStore.checkSession();
  }

  await fetchSupport();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
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

.button-group {
  margin-top: 2rem;
  text-align: center;
  justify-content: center;
}

.submit-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.submit-button {
  background-color: #4A90E2;
  color: white;
}

.cancel-button {
  background-color: #ddd;
  color: #333;
  margin-left: 0.5rem;
}

.submit-button:hover {
  background-color: #357ABD;
}

.cancel-button:hover {
  background-color: #ccc;
}

textarea.form-control {
  min-height: 300px;
}
</style>
<style>
.support-header h1 {color: #333;} /* header 폰트 색상 변경 */
.content-card {background-color: #f8f8f8;} /* content-card 배경색 변경 */
</style>
