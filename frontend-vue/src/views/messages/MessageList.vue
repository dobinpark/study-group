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
          <div class="message-list" v-if="!loading">
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
                <tr v-if="messages.length === 0 && !errorMessage">
                  <td colspan="5" class="no-messages">받은 쪽지가 없습니다.</td>
                </tr>
                <tr v-if="errorMessage">
                  <td colspan="5" class="error-message">{{ errorMessage }}</td>
                </tr>
                <tr v-for="message in messages" :key="message.id" @click="viewMessage(message.id)" :class="{ 'unread': !(message.read || message.isRead) }">
                  <td>{{ message.displayNumber || '-' }}</td>
                  <td class="title">{{ message.title }}</td>
                  <td>{{ message.sender?.nickname || message.sender?.username || '알 수 없음' }}</td>
                  <td>{{ formatDate(message.createdAt) }}</td>
                  <td>{{ (message.read || message.isRead) ? '읽음' : '안읽음' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 로딩 중일 때 표시 -->
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>쪽지를 불러오는 중입니다...</p>
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
  receiver?: {
    id: number;
    username: string;
    nickname?: string;
  } | null;
  senderId: number;
  receiverId: number;
  studyGroupId?: number;
  createdAt: string;
  updatedAt?: string;
  isRead: boolean; // 백엔드에서는 isRead를 사용
  read?: boolean; // 프론트엔드 호환을 위한 별칭
  displayNumber?: number;
}

const router = useRouter();
const userStore = useUserStore();
const allMessages = ref<Message[]>([]);
const messages = ref<Message[]>([]);
const loading = ref(true);
const page = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const errorMessage = ref('');
const pageSize = 10; // 페이지당 표시할 항목 수

// 클라이언트 측 페이지네이션 및 검색 처리
const processMessages = () => {
  let filtered = [...allMessages.value];
  
  // isRead 필드를 read로 매핑 (필요한 경우)
  filtered = filtered.map(msg => {
    return {
      ...msg,
      read: msg.isRead // 백엔드의 isRead를 프론트엔드의 read로 매핑
    };
  });
  
  // 검색어가 있는 경우 필터링
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(message => 
      message.title.toLowerCase().includes(query) || 
      (message.sender?.nickname?.toLowerCase().includes(query) || 
       message.sender?.username.toLowerCase().includes(query))
    );
  }
  
  // 전체 페이지 수 계산
  totalPages.value = Math.max(1, Math.ceil(filtered.length / pageSize));
  
  // 현재 페이지가 총 페이지 수보다 크면 마지막 페이지로 설정
  if (page.value > totalPages.value) {
    page.value = totalPages.value;
  }
  
  // 현재 페이지에 해당하는 메시지만 추출
  const startIndex = (page.value - 1) * pageSize;
  messages.value = filtered.slice(startIndex, startIndex + pageSize);
  
  // 표시 번호 추가
  messages.value.forEach((message, index) => {
    message.displayNumber = filtered.length - startIndex - index;
  });
};

// 쪽지 목록 불러오기
const fetchMessages = async () => {
  loading.value = true;
  errorMessage.value = '';
  messages.value = [];
  
  console.log('메시지 불러오기 시작 - API 호출 전');
  try {
    // API 요청 정보 로깅
    console.log('API 호출: GET /messages/received');
    const response = await axios.get(`/messages/received`);
    
    console.log('API 응답 받음:', response);
    
    if (response.status === 200) {
      // 데이터 구조 로깅
      console.log('API 데이터 구조:', {
        responseType: typeof response.data,
        hasData: 'data' in response.data,
        dataType: response.data.data ? typeof response.data.data : 'undefined',
        isArray: response.data.data ? Array.isArray(response.data.data) : false,
        dataLength: response.data.data ? (Array.isArray(response.data.data) ? response.data.data.length : 'not an array') : 0
      });
      
      // 모든 메시지 저장
      allMessages.value = response.data.data || [];
      console.log(`받은 메시지 ${allMessages.value.length}개 불러옴`);
      
      // 표시할 메시지 처리
      processMessages();
    } else {
      console.error(`예상치 못한 상태 코드: ${response.status}`);
      errorMessage.value = `쪽지 목록을 불러올 수 없습니다. 상태 코드: ${response.status}`;
    }
  } catch (error: any) {
    console.error('쪽지 목록 불러오기 오류', error);
    
    // 오류 객체 상세 정보 로깅
    console.error('오류 상세:', {
      message: error.message,
      name: error.name,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response',
      request: error.request ? 'Request exists' : 'No request',
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        baseURL: error.config.baseURL,
        withCredentials: error.config.withCredentials
      } : 'No config'
    });
    
    // 더 상세한 오류 메시지
    if (error.response) {
      // 서버가 응답한 경우
      errorMessage.value = `서버 오류: ${error.response.status} ${error.response.data?.message || '알 수 없는 오류'}`;
    } else if (error.request) {
      // 요청은 전송됐지만 응답이 없는 경우
      errorMessage.value = '서버에서 응답이 없습니다. 네트워크 연결을 확인해주세요.';
    } else {
      // 요청 설정 중 오류
      errorMessage.value = `요청 오류: ${error.message}`;
    }
  } finally {
    loading.value = false;
    console.log('메시지 불러오기 완료 (성공 또는 실패)');
  }
};

// 날짜 형식 변환
const formatDate = (date: string) => new Date(date).toLocaleDateString();

// 검색
const search = () => {
  page.value = 1; // 검색 시 첫 페이지로 이동
  processMessages(); // 메시지 처리
};

// 페이지 변경
const changePage = (newPage: number) => {
  page.value = newPage;
  processMessages(); // 메시지 처리
};

// 쪽지 상세 페이지로 이동
const viewMessage = (id: number) => {
  console.log(`메시지 상세 보기 이동: ID ${id}`);
  
  // 읽지 않은 메시지를 클릭했을 때 아이콘 카운트를 갱신하기 위해
  // 읽지 않은 메시지 하나를 읽고 메시지 목록을 다시 불러온 후 상세 페이지로 이동하는 방식
  const message = messages.value.find(m => m.id === id);
  if (message && !(message.read || message.isRead)) {
    console.log(`읽지 않은 메시지를 클릭했습니다: ID ${id}, 헤더 알림 업데이트를 위해 처리 필요`);
    try {
      // 헤더에 있는 emitter 이벤트를 통해 알림 카운트 갱신 요청
      if (window.dispatchEvent) {
        console.log('updateNotificationCount 이벤트 발생');
        window.dispatchEvent(new CustomEvent('updateNotificationCount'));
      }
    } catch (error) {
      console.error('알림 카운트 갱신 이벤트 발생 실패:', error);
    }
  }
  
  router.push(`/messages/${id}`);
};

onMounted(() => {
  // 환경 변수 정보 로깅
  console.log('=== 메시지 목록 컴포넌트 마운트 ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VUE_APP_API_URL:', process.env.VUE_APP_API_URL);
  console.log('axios baseURL:', axios.defaults.baseURL);
  
  // axios 인스턴스 상태 확인
  console.log('axios withCredentials:', axios.defaults.withCredentials);
  console.log('axios 기본 헤더:', axios.defaults.headers);
  
  // 브라우저 정보
  console.log('브라우저 URL:', window.location.href);
  console.log('쿠키 상태:', document.cookie ? 'cookie 있음' : 'cookie 없음');
  console.log('================================');

  // 로그인 상태 확인
  if (!userStore.isLoggedIn) {
    console.log('로그인 상태 아님, 로그인 페이지로 리다이렉트');
    router.push('/login');
    return;
  }
  
  console.log('로그인 상태 확인됨, 메시지 불러오기 시작');
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