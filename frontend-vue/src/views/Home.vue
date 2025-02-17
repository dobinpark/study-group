<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home-container">
    <div class="home">
      <h1 class="main-title">함공과 함께라면<br>공부도 즐거움이 됩니다.</h1>
      <h2 class="sub-title">함께 공부하는 공간, 함공</h2>
      <button class="create-study-btn" @click="handleCreateStudy">
        스터디 그룹 생성
        <span class="btn-arrow">→</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 스터디 그룹 생성 버튼 클릭 시 처리
const handleCreateStudy = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  if (!isAuthenticated) {
    alert('로그인이 필요한 서비스입니다.');
    router.push('/login');
    return;
  }
  router.push('/study-group-create');
};
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 200px);
}

.home {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  border-radius: 8px;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #2d3748;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  animation: fadeInDown 1s ease-out;
  font-family: 'Pretendard', 'Arial', sans-serif;
}

.sub-title {
  font-size: 2rem;
  color: #4A90E2;
  text-align: center;
  margin-top: 1rem;
  font-weight: 600;
  opacity: 0;
  animation: fadeInUp 1s ease-out forwards;
  animation-delay: 0.5s;
  font-family: 'Pretendard', 'Arial', sans-serif;
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

.create-study-btn {
  margin-top: 3rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
  position: relative;
  overflow: hidden;
  font-family: 'Pretendard', 'Arial', sans-serif;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.create-study-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
  background: linear-gradient(135deg, #357ABD 0%, #2868A6 100%);
}

.create-study-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(74, 144, 226, 0.3);
}

.btn-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.create-study-btn:hover .btn-arrow {
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .home {
    width: 90%;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .sub-title {
    font-size: 1.5rem;
  }

  .create-study-btn {
    font-size: 1rem;
    padding: 0.8rem 2rem;
  }
}
</style>
