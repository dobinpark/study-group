<template>
	<header>
		<div class="header-container">
			<div class="top-container">
				<div class="top-content">
					<div class="logo-container">
						<img src="@/assets/images/book.png" alt="로고" class="logo" />
						<router-link to="/" class="title-link">
							<span class="title">함공</span>
						</router-link>
					</div>
					<div class="right-section">
						<div class="auth-container">
							<template v-if="isLoggedIn && !loading">
								<span class="welcome-text">{{ userNickname }}님, 환영합니다</span>
								<div class="nav-buttons">
									<router-link to="/my-studies" class="nav-button">
										<i class="fas fa-book-reader"></i>
										내 스터디
									</router-link>
									<router-link to="/profile" class="nav-button">
										<i class="fas fa-user"></i>
										프로필
									</router-link>
								</div>
								<button @click="logout" class="logout-button">
									<i class="fas fa-sign-out-alt"></i>
									로그아웃
								</button>
							</template>
							<template v-else-if="!loading">
								<span class="login-text">로그인 하세요</span>
								<router-link to="/login">
									<img src="@/assets/images/man.png" alt="로그인" class="login-icon" />
								</router-link>
							</template>
							<template v-if="loading">
								<span>로그인 상태 확인 중...</span>
							</template>
						</div>
					</div>
				</div>
			</div>
			<div class="nav-wrapper">
				<div class="nav-container">
					<nav class="nav-items">
						<ul class="main-menu">
							<li class="menu-item">지역별</li>
							<li class="menu-item">학습자별</li>
							<li class="menu-item">전공별</li>
							<li class="menu-item">커뮤니티</li>
							<li class="menu-item">고객센터</li>
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

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from '../utils/axios';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/index';
import type { Category } from '../types/category';

const router = useRouter();
const userStore = useUserStore();

const userNickname = computed(() => userStore.user?.nickname || '');
const isLoggedIn = ref(false);
const username = ref<string | null>(null);
const isMobile = ref(false);
const loading = ref(false);
const categories = ref([
	{
		name: '지역별',
		subCategories: [
			{
				name: '서울',
				items: ['전체', '강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구',
					'성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구']
			},
			{
				name: '인천',
				items: ['전체', '강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '옹진군', '중구']
			},
			{
				name: '부산',
				items: ['전체', '강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구']
			},
			{
				name: '대구',
				items: ['전체', '군위군', '남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구']
			},
			{
				name: '광주',
				items: ['전체', '광산구', '남구', '동구', '북구', '서구']
			},
			{
				name: '대전',
				items: ['전체', '대덕구', '동구', '서구', '유성구', '중구']
			},
			{
				name: '울산',
				items: ['전체', '남구', '동구', '북구', '울주군', '중구']
			},
			{
				name: '경기',
				items: ['전체', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구', '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시', '동두천시', '부천시',
					'성남시 분당구', '성남시 수정구', '성남시 중원구', '수원시 권선구', '수원시 장안구', '수원시 팔달구', '수원시 영통구', '시흥시', '안산시 단원구', '안산시 상록구', '안성시',
					'안양시 동안구', '안양시 만안구', '양주시', '양평군', '여주시', '연천군', '오산시', '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시', '이천시', '파주시',
					'평탱시', '포천시', '하남시', '화성시']
			},
			{
				name: '세종',
				items: ['전체']
			},
			{
				name: '충남',
				items: ['전체', '공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시', '서천군', '아산시', '예산군', '천안시 동남구', '천안시 서북구', '청양군', '태안군', '홍성군', '계룡시']
			},
			{
				name: '충북',
				items: ['전체', '괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시', '진천군', '청주시 청원구', '청주시 상당구', '청주시 서원구', '청주시 흥덕구', '충주시', '증평군']
			},
			{
				name: '경남',
				items: ['전체', '거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시', '산청군', '양산시', '의령군', '진주시', '창녕군',
					'창원시 마산함포구', '창원시 마산회원구', '창원시 성산구', '창원시 의창구', '창원시 진해구', '통영시', '하동군', '함안군', '함양군', '합천군']
			},
			{
				name: '경북',
				items: ['전체', '경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군', '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군', '울릉군', '울진군', '의성군',
					'청도군', '청송군', '칠곡군', '포항시 남구', '포항시 북구']
			},
			{
				name: '전남',
				items: ['전체', '강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군', '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군', '완도군', '장성군', '장흥군',
					'진도군', '함평군', '해남군', '화순군']
			},
			{
				name: '전북',
				items: ['전체', '고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군', '완주군', '익산시', '임실군', '장수군', '전주시', '정읍시', '진안군']
			},
			{
				name: '강원',
				items: ['전체', '강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군', '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군', '홍천군', '화천군', '횡성군']
			},
			{
				name: '제주',
				items: ['전체', '서귀포시', '제주시']
			}
		]
	},
	{
		name: '학습자별',
		subCategories: [
			{
				name: '중등',
				items: ['전체', '1학년', '2학년', '3학년']
			},
			{
				name: '고등',
				items: ['전체', '1학년', '2학년', '3학년']
			},
			{
				name: '대학/청년',
				items: ['대학생', '청년']
			},
			{
				name: '취업준비/수험',
				items: ['취업준비생', '수험생']
			},
			{
				name: '경력/이직',
				items: ['경력', '이직']
			},
			{
				name: '취미/자기계발',
				items: ['취미', '자기계발']
			}
		]
	},
	{
		name: '전공별',
		subCategories: [
			{
				name: '인문계열',
				items: ['전체', '철학', '역사학', '문학', '언어학', '종교학', '고고학', '예술학', '문화학']
			},
			{
				name: '사회과학계열',
				items: ['전체', '경제학', '사회학', '심리학', '교육학', '인류학', '행정학', '법학', '언론/미디어학']
			},
			{
				name: '자연과학계열',
				items: ['전체', '수학', '물리학', '화학', '생물학', '지구과학', '통계학']
			},
			{
				name: '공학계열',
				items: ['전체', '기계공학', '전기전자공학', '컴퓨터공학', '화학공학', '토목공학', '건축학', '로봇공학']
			},
			{
				name: '의학/보건학계열',
				items: ['전체', '의학', '치의학', '약학', '간호학', '수의학', '보건학']
			},
			{
				name: '예체능계열',
				items: ['전체', '음악', '미술', '영화', '연극', '무용', '체육']
			}
		]
	},
	{
		name: '커뮤니티',
		subCategories: [
			{
				name: '자유게시판'
			},
			{
				name: '질문게시판'
			},
			{
				name: '건의게시판'
			}
		]
	},
	{
		name: '고객센터',
		subCategories: [
			{
				name: '공지사항'
			},
			{
				name: '자주묻는질문'
			},
			{
				name: '1:1문의'
			}
		]
	}
]);

const updateMobileStatus = () => {
	isMobile.value = window.innerWidth <= 768;
};

const goToStudyList = (mainCategory: string, subCategory: string, item: string) => {
	const routeQuery = {
		mainCategory,
		subCategory,
		detailCategory: item === '전체' ? undefined : item,
	};

	router.push({
		name: 'StudyGroupList',
		query: routeQuery,
	});
};

const logout = async () => {
	loading.value = true;
	try {
		await axios.post('/users/logout');
		isLoggedIn.value = false;
		username.value = null;
		alert('로그아웃 되었습니다.');
		await router.push('/login');
	} catch (error) {
		console.error('로그아웃 실패:', error);
		alert('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
	} finally {
		loading.value = false;
	}
};

const fetchCategories = async () => {
	try {
		const response = await axios.get('/study-groups/categories');
		categories.value = response.data;
	} catch (error) {
		console.error('카테고리 조회 실패:', error);
	}
};

const getCategoryCount = (mainCategory: string, subCategory: string, detailCategory?: string) => {
	const matchingCategories = categories.value.filter((category) => {
		const mainMatch = category.name === mainCategory;
		const subMatch = category.subCategories?.some((sub) => sub.name === subCategory) || false;
		const detailMatch = !detailCategory || category.subCategories?.some((sub) => sub.items?.includes(detailCategory)) || false;
		return mainMatch && subMatch && detailMatch;
	});
	return matchingCategories.length;
};

const fetchUserInfo = async () => {
	try {
		loading.value = true;
		const response = await axios.get('/users/me', {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('accessToken')}`
			}
		});
		userStore.setUser(response.data);
		isLoggedIn.value = true;
	} catch (error: any) {
		console.error('사용자 정보 조회 실패:', error);
		isLoggedIn.value = false;
	} finally {
		loading.value = false;
	}
};

onMounted(() => {
	updateMobileStatus();
	window.addEventListener('resize', updateMobileStatus);
	fetchCategories();
	fetchUserInfo();
});

onUnmounted(() => {
	window.removeEventListener('resize', updateMobileStatus);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.header-container {
	max-width: 1200px;
	margin: 0 auto;
}

.title-link {
	text-decoration: none;
}

.top-container {
	background-color: white;
	padding: 10px 20px;
}

.nav-wrapper {
	background-color: #4A90E2;
	width: 100%;
	padding: 10px 0;
}

.main-menu {
	display: flex;
	justify-content: space-around;
	list-style: none;
	padding: 0;
	margin: 0;
}

.menu-item {
	color: #fff;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
	padding: 5px 50px;
}

.menu-item:hover {
	color: #1a365d;
}

.top-container {
	width: 100%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
}

.top-content {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
}

.logo-container {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 10px;
	z-index: 1;
}

.right-section {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-left: 1000px;
}

.logo {
	width: 100px;
	height: auto;
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
	color: #4A90E2;
	transform: scale(1.05) rotate(-2deg);
}

.welcome-text {
	font-size: 16px;
	color: #666;
}

.nav-container {
	width: 70%;
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
	padding: 0.5rem 1rem;
	color: #4A90E2;
	text-decoration: none;
	font-weight: 600;
	font-size: 0.9rem;
	border-radius: 6px;
	transition: all 0.3s ease;
	background-color: rgba(74, 144, 226, 0.1);
	border: 2px solid transparent;
	width: 100px;
	text-align: center;
}

.nav-button:hover {
	background-color: rgba(74, 144, 226, 0.15);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.logout-button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.4rem;
	padding: 0.5rem 1rem;
	background-color: #4A90E2;
	color: white;
	border: none;
	border-radius: 6px;
	cursor: pointer;
	font-weight: 600;
	font-size: 0.9rem;
	transition: all 0.3s ease;
	width: 100px;
	text-align: center;
}

.logout-button:hover {
	background-color: #357ABD;
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.login-icon {
	width: 30px;
	height: 30px;
}

@media (max-width: 768px) {
	.nav-buttons {
		flex-direction: row;
		gap: 0.5rem;
	}

	.nav-button {
		width: auto;
		justify-content: center;
	}
}
</style>
export { emitter };
