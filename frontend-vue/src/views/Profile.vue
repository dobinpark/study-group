<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>프로필</h1>
        </header>
        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="nickname">닉네임</label>
              <input type="text" id="nickname" v-model="form.nickname" required />
            </div>
            <div class="form-group">
              <label for="email">이메일</label>
              <input type="email" id="email" v-model="form.email" required />
            </div>
            <div class="form-group">
              <label for="phoneNumber">전화번호</label>
              <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">수정하기</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();

const form = reactive({
  nickname: '',
  email: '',
  phoneNumber: ''
});

const isAuthenticated = computed(() => authStore.isAuthenticated);
const currentUser = computed(() => userStore.user);

const fetchProfile = async () => {
  try {
    const response = await axios.get('/auth/me');
    if (response.data.success) {
      Object.assign(form, response.data.data);
    }
  } catch (error: any) {
    alert('프로필 정보를 불러올 수 없습니다');
    router.push('/');
  }
};

const handleSubmit = async () => {
  try {
    const response = await axios.put('/users/profile', form);
    if (response.data.success) {
      alert('프로필이 수정되었습니다');
      router.push('/');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '프로필 수정에 실패했습니다');
  }
};

onMounted(() => {
  if (!authStore.sessionChecked) {
    authStore.checkSession();
  }
  
  if (userStore.user) {
    userStore.fetchUserProfile();
  }
});
</script>

<style scoped>
.page-content {
  max-width: 600px;
  margin: 0 auto;
}
</style>
