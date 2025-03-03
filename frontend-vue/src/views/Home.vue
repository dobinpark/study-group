<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <h1 class="hero-title">함공과 함께라면<br>공부도 즐거움이 됩니다.</h1>
        <p class="hero-subtitle">함께 공부하는 공간, 함공</p>
        <button class="hero-button" @click="goToStudyGroups">
          스터디 그룹 시작하기
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();

// 인증 상태는 authStore에서
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isLoading = computed(() => authStore.isLoading);

// 사용자 정보는 userStore에서
const user = computed(() => userStore.user);

const goToStudyGroups = () => {
  router.push('/study-groups/create');
};

onMounted(async () => {
  // 세션 체크는 authStore 사용
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
});
</script>

<style scoped>
@import '../assets/styles/common.css';

.content-card {
  text-align: center;
  padding: 3rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--text-color);
  line-height: 1.4;
  margin-bottom: var(--spacing-lg);
  animation: fadeInDown 1s ease-out;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xl);
  animation: fadeInUp 1s ease-out;
  animation-delay: 0.3s;
  opacity: 0;
  animation-fill-mode: forwards;
}

.hero-button {
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--white);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color-dark) 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--box-shadow-md);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--box-shadow-lg);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.hero-button:hover .btn-arrow {
  transform: translateX(5px);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-button {
    width: 100%;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
