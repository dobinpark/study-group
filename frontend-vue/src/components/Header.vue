<template>
  <header>
    <div class="header-container">
		<div class="top-container">
			<div class="top-content">
				<div class="logo-container">
            <img alt="로고" class="logo" src="@/assets/images/book.png" />
            <router-link class="title-link" to="/">
						<span class="title">함공</span>
					</router-link>
				</div>
				<div class="right-section">
            <div class="auth-container" :class="{ 'mobile-auth': isMobile }">
              <template v-if="userStore.isLoggedIn && userStore.user">
                <span class="welcome-text">{{ userStore.user.nickname }}님 환영합니다!</span>
                <div class="nav-buttons" :class="{ 'mobile-nav-buttons': isMobile }">
                  <router-link class="nav-button" to="/my-studies">
                    내 스터디
							</router-link>
                  <router-link class="nav-button" to="/profile">
                    프로필
                  </router-link>
                </div>
                <button class="logout-button" @click="logout">
                  로그아웃
                </button>
						</template>
						<template v-else>
                <span class="login-text">로그인 해주세요</span>
							<router-link to="/login">
                  <button class="login-button">
                    <img alt="로그인" class="login-icon" src="@/assets/images/man.png" />
                    로그인
                  </button>
							</router-link>
						</template>
              <template v-if="userStore.loading">
                <span>로그인 상태 확인 중...</span>
						</template>
					</div>
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
                      <li v-for="subCategory in subCategoryGroup" :key="subCategory.name" class="sub-menu-item"
                        @click="handleSubCategoryClick(category.name, subCategory.name)">
                        {{ subCategory.name }}
                        <ul v-if="subCategory.items && subCategory.items.length > 0" class="detail-menu"
                          :style="{ display: activeSubCategoryName === subCategory.name ? 'block' : 'none' }">
                          <li v-for="item in subCategory.items" :key="item" class="detail-menu-item"
                            @click.stop="navigateToStudyList(subCategory.name, item)">
                            {{ item }}
								</li>
										</ul>
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

<script lang="ts">
import { provide } from 'vue';
import mitt from 'mitt';

export const emitter = mitt();
provide('emitter', emitter);

export default {
  name: 'MainHeader',
};
</script>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import axios from '../utils/axios';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import type { Category, SubCategory } from '@/types/category';
/*import categoriesData from '@/assets/data/categories.json';*/

const userStore = useUserStore();
const router = useRouter();

const isMobile = ref(false);

const categories = ref([
  {
    "name": "지역별",
    "subCategories": [
      {
        "name": "서울",
        "items": [
          "전체",
          "강남구",
          "강동구",
          "강북구",
          "강서구",
          "관악구",
          "광진구",
          "구로구",
          "금천구",
          "노원구",
          "도봉구",
          "동대문구",
          "동작구",
          "마포구",
          "서대문구",
          "서초구",
          "성동구",
          "성북구",
          "송파구",
          "양천구",
          "영등포구",
          "용산구",
          "은평구",
          "종로구",
          "중구",
          "중랑구"
        ]
      },
      {
        "name": "인천",
        "items": [
          "전체",
          "강화군",
          "계양구",
          "남동구",
          "동구",
          "미추홀구",
          "부평구",
          "서구",
          "연수구",
          "옹진군",
          "중구"
        ]
      },
      {
        "name": "부산",
        "items": [
          "전체",
          "강서구",
          "금정구",
          "기장군",
          "남구",
          "동구",
          "동래구",
          "부산진구",
          "북구",
          "사상구",
          "사하구",
          "서구",
          "수영구",
          "연제구",
          "영도구",
          "중구",
          "해운대구"
        ]
      },
      {
        "name": "대구",
        "items": [
          "전체",
          "군위군",
          "남구",
          "달서구",
          "달성군",
          "동구",
          "북구",
          "서구",
          "수성구",
          "중구"
        ]
      },
      {
        "name": "광주",
        "items": [
          "전체",
          "광산구",
          "남구",
          "동구",
          "북구",
          "서구"
        ]
      },
      {
        "name": "대전",
        "items": [
          "전체",
          "대덕구",
          "동구",
          "서구",
          "유성구",
          "중구"
        ]
      },
      {
        "name": "울산",
        "items": [
          "전체",
          "남구",
          "동구",
          "북구",
          "울주군",
          "중구"
        ]
      },
      {
        "name": "경기",
        "items": [
          "전체",
          "고양시 덕양구",
          "고양시 일산동구",
          "고양시 일산서구",
          "과천시",
          "광명시",
          "광주시",
          "구리시",
          "군포시",
          "김포시",
          "남양주시",
          "동두천시",
          "부천시",
          "성남시 분당구",
          "성남시 수정구",
          "성남시 중원구",
          "수원시 권선구",
          "수원시 장안구",
          "수원시 팔달구",
          "수원시 영통구",
          "시흥시",
          "안산시 단원구",
          "안산시 상록구",
          "안성시",
          "안양시 동안구",
          "안양시 만안구",
          "양주시",
          "양평군",
          "여주시",
          "연천군",
          "오산시",
          "용인시 기흥구",
          "용인시 수지구",
          "용인시 처인구",
          "의왕시",
          "의정부시",
          "이천시",
          "파주시",
          "평택시",
          "포천시",
          "하남시",
          "화성시"
        ]
      },
      {
        "name": "세종",
        "items": [
          "전체"
        ]
      },
      {
        "name": "충남",
        "items": [
          "전체",
          "공주시",
          "금산군",
          "논산시",
          "당진시",
          "보령시",
          "부여군",
          "서산시",
          "서천군",
          "아산시",
          "예산군",
          "천안시 동남구",
          "천안시 서북구",
          "청양군",
          "태안군",
          "홍성군",
          "계룡시"
        ]
      },
      {
        "name": "충북",
        "items": [
          "전체",
          "괴산군",
          "단양군",
          "보은군",
          "영동군",
          "옥천군",
          "음성군",
          "제천시",
          "진천군",
          "청주시 청원구",
          "청주시 상당구",
          "청주시 서원구",
          "청주시 흥덕구",
          "충주시",
          "증평군"
        ]
      },
      {
        "name": "경남",
        "items": [
          "전체",
          "거제시",
          "거창군",
          "고성군",
          "김해시",
          "남해군",
          "밀양시",
          "사천시",
          "산청군",
          "양산시",
          "의령군",
          "진주시",
          "창녕군",
          "창원시 마산함포구",
          "창원시 마산회원구",
          "창원시 성산구",
          "창원시 의창구",
          "창원시 진해구",
          "통영시",
          "하동군",
          "함안군",
          "함양군",
          "합천군"
        ]
      },
      {
        "name": "경북",
        "items": [
          "전체",
          "경산시",
          "경주시",
          "고령군",
          "구미시",
          "김천시",
          "문경시",
          "봉화군",
          "상주시",
          "성주군",
          "안동시",
          "영덕군",
          "영양군",
          "영주시",
          "영천시",
          "예천군",
          "울릉군",
          "울진군",
          "의성군",
          "청도군",
          "청송군",
          "칠곡군",
          "포항시 남구",
          "포항시 북구"
        ]
      },
      {
        "name": "전남",
        "items": [
          "전체",
          "강진군",
          "고흥군",
          "곡성군",
          "광양시",
          "구례군",
          "나주시",
          "담양군",
          "목포시",
          "무안군",
          "보성군",
          "순천시",
          "신안군",
          "여수시",
          "영광군",
          "영암군",
          "완도군",
          "장성군",
          "장흥군",
          "진도군",
          "함평군",
          "해남군",
          "화순군"
        ]
      },
      {
        "name": "전북",
        "items": [
          "전체",
          "고창군",
          "군산시",
          "김제시",
          "남원시",
          "무주군",
          "부안군",
          "순창군",
          "완주군",
          "익산시",
          "임실군",
          "장수군",
          "전주시",
          "정읍시",
          "진안군"
        ]
      },
      {
        "name": "강원",
        "items": [
          "전체",
          "강릉시",
          "고성군",
          "동해시",
          "삼척시",
          "속초시",
          "양구군",
          "양양군",
          "영월군",
          "원주시",
          "인제군",
          "정선군",
          "철원군",
          "춘천시",
          "태백시",
          "평창군",
          "홍천군",
          "화천군",
          "횡성군"
        ]
      },
      {
        "name": "제주",
        "items": [
          "전체",
          "서귀포시",
          "제주시"
        ]
      }
    ]
  },
  {
    "name": "학습자별",
    "subCategories": [
      {
        "name": "중등",
        "items": [
          "전체",
          "1학년",
          "2학년",
          "3학년"
        ]
      },
      {
        "name": "고등",
        "items": [
          "전체",
          "1학년",
          "2학년",
          "3학년"
        ]
      },
      {
        "name": "대학/청년",
        "items": [
          "대학생",
          "청년"
        ]
      },
      {
        "name": "취업준비/수험",
        "items": [
          "취업준비생",
          "수험생"
        ]
      },
      {
        "name": "경력/이직",
        "items": [
          "경력",
          "이직"
        ]
      },
      {
        "name": "취미/자기계발",
        "items": [
          "취미",
          "자기계발"
        ]
      }
    ]
  },
  {
    "name": "전공별",
    "subCategories": [
      {
        "name": "인문계열",
        "items": [
          "전체",
          "철학",
          "역사학",
          "문학",
          "언어학",
          "종교학",
          "고고학",
          "예술학",
          "문화학"
        ]
      },
      {
        "name": "사회과학계열",
        "items": [
          "전체",
          "경제학",
          "사회학",
          "심리학",
          "교육학",
          "인류학",
          "행정학",
          "법학",
          "언론/미디어학"
        ]
      },
      {
        "name": "자연과학계열",
        "items": [
          "전체",
          "수학",
          "물리학",
          "화학",
          "생물학",
          "지구과학",
          "통계학"
        ]
      },
      {
        "name": "공학계열",
        "items": [
          "전체",
          "기계공학",
          "전기전자공학",
          "컴퓨터공학",
          "화학공학",
          "토목공학",
          "건축학",
          "로봇공학"
        ]
      },
      {
        "name": "의학/보건학계열",
        "items": [
          "전체",
          "의학",
          "치의학",
          "약학",
          "간호학",
          "수의학",
          "보건학"
        ]
      },
      {
        "name": "예체능계열",
        "items": [
          "전체",
          "음악",
          "미술",
          "영화",
          "연극",
          "무용",
          "체육"
        ]
      }
    ]
  },
  {
    "name": "커뮤니티",
    "subCategories": [
      {
        "name": "자유게시판"
      },
      {
        "name": "질문게시판"
      },
      {
        "name": "건의게시판"
      }
    ]
  },
  {
    "name": "고객센터",
    "subCategories": [
      {
        "name": "공지사항"
      },
      {
        "name": "자주묻는질문"
      },
      {
        "name": "1:1문의"
      }
    ]
  }
]);

const chunkSubCategories = (subCategories: SubCategory[], size: number): SubCategory[][] => {
  const chunks: SubCategory[][] = [];
  for (let i = 0; i < subCategories.length; i += size) {
    chunks.push(subCategories.slice(i, i + size));
  }
  return chunks;
};

const logout = () => {
  userStore.clearUser();
  router.push('/login');
};

/*const fetchCategories = async () => {
  try {
    const response = await axios.get('/study-groups/categories');
    categories.value = response.data;
    console.log('Header.vue - API categories.value (after fetch):', categories.value); // 이 로그를 다시 확인
    console.log('Header.vue - API 카테고리 데이터:', categories.value); // 이 로그도 다시 확인
  } catch (error) {
    console.error('카테고리 조회 실패:', error);
    alert('카테고리 정보를 불러오는 데 실패했습니다.');
  }
};*/

const fetchUserInfo = async () => {
  console.log(
    'MainHeader.vue - fetchUserInfo - 시작 - userStore.accessToken:',
    userStore.accessToken,
  );

  if (!userStore.accessToken) {
    console.warn(
      'MainHeader.vue - fetchUserInfo - accessToken 없음, 사용자 정보 조회 건너뜀',
    );
    return;
  }

  userStore.setLoading(true);

  try {
    const response = await axios.get('/api/auth/profile');

    if (response.status === 200 || response.status === 201) {
      console.log(
        'MainHeader.vue - fetchUserInfo - API 응답 성공 - response.data:',
        response.data,
      );
      userStore.setUser(response.data);
    } else {
      console.error(
        'MainHeader.vue - fetchUserInfo - API 응답 실패 (200/201 외) - 상태 코드:',
        response.status,
      );
      userStore.clearUser();
    }
  } catch (error: any) {
    console.error(
      'MainHeader.vue - fetchUserInfo - 사용자 정보 조회 실패:',
      error,
    );

    if (error.response && error.response.status === 401) {
      console.warn(
        'MainHeader.vue - fetchUserInfo - 401 Unauthorized 에러 발생 - 로그아웃 처리',
      );
      userStore.clearUser();
    } else {
      console.error(
        'MainHeader.vue - fetchUserInfo - API 요청 중 오류 발생:',
        error,
      );
    }
  } finally {
    userStore.setLoading(false);
    console.log('MainHeader.vue - fetchUserInfo - 완료');
  }
};

// 사용자 정보 확인 함수
const checkUserInfo = async () => {
  if (userStore.accessToken && !userStore.user?.nickname) {
    try {
      const response = await axios.get('/auth/profile');
      userStore.setUser(response.data);
		} catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  }
};

// 라우터 이동 시 사용자 정보 확인
watch(() => router.currentRoute.value.path, async () => {
  await checkUserInfo();
});

onMounted(async () => {
  await checkUserInfo();
  await fetchUserInfo();
  /*await fetchCategories();*/

  updateMobileStatus();
  window.addEventListener('resize', updateMobileStatus);

  console.log('MainHeader.vue - onMounted - activeSubCategoryName.value:', activeSubCategoryName.value);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobileStatus);
});

const updateMobileStatus = () => {
  isMobile.value = window.innerWidth <= 768; // 768px 이하이면 모바일로 간주
  console.log('MainHeader.vue - updateMobileStatus - isMobile:', isMobile.value);
};

// ref 변수 추가: 현재 활성화된 중분류 메뉴 이름 저장
const activeSubCategoryName = ref<string | null>(null);

// 소분류 메뉴 표시/숨김 토글 함수
const toggleDetailMenu = (subCategoryName: string) => {
  if (activeSubCategoryName.value === subCategoryName) {
    // 이미 활성화된 중분류 메뉴를 다시 클릭 시: 닫기
    activeSubCategoryName.value = null;
	} else {
    // 다른 중분류 메뉴 클릭 시: 열기(기존 메뉴 닫고)
    activeSubCategoryName.value = subCategoryName;
  }
};

// 스터디 목록 페이지로 이동하는 함수 수정
const navigateToStudyList = (category: string, detail?: string) => {
  const query: { mainCategory: string; subCategory?: string } = { 
    mainCategory: category 
  };
  
  if (detail) {
    query.subCategory = detail;
  }
  
  router.push({
    path: '/study-group-list',
    query
  });
};

// 게시판 페이지로 이동하는 함수 추가
const navigateToBoard = (category: string) => {
  router.push({
    path: '/community/posts',
    query: { category }
  });
};

// 중분류 클릭 핸들러 함수
const handleSubCategoryClick = (mainCategory: string, subCategory: string) => {
  if (mainCategory === '커뮤니티') {
    // 커뮤니티 메뉴인 경우 게시판으로 이동
    const categoryMap: { [key: string]: string } = {
      '자유게시판': 'FREE',
      '질문게시판': 'QUESTION',
      '건의게시판': 'SUGGESTION'
    };
    
    const category = categoryMap[subCategory];
    if (category) {
      router.push({
        path: '/post-list',
        query: { category }
      });
    }
  } else {
    // 다른 메뉴의 경우 기존 토글 기능 유지
    toggleDetailMenu(subCategory);
  }
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
  justify-content: center;
  /* 중앙 정렬 */
	align-items: center;
	position: relative;
}

.logo-container {
	display: flex;
	align-items: center;
	gap: 10px;
  /* margin-left과 margin-right를 auto로 설정하여 중앙 정렬 */
  margin: 0 auto;
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
  /* 밑줄 제거 */
}

.title {
	font-size: 65px;
	font-weight: 400;
	color: #1a365d;
	text-decoration: none;
  /* 밑줄 제거 */
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
	font-size: 16px;
	color: #666;
}

.nav-wrapper {
  background-color: #4a90e2;
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
  /* 전체 너비 사용 */
	display: flex;
  justify-content: space-between;
  /* 메뉴 항목들을 균등하게 분배 */
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
  /* 패딩 조정 */
	position: relative;
  text-align: center;
  /* 텍스트 중앙 정렬 */
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  white-space: nowrap;
  padding-left: 0;
  margin-left: 0;
  transition: background-color 0.3s ease;
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

.detail-menu-item {
  padding: 10px 20px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.detail-menu-item:hover {
  background-color: #357abd;
}

/* 모바일 스타일 */
.auth-container.mobile-auth {
	flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.nav-buttons.mobile-nav-buttons {
  flex-direction: column;
  gap: 0.3rem;
}

.nav-items.mobile-nav-items {}

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
  /* 항상 표시 */
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
  z-index: 12;
  background-color: #4a90e2;
  padding: 10px 0;
}

.menu-item:hover>.sub-menu.multi-column,
.menu-item:focus-within>.sub-menu.multi-column {
  display: flex;
  /* flexbox 레이아웃으로 표시 */
}

.sub-menu-column {
  width: 200px;
  /* 열 너비 200px으로 수정 - 중요! */
  margin-right: 20px;
  /* 열 사이 간격 20px으로 수정 */
  border-bottom: none;
  /* border-bottom 제거 */
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
	display: flex;
	align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.4rem 0.7rem;
  color: #4a90e2;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: rgba(74, 144, 226, 0.1);
  border: 2px solid transparent;
  width: 65px;
  text-align: center;
}

.nav-button:hover {
  background-color: rgba(74, 144, 226, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
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
}

.logout-button:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .nav-container {
    width: 100%;
    /* 모바일에서는 전체 너비 사용 */
    padding: 0 10px;
  }

  /* ... 나머지 모바일 스타일 유지 ... */
}
</style>
export { emitter };
