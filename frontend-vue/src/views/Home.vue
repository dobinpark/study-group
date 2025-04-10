<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card hero-section">
        <h1 class="hero-title">함공과 함께라면<br>공부도 즐거움이 됩니다.</h1>
        <p class="hero-subtitle">함께 공부하는 공간, 함공</p>
        <button class="hero-button" @click="goToStudyGroups">
          스터디 그룹 시작하기
          <span class="btn-arrow">→</span>
        </button>
      </div>

      <div class="board-section">
        <div class="board-column notice-board">
          <h2 class="board-title">공지사항</h2>
          <ul class="board-list">
            <li v-for="post in noticePosts" :key="post.id" class="board-item">
              <router-link :to="`/supports/${post.id}`" class="board-link">
                <span class="item-title">{{ post.title }}</span>
              </router-link>
            </li>
            <li v-if="noticePosts.length === 0 && !isPostsLoading" class="board-item empty-item">
              공지사항이 없습니다.
            </li>
            <li v-if="isPostsLoading" class="board-item empty-item">
              공지사항 로딩 중...
            </li>
          </ul>
          <button class="board-more-button" @click="goToNoticeBoard">
            더보기
          </button>
        </div>

        <div class="board-column free-board">
          <h2 class="board-title">자유게시판</h2>
          <ul class="board-list">
            <li v-for="post in freePosts" :key="post.id" class="board-item">
              <router-link :to="`/posts/${post.id}`" class="board-link">
                <span class="item-title">{{ post.title }}</span>
              </router-link>
            </li>
            <li v-if="freePosts.length === 0 && !isPostsLoading" class="board-item empty-item">
              게시글이 없습니다.
            </li>
            <li v-if="isPostsLoading" class="board-item empty-item">
              자유게시판 로딩 중...
            </li>
          </ul>
          <button class="board-more-button" @click="goToFreeBoard">
            더보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';

const router = useRouter();

const authStore = useAuthStore();
const userStore = useUserStore();

// 인증 상태는 authStore에서
const isAuthenticated = computed(() => authStore.isAuthenticated);
const isLoading = computed(() => authStore.isLoading);

// 사용자 정보는 userStore에서
const user = computed(() => userStore.user);

// 게시글 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  createdAt: string;
}

// 게시판 게시글 데이터 (타입 명시)
const noticePosts = ref<Post[]>([]);
const freePosts = ref<Post[]>([]);

// 게시글 로딩 상태 추가
const isPostsLoading = ref<boolean>(false);

const goToStudyGroups = () => {
  router.push('/study-groups/create');
};

// 공지사항 게시판 더보기 버튼 클릭 핸들러
const goToNoticeBoard = () => {
  router.push({ path: '/supports', query: { category: 'NOTICE' } });
};

// 자유게시판 더보기 버튼 클릭 핸들러
const goToFreeBoard = () => {
  router.push({ path: '/posts', query: { category: 'FREE' } });
};

// 공지사항 게시글 목록 가져오기 - 오류 처리 강화
const fetchNoticePosts = async () => {
  console.log('fetchNoticePosts 시작');
  isPostsLoading.value = true; // 로딩 시작
  
  try {
    const response = await axios.get('/supports', {
      params: { category: 'NOTICE', page: 1, size: 5 },
      // 401 오류가 발생해도 정상 처리로 간주 (메인 페이지는 비로그인도 허용)
      validateStatus: (status) => (status >= 200 && status < 300) || status === 401
    });
    
    console.log('공지사항 API 응답:', response);
    if (response.status === 200) {
      noticePosts.value = response.data.data.items;
      console.log('공지사항 게시글 데이터:', noticePosts.value);
    } else if (response.status === 401) {
      console.log('공지사항 API 401 응답 (인증 필요) - 메인 페이지 표시는 계속');
      // 인증 오류지만 메인 페이지이므로 빈 배열로 처리
      noticePosts.value = [];
    }
  } catch (error: any) {
    console.error('공지사항 게시글을 불러오는데 실패했습니다.', error);
    noticePosts.value = []; // 오류 시 빈 배열로 설정하여 UI 표시 문제 없도록
  } finally {
    isPostsLoading.value = false; // 로딩 종료 (성공/실패 모두)
    console.log('fetchNoticePosts 종료');
  }
};

// 자유게시판 게시글 목록 가져오기 - 오류 처리 강화
const fetchFreePosts = async () => {
  console.log('fetchFreePosts 시작');
  isPostsLoading.value = true; // 로딩 시작
  
  try {
    const response = await axios.get('/posts', {
      params: { category: 'FREE', page: 1, size: 5 },
      // 401 오류가 발생해도 정상 처리로 간주 (메인 페이지는 비로그인도 허용)
      validateStatus: (status) => (status >= 200 && status < 300) || status === 401
    });
    
    console.log('자유게시판 API 응답:', response);
    if (response.status === 200) {
      freePosts.value = response.data.data.items;
      console.log('자유게시판 게시글 데이터:', freePosts.value);
    } else if (response.status === 401) {
      console.log('자유게시판 API 401 응답 (인증 필요) - 메인 페이지 표시는 계속');
      // 인증 오류지만 메인 페이지이므로 빈 배열로 처리
      freePosts.value = [];
    }
  } catch (error: any) {
    console.error('자유게시판 게시글을 불러오는데 실패했습니다.', error);
    freePosts.value = []; // 오류 시 빈 배열로 설정하여 UI 표시 문제 없도록
  } finally {
    isPostsLoading.value = false; // 로딩 종료 (성공/실패 모두)
    console.log('fetchFreePosts 종료');
  }
};

onMounted(async () => {
  console.log('Home.vue onMounted 시작');
  console.log('isAuthenticated.value:', isAuthenticated.value); // 현재 인증 상태 로그
  
  try {
    // 세션 체크를 시도하되, 실패해도 페이지 로딩을 계속
    if (!authStore.sessionChecked) {
      try {
        await authStore.checkSession();
        console.log('Home.vue: 세션 체크 성공');
      } catch (sessionError) {
        console.log('Home.vue: 세션 체크 실패 (무시됨, 메인 페이지는 계속 표시)');
        // 세션 체크 실패해도 게시글 목록은 가져옴
      }
    }
    
    // 게시글 목록 가져오기 (세션 성공/실패 여부와 무관하게 실행)
    await Promise.allSettled([
      fetchNoticePosts(),
      fetchFreePosts()
    ]);
    
  } catch (error) {
    console.error('Home.vue 초기화 중 오류:', error);
  }
  
  console.log('Home.vue onMounted 종료');
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

.board-section {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
}

.board-column {
  flex: 1;
  background-color: var(--white);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-sm);
  padding: 1.5rem;
}

.board-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  text-align: center;
}

.board-list {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}

.board-item {
  padding: 0.75rem 0;
  border-bottom: 2px solid #e0e0e0 !important;
  margin-bottom: 0.5rem;
}

.board-item:last-child {
  border-bottom: none !important;
}

.board-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.board-link:hover {
  color: var(--primary-color);
}

.item-title {
  flex: 1;
  margin-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-date {
  font-size: 0.875rem;
  color: var(--gray-color);
  white-space: nowrap;
}

.board-item.empty-item {
  text-align: center;
  color: var(--gray-color);
  padding: 1rem 0;
}

.board-more-button {
  display: block;
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-color);
  color: var(--white);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.board-more-button:hover {
  background-color: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .board-section {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .board-column {
    padding: 1rem;
  }

  .board-title {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .board-item {
    padding: 0.5rem 0;
  }

  .item-title,
  .item-date {
    font-size: 0.875rem;
  }

  .board-more-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style>
