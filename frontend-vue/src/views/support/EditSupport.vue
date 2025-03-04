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
  import { ref, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import axios from '../../utils/axios';
  
  const router = useRouter();
  const route = useRoute();
  const supportId = ref(route.params.id as string);
  const title = ref('');
  const content = ref('');
  const errorMessage = ref('');
  
  const fetchPost = async () => {
    try {
      const response = await axios.get(`/support/${supportId.value}`);
      if (response.status === 200) {
        title.value = response.data.title;
        content.value = response.data.content;
      } else {
        alert('문의사항을 불러오는데 실패했습니다.');
        router.push('/support/list');
      }
    } catch (error: any) {
      console.error('문의사항 불러오기 오류', error);
      alert('문의사항을 불러오는 중 오류가 발생했습니다.');
      router.push('/support/list');
    }
  };
  
  const handleSubmit = async () => {
    errorMessage.value = '';
    if (!title.value.trim() || !content.value.trim()) {
      errorMessage.value = '제목과 내용을 모두 입력해주세요.';
      return;
    }
  
    try {
      const response = await axios.put(`/support/${supportId.value}`, {
        title: title.value,
        content: content.value,
      });
      if (response.status === 200) {
        alert('문의사항이 성공적으로 수정되었습니다.');
        await router.push(`/support/detail/${supportId.value}`);
      }
    } catch (error: any) {
      errorMessage.value = '문의사항 수정에 실패했습니다.';
      console.error(error);
    }
  };
  
  const goBack = () => {
    router.push('/support/list');
  };
  
  onMounted(fetchPost);
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
  