<template>
  <header>
    <div class="header-container">
      <div class="top-container">
        <div class="top-content">
          <div class="logo-container">
            <img alt="로고" class="logo" src="../assets/images/book.png" />
            <a href="#" class="title-link" @click.prevent="goHome">
              <span class="title">함공</span>
            </a>
          </div>
          <router-link class="notification-link" to="/messages">
            <img alt="알림" class="notification-icon" src="../assets/images/jong.png" />
            <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
          </router-link>
          <div class="auth-container" :class="{ 'mobile-auth': isMobile }">
            <template v-if="isLoggedInComputed && currentUser">
              <div class="nav-buttons" :class="{ 'mobile-nav-buttons': isMobile }">
                <router-link class="nav-button" to="/mypage">
                  마이페이지
                </router-link>
                <button class="nav-button" @click="handleLogout" :disabled="isLoggingOut"
                  style="background-color: red;">
                  {{
                    isLoggingOut
                      ? '로그아웃 중...'
                      : '로그아웃'
                  }}
                </button>
              </div>
            </template>
            <template v-else>
              <button class="login-button" @click="goToLogin">
                <img alt="로그인" class="login-icon" src="../assets/images/man.png" />
                로그인
              </button>
            </template>
          </div>
        </div>
      </div>
      <div class="nav-wrapper">
        <div class="nav-container">
          <nav class="nav-items" :class="{ 'mobile-nav-items': isMobile }">
            <ul class="main-menu" :class="{ 'mobile-main-menu': isMobile }">
              <li v-for="category in categories" :key="category.name" class="menu-item"
                :class="{ 'mobile-menu-item': isMobile }">
                {{ category.name }}
                <ul class="sub-menu multi-column">
                  <li v-for="(subCategoryGroup, groupIndex) in chunkSubCategories(category.subCategories, 10)"
                    :key="groupIndex" class="sub-menu-column">
                    <ul>
                      <li v-for="subCategory in subCategoryGroup" :key="subCategory.name" class="sub-menu-item" @click="
                        handleSubCategoryClick(
                          category.name,
                          subCategory.name,
                        )
                        ">
                        {{ subCategory.name }}
                        <ul v-if="
                          subCategory.items &&
                          subCategory.items
                            .length > 0
                        " class="detail-menu" :class="{
                          active:
                            activeSubCategoryName ===
                            subCategory.name,
                        }">
                          <li v-for="item in subCategory.items" :key="item" class="detail-menu-item" @click.stop="
                            navigateToStudyList(
                              category.name,
                              subCategory.name,
                              item
                            )
                            ">
                            {{ item }}
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="menu-item" :class="{ 'mobile-menu-item': isMobile }">
                커뮤니티
                <ul class="sub-menu multi-column">
                  <li class="sub-menu-column">
                    <ul>
                      <li v-for="category in communityCategories" :key="category.name" class="sub-menu-item" @click="
                        handleCommunityClick(
                          category.name,
                        )
                        ">
                        {{ category.name }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="menu-item" :class="{ 'mobile-menu-item': isMobile }">
                고객센터
                <ul class="sub-menu multi-column">
                  <li class="sub-menu-column">
                    <ul>
                      <li v-for="category in supportCategories" :key="category.name" class="sub-menu-item" @click="
                        handleSupportClick(
                          category.name,
                        )
                        ">
                        {{ category.name }}
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, provide, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import mitt from 'mitt';
import { useAuthStore } from '../store/auth';
import { useUserStore } from '../store/user';
import { useRouter } from 'vue-router';
import type { Category, SubCategory } from '../types/models';
import axios from '../utils/axios';
import { PostCategoryKorean } from '../types/models';

const router = useRouter();
const authStore = useAuthStore();
const userStore = useUserStore();

// 이벤트 버스 생성 및 제공
const emitter = mitt();
provide('emitter', emitter);

// 로그인 상태 관리
const isLoggedInComputed = computed(() => {
  console.log('Header.vue: isLoggedInComputed computed, isAuthenticated:', authStore.isAuthenticated);
  return authStore.isAuthenticated;
});
const currentUser = computed(() => {
  console.log('Header.vue: currentUser computed, user:', userStore.user);
  return userStore.user;
});
const isLoggingOut = ref(false);

// 알림 수 상태 관리
const notificationCount = ref(0);
const notificationInterval = ref<number | null>(null);

// 모바일 화면 여부
const isMobile = ref(false);
const activeSubCategoryName = ref('');
const isFindPasswordModalOpen = ref(false);

// 카테고리 데이터 정의
const categories = ref<Category[]>([
  {
    id: 1,
    name: '지역별',
    subCategories: [
      {
        name: '서울',
        items: [
          '전체',
          '강남구',
          '강동구',
          '강북구',
          '강서구',
          '관악구',
          '광진구',
          '구로구',
          '금천구',
          '노원구',
          '도봉구',
          '동대문구',
          '동작구',
          '마포구',
          '서대문구',
          '서초구',
          '성동구',
          '성북구',
          '송파구',
          '양천구',
          '영등포구',
          '용산구',
          '은평구',
          '종로구',
          '중구',
          '중랑구',
        ],
      },
      {
        name: '인천',
        items: [
          '전체',
          '강화군',
          '계양구',
          '남동구',
          '동구',
          '미추홀구',
          '부평구',
          '서구',
          '연수구',
          '옹진군',
          '중구',
        ],
      },
      {
        name: '부산',
        items: [
          '전체',
          '강서구',
          '금정구',
          '기장군',
          '남구',
          '동구',
          '동래구',
          '부산진구',
          '북구',
          '사상구',
          '사하구',
          '서구',
          '수영구',
          '연제구',
          '영도구',
          '중구',
          '해운대구',
        ],
      },
      {
        name: '대구',
        items: [
          '전체',
          '군위군',
          '남구',
          '달서구',
          '달성군',
          '동구',
          '북구',
          '서구',
          '수성구',
          '중구',
        ],
      },
      {
        name: '광주',
        items: ['전체', '광산구', '남구', '동구', '북구', '서구'],
      },
      {
        name: '대전',
        items: ['전체', '대덕구', '동구', '서구', '유성구', '중구'],
      },
      {
        name: '울산',
        items: ['전체', '남구', '동구', '북구', '울주군', '중구'],
      },
      {
        name: '경기',
        items: [
          '전체',
          '고양시 덕양구',
          '고양시 일산동구',
          '고양시 일산서구',
          '과천시',
          '광명시',
          '광주시',
          '구리시',
          '군포시',
          '김포시',
          '남양주시',
          '동두천시',
          '부천시',
          '성남시 분당구',
          '성남시 수정구',
          '성남시 중원구',
          '수원시 권선구',
          '수원시 장안구',
          '수원시 팔달구',
          '수원시 영통구',
          '시흥시',
          '안산시 단원구',
          '안산시 상록구',
          '안성시',
          '안양시 동안구',
          '안양시 만안구',
          '양주시',
          '양평군',
          '여주시',
          '연천군',
          '오산시',
          '용인시 기흥구',
          '용인시 수지구',
          '용인시 처인구',
          '의왕시',
          '의정부시',
          '이천시',
          '파주시',
          '평택시',
          '포천시',
          '하남시',
          '화성시',
        ],
      },
      {
        name: '세종',
        items: ['전체'],
      },
      {
        name: '충남',
        items: [
          '전체',
          '공주시',
          '금산군',
          '논산시',
          '당진시',
          '보령시',
          '부여군',
          '서산시',
          '서천군',
          '아산시',
          '예산군',
          '천안시 동남구',
          '천안시 서북구',
          '청양군',
          '태안군',
          '홍성군',
          '계룡시',
        ],
      },
      {
        name: '충북',
        items: [
          '전체',
          '괴산군',
          '단양군',
          '보은군',
          '영동군',
          '옥천군',
          '음성군',
          '제천시',
          '진천군',
          '청주시 청원구',
          '청주시 상당구',
          '청주시 서원구',
          '청주시 흥덕구',
          '충주시',
          '증평군',
        ],
      },
      {
        name: '경남',
        items: [
          '전체',
          '거제시',
          '거창군',
          '고성군',
          '김해시',
          '남해군',
          '밀양시',
          '사천시',
          '산청군',
          '양산시',
          '의령군',
          '진주시',
          '창녕군',
          '창원시 마산함포구',
          '창원시 마산회원구',
          '창원시 성산구',
          '창원시 의창구',
          '창원시 진해구',
          '통영시',
          '하동군',
          '함안군',
          '함양군',
          '합천군',
        ],
      },
      {
        name: '경북',
        items: [
          '전체',
          '경산시',
          '경주시',
          '고령군',
          '구미시',
          '김천시',
          '문경시',
          '봉화군',
          '상주시',
          '성주군',
          '안동시',
          '영덕군',
          '영양군',
          '영주시',
          '영천시',
          '예천군',
          '울릉군',
          '울진군',
          '의성군',
          '청도군',
          '청송군',
          '칠곡군',
          '포항시 남구',
          '포항시 북구',
        ],
      },
      {
        name: '전남',
        items: [
          '전체',
          '강진군',
          '고흥군',
          '곡성군',
          '광양시',
          '구례군',
          '나주시',
          '담양군',
          '목포시',
          '무안군',
          '보성군',
          '순천시',
          '신안군',
          '여수시',
          '영광군',
          '영암군',
          '완도군',
          '장성군',
          '장흥군',
          '진도군',
          '함평군',
          '해남군',
          '화순군',
        ],
      },
      {
        name: '전북',
        items: [
          '전체',
          '고창군',
          '군산시',
          '김제시',
          '남원시',
          '무주군',
          '부안군',
          '순창군',
          '완주군',
          '익산시',
          '임실군',
          '장수군',
          '전주시',
          '정읍시',
          '진안군',
        ],
      },
      {
        name: '강원',
        items: [
          '전체',
          '강릉시',
          '고성군',
          '동해시',
          '삼척시',
          '속초시',
          '양구군',
          '양양군',
          '영월군',
          '원주시',
          '인제군',
          '정선군',
          '철원군',
          '춘천시',
          '태백시',
          '평창군',
          '홍천군',
          '화천군',
          '횡성군',
        ],
      },
      {
        name: '제주',
        items: ['전체', '서귀포시', '제주시'],
      },
    ],
  },
  {
    id: 2,
    name: '학습자별',
    subCategories: [
      {
        name: '중등',
        items: ['전체', '1학년', '2학년', '3학년'],
      },
      {
        name: '고등',
        items: ['전체', '1학년', '2학년', '3학년'],
      },
      {
        name: '대학/청년',
        items: ['대학생', '청년'],
      },
      {
        name: '취업준비/수험',
        items: ['취업준비생', '수험생'],
      },
      {
        name: '경력/이직',
        items: ['경력', '이직'],
      },
      {
        name: '취미/자기계발',
        items: ['취미', '자기계발'],
      },
    ],
  },
  {
    id: 3,
    name: '전공별',
    subCategories: [
      {
        name: '인문계열',
        items: [
          '전체',
          '철학',
          '역사학',
          '문학',
          '언어학',
          '종교학',
          '고고학',
          '예술학',
          '문화학',
        ],
      },
      {
        name: '사회과학계열',
        items: [
          '전체',
          '경제학',
          '사회학',
          '심리학',
          '교육학',
          '인류학',
          '행정학',
          '법학',
          '언론/미디어학',
        ],
      },
      {
        name: '자연과학계열',
        items: [
          '전체',
          '수학',
          '물리학',
          '화학',
          '생물학',
          '지구과학',
          '통계학',
        ],
      },
      {
        name: '공학계열',
        items: [
          '전체',
          '기계공학',
          '전기전자공학',
          '컴퓨터공학',
          '화학공학',
          '토목공학',
          '건축학',
          '로봇공학',
        ],
      },
      {
        name: '의학/보건학계열',
        items: [
          '전체',
          '의학',
          '치의학',
          '약학',
          '간호학',
          '수의학',
          '보건학',
        ],
      },
      {
        name: '예체능계열',
        items: ['전체', '음악', '미술', '영화', '연극', '무용', '체육'],
      },
    ],
  },
]);

// 커뮤니티 카테고리 분리
const communityCategories = ref<SubCategory[]>([
  { name: '자유게시판' },
  { name: '질문게시판' },
  { name: '건의게시판' },
]);

// 고객센터 카테고리 분리
const supportCategories = ref<SubCategory[]>([
  { name: '공지사항' },
  { name: '자주묻는질문' },
  { name: '1:1문의' },
]);

// 카테고리 청크 분할
const chunkSubCategories = (
  subCategories: SubCategory[],
  size: number,
): SubCategory[][] => {
  if (!subCategories) return [];

  const chunks: SubCategory[][] = [];
  for (let i = 0; i < subCategories.length; i += size) {
    chunks.push(subCategories.slice(i, i + size));
  }
  return chunks;
};

// 로그아웃 처리
const handleLogout = async () => {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  try {
    console.log('로그아웃 시도');
    await authStore.logout();
    console.log('로그아웃 성공, 홈페이지로 이동');
    router.push('/');
  } catch (error) {
    console.error('로그아웃 실패:', error);
    alert('로그아웃 중 오류가 발생했습니다.');
  } finally {
    isLoggingOut.value = false;
  }
};

// 모바일 화면 체크 함수
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

// 스터디 그룹 목록 페이지로 이동
const navigateToStudyList = (mainCategory: string, subCategory: string, item: string) => {
  if (!mainCategory || !subCategory || !item) return;

  router.push({
    path: '/study-groups',
    query: {
      mainCategory,
      subCategory: subCategory,
      detailCategory: item === '전체' ? '' : item,
    },
  });
};

// 해당 서브 카테고리가 속한 메인 카테고리 찾기
const findMainCategoryBySubCategory = (subCategoryName: string): string => {
  for (const category of categories.value) {
    if (category.subCategories.some(sub => sub.name === subCategoryName)) {
      return category.name;
    }
  }
  return '';
};

// 서브 카테고리 클릭 시 이동
const handleSubCategoryClick = (mainCategory: string, subCategory: string) => {
  console.log(`중분류 클릭: ${mainCategory} > ${subCategory}`);

  // 현재 활성화된 중분류가 클릭한 중분류와 같으면 비활성화, 아니면 활성화
  if (activeSubCategoryName.value === subCategory) {
    activeSubCategoryName.value = '';
  } else {
    activeSubCategoryName.value = subCategory;

    // 소분류 메뉴 열 수 조절 (항목 수에 따라)
    nextTick(() => {
      const detailMenu = document.querySelector('.detail-menu.active') as HTMLElement;
      if (detailMenu) {
        const itemCount = detailMenu.querySelectorAll('.detail-menu-item').length;

        // 클래스 초기화
        detailMenu.classList.remove('one-column', 'two-columns', 'three-columns');

        // 항목 수에 따라 클래스 추가
        if (itemCount <= 10) {
          detailMenu.classList.add('one-column');
        } else if (itemCount <= 20) {
          detailMenu.classList.add('two-columns');
        } else {
          detailMenu.classList.add('three-columns');
        }
      }
    });
  }
};

// 커뮤니티 카테고리 클릭 핸들러
const handleCommunityClick = (categoryName: string) => {
  // PostCategoryKorean 객체를 이용하여 categoryMap 생성
  const categoryMap = Object.entries(PostCategoryKorean).reduce((map, [key, koreanName]) => {
    if (communityCategories.value.some(communityCategory => communityCategory.name === koreanName)) {
      map[koreanName] = key;
    }
    return map;
  }, {} as Record<string, string>);

  console.log('handleCommunityClick 호출 - categoryName:', categoryName);
  console.log('categoryMap:', categoryMap);
  console.log('categoryMap[categoryName]:', categoryMap[categoryName as keyof typeof categoryMap]);

  router.push({
    path: '/posts',
    query: {
      category: String(categoryMap[categoryName as keyof typeof categoryMap]),
    },
  });
};

// 고객센터 카테고리 클릭 핸들러
const handleSupportClick = (category: string) => {
  switch (category) {
    case '공지사항':
      router.push({ path: '/supports', query: { category: 'NOTICE' } });
      break;
    case '자주묻는질문':
      router.push({ path: '/supports', query: { category: 'FAQ' } });
      break;
    case '1:1문의':
      router.push({ path: '/supports', query: { category: 'INQUIRY' } });
      break;
  }
};

// 함공 로고 클릭 시 메인 페이지로 이동하면서 새로고침
const goHome = () => {
  // 현재 홈 페이지에 있다면 페이지 새로고침
  if (router.currentRoute.value.path === '/') {
    window.location.reload();
  } else {
    // 아니면 홈 페이지로 이동
    router.push('/');
  }
};

// 알림 수 가져오기
const fetchNotificationCount = async () => {
  if (!isLoggedInComputed.value) return;

  let totalCount = 0;

  try {
    // 읽지 않은 쪽지 수 가져오기
    try {
      const messagesResponse = await axios.get('/messages/unread-count');
      if (messagesResponse.status === 200 && messagesResponse.data.data !== undefined) {
        totalCount += messagesResponse.data.data;
      }
    } catch (error) {
      console.error('읽지 않은 쪽지 수를 가져오는데 실패했습니다:', error);
      // 오류가 발생해도 계속 진행
    }

    // 새로운 공지사항 수 가져오기
    try {
      // API가 아직 구현되지 않았을 수 있으므로 조건부로 호출
      // 구현된 API로 교체하세요
      const noticesResponse = await axios.get('/study-groups/notices/unread-count');
      if (noticesResponse.status === 200 && noticesResponse.data.data !== undefined) {
        totalCount += noticesResponse.data.data;
      }
    } catch (error) {
      console.error('읽지 않은 공지사항 수를 가져오는데 실패했습니다:', error);
      // 오류가 발생해도 계속 진행
    }

    // 전체 알림 수 업데이트
    notificationCount.value = totalCount;
  } catch (error) {
    console.error('알림 수를 가져오는데 실패했습니다:', error);
  }
};

// 컴포넌트 마운트 시 인증 상태 다시 확인
onMounted(() => {
  // 모바일 화면 체크
  checkMobile();
  window.addEventListener('resize', checkMobile);
  if (!authStore.sessionChecked) {
    authStore.checkSession();
  } else {
    console.log('세션 이미 확인됨');
  }

  // 알림 수 가져오기
  fetchNotificationCount();

  // 1분마다 알림 수 업데이트
  notificationInterval.value = window.setInterval(fetchNotificationCount, 60000);
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);

  // 알림 인터벌 정리
  if (notificationInterval.value !== null) {
    window.clearInterval(notificationInterval.value);
    notificationInterval.value = null;
  }
});

// 서브 카테고리 활성화 상태 감시
watch(activeSubCategoryName, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    // 서브 카테고리 변경 시 처리
  }
});

// export default 대신 defineExpose 사용
defineExpose({
  userStore,
  isLoggedInComputed,
  currentUser,
  handleLogout,
  checkMobile,
  navigateToStudyList,
  handleSubCategoryClick,
  handleCommunityClick,
  handleSupportClick,
  isMobile,
  isFindPasswordModalOpen,
});

// 카테고리 목록 가져오기
const fetchCategories = async () => {
  try {
    const response = await axios.get('/category/list');
    if (response.status === 200) {
      categories.value = response.data;
      response.data.forEach((mainCategory: any) => {
        fetchSubCategories(mainCategory.value);
      });
    }
  } catch (error: any) {
    console.error('카테고리 목록을 불러오는데 실패했습니다.', error);
  }
};

// 서브 카테고리 목록 가져오기
const fetchSubCategories = async (mainCategoryValue: string) => {
  try {
    const response = await axios.get(`/category/${mainCategoryValue}/sub-categories`);
    if (response.status === 200) {
      categories.value = {
        ...categories.value,
        [mainCategoryValue]: response.data,
      };
    }
  } catch (error: any) {
    console.error(`${mainCategoryValue} 카테고리의 서브 카테고리 목록을 불러오는데 실패했습니다.`, error);
  }
};

// 로그인 페이지 이동 함수
const goToLogin = () => {
  console.log('Header: 로그인 페이지로 이동');
  
  // 세션 상태 초기화 (쿠키 문제 해결을 위한 철저한 정리)
  try {
    // 로컬 스토리지에서 인증 정보 제거
    window.localStorage.removeItem('auth-session');
    
    // 쿠키 정리
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
    
    console.log('Header: 로그인 페이지 이동 전 인증 상태 초기화 완료');
    
    // 백엔드 세션도 정리
    axios.post('/auth/logout', {}, { 
      validateStatus: (status) => true // 오류가 발생해도 계속 진행
    }).catch(err => {
      console.log('Header: 백엔드 로그아웃 호출 실패 (무시됨)');
    });
    
    // 스토어 초기화
    if (authStore.clearUser && typeof authStore.clearUser === 'function') {
      authStore.clearUser();
    }
    
  } catch (error) {
    console.error('Header: 인증 상태 초기화 중 오류:', error);
  }
  
  // 로그인 페이지로 이동 (새 인증 흐름 시작을 위해)
  router.push('/login');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.header-container {
  max-width: 1200px;
  margin: 0 auto;
}

.top-container {
  width: 100%;
  height: 80px;
  position: relative;
}

.top-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.welcome-container {
  width: auto;
  max-width: 30%;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: auto;
  margin-left: 485px;
}

.right-section {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.logo {
  width: 100px;
  height: auto;
}

.title-link {
  text-decoration: none;
}

.title {
  font-size: 65px;
  font-weight: 400;
  color: #1a365d;
  text-decoration: none;
  font-family: 'Nanum Pen Script', cursive;
  letter-spacing: 1px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.title:hover {
  color: #4a90e2;
  transform: scale(1.05) rotate(-2deg);
}

.welcome-text {
  font-size: 18px;
  color: #666;
  word-break: break-word;
  line-height: 1.4;
  text-align: left;
}

@media (max-width: 768px) {
  .welcome-text {
    font-size: 14px;
  }
}

.nav-wrapper {
  background-color: #4a90e2 !important;
  width: 100%;
  padding: 10px 0;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-items {
  width: 100%;
  display: flex;
  justify-content: center;
}

.main-menu {
  width: 80%;
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 20px;
  position: relative;
  text-align: center;
}

.menu-item:hover {
  color: #1a365d;
}

.menu-item>ul {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #4a90e2;
  padding: 0;
  list-style: none;
  width: 200px;
  z-index: 10;
}

.menu-item:hover>ul,
.menu-item:focus-within>ul {
  display: block;
}

.sub-menu-item {
  padding: 5px 10px;
  color: white;
  cursor: pointer;
  list-style-type: none;
  display: block;
  text-align: left;
  white-space: nowrap;
  padding-left: 10px;
  margin-left: 0;
  transition: background-color 0.3s ease;
  width: 180px;
  box-sizing: border-box;
  position: relative;
}

.sub-menu-item:hover {
  background-color: #357abd;
}

.sub-menu-item>ul {
  display: none;
  position: absolute;
  top: 0;
  left: 100%;
  background-color: #4a90e2;
  padding: 0;
  list-style: none;
  width: 200px;
  z-index: 11;
}

.detail-menu {
  position: absolute;
  left: 100%;
  top: 0;
  background-color: #2c5d8f;
  border-radius: 0 8px 8px 0;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  border: 1px solid #214670;
  padding: 15px;
  z-index: 20;
  width: auto;
  min-width: 180px;
  max-width: 800px;
  display: none;
}

.detail-menu.active {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 5px;
}

.sub-menu-item:hover>.detail-menu.active {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 5px;
}

.detail-menu-item {
  padding: 8px 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
  cursor: pointer;
  color: #ffffff;
  font-weight: 500;
}

.detail-menu-item:hover {
  background-color: #1e3c5a;
}

.auth-container.mobile-auth {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.nav-buttons.mobile-nav-buttons {
  flex-direction: column;
  gap: 0.3rem;
}

.nav-items.mobile-nav-items {
  flex-direction: column;
  align-items: flex-start;
}

.main-menu.mobile-main-menu {
  flex-direction: column;
  align-items: flex-start;
}

.menu-item.mobile-menu-item {
  padding: 10px 0;
  font-size: 18px;
}

.sub-menu.mobile-sub-menu {
  position: static;
  width: 100%;
  display: block;
}

.sub-menu-item.mobile-sub-menu-item {
  padding-left: 30px;
}

.detail-menu.mobile-detail-menu {
  position: static;
  width: 100%;
  display: block;
}

.detail-menu-item.mobile-detail-menu-item {
  padding-left: 50px;
}

.sub-menu.multi-column {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  flex-direction: row;
  flex-wrap: wrap;
  z-index: 12;
  background-color: #4a90e2;
  padding: 10px 0;
  min-width: auto;
  width: max-content;
}

.menu-item:hover>.sub-menu.multi-column,
.menu-item:focus-within>.sub-menu.multi-column {
  display: flex;
}

.sub-menu-column {
  width: auto;
  margin-right: 20px;
  border-bottom: none;
}

.sub-menu-column>ul {
  display: block;
  width: fit-content;
  min-width: 180px;
}

.main-menu>li:first-child .sub-menu-column>ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 360px;
  gap: 0;
}

.sub-menu-column:last-child {
  margin-right: 0;
}

.auth-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-buttons {
  display: flex;
  gap: 0.5rem;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  text-decoration: none;
  min-width: 100px;
}

.nav-button:hover {
  background-color: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.login-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.login-button:hover {
  background-color: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.login-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.logout-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  min-width: 100px;
  min-height: 2.5rem;
}

.logout-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.find-password-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #4a90e2;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  min-width: auto;
  margin-left: 10px;
}

.find-password-button:hover {
  color: #357abd;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-container {
    width: 100%;
    padding: 0 10px;
  }

  .detail-menu {
    position: static;
    left: auto;
    width: 100%;
    margin-top: 5px;
    margin-left: 15px;
    box-shadow: none;
    border-left: 2px solid #fff;
  }

  .sub-menu-item {
    flex-direction: column;
  }

  .welcome-text {
    font-size: 14px;
  }
}

/* 학습자별과 전공별 카테고리의 너비 조정 */
.main-menu>li:nth-child(2) .sub-menu-column>ul,
.main-menu>li:nth-child(3) .sub-menu-column>ul {
  width: 180px;
}

/* 지역별 카테고리의 서브메뉴 너비 조정 */
.main-menu>li:first-child .sub-menu-column>ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 360px;
  gap: 0;
}

/* 소분류 컬럼의 너비 조정 */
.sub-menu-column {
  width: auto;
  margin-right: 20px;
  border-bottom: none;
}

.sub-menu-column:last-child {
  margin-right: 0;
}

/* JavaScript로 동적으로 클래스 추가를 위한 스타일 */
.detail-menu.one-column {
  grid-template-columns: 1fr !important;
  width: 180px !important;
}

.detail-menu.two-columns {
  grid-template-columns: repeat(2, 1fr) !important;
  width: 360px !important;
}

.detail-menu.three-columns {
  grid-template-columns: repeat(3, 1fr) !important;
  width: 540px !important;
}

.notification-link {
  display: inline-flex;
  align-items: center;
  position: relative;
  padding: 0.5rem 1rem;
  color: #4a90e2;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  margin-right: 1rem;
}

.notification-link:hover {
  color: #357abd;
  transform: translateY(-2px);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: 2px;
  background-color: #e53e3e;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  height: 18px;
  min-width: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.notification-icon {
width: 30px;
  height: 30px;
  margin-right: 8px;
  vertical-align: middle;
}
</style>
