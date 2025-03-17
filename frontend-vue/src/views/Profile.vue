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
              <button type="button" class="btn btn-danger" @click="handleWithdraw">회원 삭제</button>
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


// 프로필 정보 불러오기
const fetchProfile = async () => {
  try {
    const response = await axios.get(`/users/profile`);
    if (response.data.success) {
      Object.assign(form, response.data.data);
    }
  } catch (error: any) {
    alert('프로필 정보를 불러올 수 없습니다');
    router.push('/');
  }
};


// 프로필 수정
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


// 회원 삭제
const handleWithdraw = async () => {
  if (!confirm('정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
    return;
  }

  try {
    const response = await axios.delete('/auth/withdraw');
    if (response.data.success) {
      alert('회원 탈퇴가 완료되었습니다.');
      authStore.logout();
      router.push('/');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다');
  }
};

onMounted(() => {
  if (!authStore.sessionChecked) {
    authStore.checkSession();
  }

  if (userStore.user) {
    userStore.fetchUserProfile();
    fetchProfile();
  }
});
</script>

<style scoped>
@import '../assets/styles/common.css';

.profile-container {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-content {
  max-width: 600px;
  margin: 0 auto;
}

.button-group {
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #c82333;
}
</style>
