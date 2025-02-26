<template>
  <div class="login-container">
    <div class="login-content">
      <h1>로그인</h1>
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
          <button type="submit" class="login-button">로그인</button>
          <button type="button" class="signup-button" @click="$router.push('/signup')">
            회원가입
          </button>
        </div>
      </form>
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
.login-container {
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.login-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-button {
  background-color: #4A90E2;
  color: white;
}

.signup-button {
  background-color: #eee;
  color: #333;
}
</style>
