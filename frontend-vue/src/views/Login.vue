<template>
  <div class="page-container login-page">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>로그인</h1>
        </header>
        <main class="page-content">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="username">아이디</label>
              <input type="text" id="username" v-model="form.username" required />
            </div>
            <div class="form-group">
              <label for="password">비밀번호</label>
              <input type="password" id="password" v-model="form.password" required />
            </div>
            <div class="button-group">
              <button type="submit" class="btn btn-primary">로그인</button>
              <button type="button" class="btn btn-secondary" @click="$router.push('/signup')">
                회원가입
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: '',
  password: ''
});

const handleSubmit = async () => {
  try {
    if (await userStore.login(form)) {
      router.push('/');
    } else {
      alert('로그인에 실패했습니다');
    }
  } catch (error) {
    alert('로그인 중 오류가 발생했습니다');
  }
};
</script>

<style scoped>
.page-content {
  max-width: 500px !important;
  margin: 0 auto;
}

.form-group {
  margin-bottom: var(--spacing-md) !important;
}

.form-group input {
  padding: 0.75rem var(--spacing-md) !important;
  font-size: 1rem !important;
}

.button-group {
  display: flex !important;
  gap: var(--spacing-md) !important;
  margin-top: var(--spacing-lg) !important;
}

.btn {
  flex: 1 !important;
  padding: 0.75rem 0 !important;
}
</style>
