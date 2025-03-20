<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1>받은 쪽지함</h1>
        </header>
        <main class="page-content">
          <div class="action-bar">
            <div class="search-box">
              <input type="text" v-model="searchQuery" placeholder="검색어 입력" @keyup.enter="search" :disabled="loading" />
              <button class="search-button" @click="search" :disabled="loading">검색</button>
            </div>
          </div>

          <!-- 쪽지 목록 - 데이터가 없어도 테이블 구조를 보여줌 -->
          <div class="message-list" v-if="!loading && messages">
            <table>
              <thead>
                <tr>
                  <th width="10%">번호</th>
                  <th width="50%">제목</th>
                  <th width="15%">보낸 사람</th>
                  <th width="15%">작성일</th>
                  <th width="10%">읽음</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="messages.length === 0">
                  <td colspan="5" class="no-messages">받은 쪽지가 없습니다.</td>
                </tr>
                <tr v-for="message in messages" :key="message.id" @click="viewMessage(message.id)" :class="{ 'unread': !message.read }">
                  <td>{{ message.displayNumber || '-' }}</td>
                  <td class="title">{{ message.title }}</td>
                  <td>{{ message.sender?.nickname || message.sender?.username || '알 수 없음' }}</td>
                  <td>{{ formatDate(message.createdAt) }}</td>
                  <td>{{ message.read ? '읽음' : '안읽음' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 로딩 중일 때 표시 -->
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>쪽지를 불러오는 중입니다...</p>
          </div>
          <div v-else-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          <div v-else-if="!messages" class="loading">
            쪽지 목록이 없습니다.
          </div>

          <!-- 페이지네이션 -->
          <div class="bottom-actions">
            <div class="pagination" v-if="totalPages > 0">
              <button :disabled="loading || page === 1" @click="changePage(page - 1)">
                이전
              </button>
              <span>{{ page }} / {{ totalPages }}</span>
              <button :disabled="loading || page === totalPages || totalPages === 0" @click="changePage(page + 1)">
                다음
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { useUserStore } from '../../store/user';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
dayjs.locale('ko');

// 쪽지 타입 정의
interface Message {
  id: number;
  title: string;
  content: string;
  sender: {
    id: number;
    username: string;
    nickname?: string;
  } | null;
  createdAt: string;
  read: boolean;
  displayNumber?: number;
}

const router = useRouter();
const userStore = useUserStore();
const messages = ref<Message[] | null>(null);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const errorMessage = ref('');
const currentPage = ref(1);
const pageSize = 10;

// 쪽지 목록 불러오기
const fetchMessages = async () => {
  loading.value = true;
  errorMessage.value = '';
  messages.value = null;
  try {
    const response = await axios.get(`/messages`, {
      params: {
        page: currentPage.value,
        size: pageSize,
        searchKeyword: searchQuery.value,
      },
    });
    
    if (response.status === 200) {
      messages.value = response.data.data.items;
      totalPages.value = response.data.data.totalPages;
    } else {
      errorMessage.value = `쪽지 목록을 불러올 수 없습니다. 상태 코드: ${response.status}`;
      messages.value = null;
    }
  } catch (error: any) {
    console.error('쪽지 목록 불러오기 오류', error);
    errorMessage.value = '쪽지 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    messages.value = null;
  } finally {
    loading.value = false;
  }
};

// 날짜 형식 변환
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// 검색
const search = () => {
  currentPage.value = 1;
  fetchMessages();
};

// 페이지 변경
const changePage = (newPage: number) => {
  currentPage.value = newPage;
  fetchMessages();
};

// 쪽지 상세 페이지로 이동
const viewMessage = (id: number) => router.push(`/messages/${id}`);

onMounted(() => {
  // 로그인 상태 확인
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  fetchMessages();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.message-list table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
}

.message-list th,
.message-list td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.message-list th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.message-list td.title {
  text-align: left;
  cursor: pointer;
}

.message-list tr:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.message-list tr.unread {
  font-weight: bold;
  background-color: #f0f7ff;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 300px;
}

.search-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: #6c757d;
  color: white;
}

.search-button:hover {
  background-color: #5a6268;
}

/* 페이지네이션 컨테이너 */
.bottom-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  position: relative;
}

.pagination {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin: 0 auto;
}

.pagination span {
  padding: 0 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.no-messages {
  text-align: center;
  padding: 2rem;
  color: #718096;
  font-size: 0.95rem;
}

.error-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: #e74c3c;
  text-align: center;
}

@media (max-width: 768px) {
  .bottom-actions {
    flex-direction: column;
    gap: 1rem;
    position: static;
  }

  .pagination {
    width: 100%;
    justify-content: center;
    margin: 0;
  }
}
</style> 