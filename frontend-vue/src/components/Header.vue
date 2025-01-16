<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<div class="top-container">
			<div class="top-content">
				<div class="logo-container">
					<img src="@/assets/images/book.png" alt="로고" class="logo" />
					<router-link to="/home">
						<span class="title">함공</span>
					</router-link>
				</div>
				<div class="right-section">
					<span v-if="isLoggedIn" class="welcome-text">{{ userNickname }}님, 환영합니다</span>
					<div class="auth-container">
						<template v-if="isLoggedIn">
							<router-link to="/profile">
								<img src="@/assets/images/man.png" alt="프로필" class="profile-icon" />
							</router-link>
							<button @click="logout" class="logout-button">로그아웃</button>
						</template>
						<template v-else>
							<span class="login-text" v-if="!isMobile">로그인하세요.</span>
							<router-link to="/login">
								<img src="@/assets/images/man.png" alt="로그인" class="login-icon" />
							</router-link>
						</template>
					</div>
				</div>
			</div>
		</div>
		<div class="nav-wrapper">
			<div class="nav-container">
				<nav class="nav-items">
					<ul class="main-menu">
						<li class="menu-item">
							지역별
							<ul class="sub-menu">
								<li class="sub-menu-item region">
									<div class="region-name">
										서울
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>강남구</li>
											<li>강동구</li>
											<li>강북구</li>
											<li>강서구</li>
											<li>관악구</li>
											<li>광진구</li>
											<li>구로구</li>
											<li>금천구</li>
											<li>노원구</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>도봉구</li>
											<li>동대문구</li>
											<li>동작구</li>
											<li>마포구</li>
											<li>서대문구</li>
											<li>서초구</li>
											<li>성동구</li>
											<li>성북구</li>
											<li>송파구</li>
											<li>양천구</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>영등포구</li>
											<li>용산구</li>
											<li>은평구</li>
											<li>종로구</li>
											<li>중구</li>
											<li>중랑구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										인천
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>강화군</li>
											<li>계양구</li>
											<li>남동구</li>
											<li>동구</li>
											<li>미추홀구</li>
											<li>부평구</li>
											<li>서구</li>
											<li>연수구</li>
											<li>옹진군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>중구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										부산
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>강서구</li>
											<li>금정구</li>
											<li>기장군</li>
											<li>남구</li>
											<li>동구</li>
											<li>동래구</li>
											<li>부산진구</li>
											<li>북구</li>
											<li>사상구</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>사하구</li>
											<li>서구</li>
											<li>수영구</li>
											<li>연제구</li>
											<li>영도구</li>
											<li>중구</li>
											<li>해운대구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										대구
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>군위군</li>
											<li>남구</li>
											<li>달서구</li>
											<li>달성군</li>
											<li>동구</li>
											<li>북구</li>
											<li>서구</li>
											<li>수성구</li>
											<li>중구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										광주
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>광산구</li>
											<li>남구</li>
											<li>동구</li>
											<li>북구</li>
											<li>서구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										대전
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>대덕구</li>
											<li>동구</li>
											<li>서구</li>
											<li>유성구</li>
											<li>중구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										울산
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>남구</li>
											<li>동구</li>
											<li>북구</li>
											<li>울주군</li>
											<li>중구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경기
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>가평군</li>
											<li>고양시 덕양구</li>
											<li>고양시 일산동구</li>
											<li>고양시 일산서구</li>
											<li>과천시</li>
											<li>광명시</li>
											<li>광주시</li>
											<li>구리시</li>
											<li>군포시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>김포시</li>
											<li>남양주시</li>
											<li>동두천시</li>
											<li>부천시</li>
											<li>성남시 분당구</li>
											<li>성남시 수정구</li>
											<li>성남시 중원구</li>
											<li>수원시 권선구</li>
											<li>수원시 장안구</li>
											<li>수원시 팔달구</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>수원시 영통구</li>
											<li>시흥시</li>
											<li>안산시 단원구</li>
											<li>안산시 상록구</li>
											<li>안성시</li>
											<li>안양시 동안구</li>
											<li>안양시 만안구</li>
											<li>양주시</li>
											<li>양평군</li>
											<li>여주시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>연천군</li>
											<li>오산시</li>
											<li>용인시 기흥구</li>
											<li>용인시 수지구</li>
											<li>용인시 처인구</li>
											<li>의왕시</li>
											<li>의정부시</li>
											<li>이천시</li>
											<li>파주시</li>
											<li>평택시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>포천시</li>
											<li>하남시</li>
											<li>화성시</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										세종
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										충남
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>공주시</li>
											<li>금산군</li>
											<li>논산시</li>
											<li>당진시</li>
											<li>보령시</li>
											<li>부여군</li>
											<li>서산시</li>
											<li>서천군</li>
											<li>아산시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>예산군</li>
											<li>천안시 동남구</li>
											<li>천안시 서북구</li>
											<li>청양군</li>
											<li>태안군</li>
											<li>홍성군</li>
											<li>계룡시</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										충북
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>괴산군</li>
											<li>단양군</li>
											<li>보은군</li>
											<li>영동군</li>
											<li>옥천군</li>
											<li>음성군</li>
											<li>제천시</li>
											<li>진천군</li>
											<li>청주시 청원구</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>청주시 상당구</li>
											<li>청주시 서원구</li>
											<li>청주시 흥덕구</li>
											<li>충주시</li>
											<li>증평군</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경남
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>거제시</li>
											<li>거창군</li>
											<li>고성군</li>
											<li>김해시</li>
											<li>남해군</li>
											<li>밀양시</li>
											<li>사천시</li>
											<li>산청군</li>
											<li>양산시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>의령군</li>
											<li>진주시</li>
											<li>창녕군</li>
											<li>창원시 마산합포구</li>
											<li>창원시 마산회원구</li>
											<li>창원시 성산구</li>
											<li>창원시 의창구</li>
											<li>창원시 진해구</li>
											<li>통영시</li>
											<li>하동군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>함안군</li>
											<li>함양군</li>
											<li>합천군</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경북
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>경산시</li>
											<li>경주시</li>
											<li>고령군</li>
											<li>구미시</li>
											<li>김천시</li>
											<li>문경시</li>
											<li>봉화군</li>
											<li>상주시</li>
											<li>성주군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>안동시</li>
											<li>영덕군</li>
											<li>영양군</li>
											<li>영주시</li>
											<li>영천시</li>
											<li>예천군</li>
											<li>을릉군</li>
											<li>울진군</li>
											<li>의성군</li>
											<li>청도군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>청송군</li>
											<li>칠곡군</li>
											<li>포항시 남구</li>
											<li>포항시 북구</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										전남
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>강진군</li>
											<li>고흥군</li>
											<li>곡성군</li>
											<li>광양시</li>
											<li>구례군</li>
											<li>나주시</li>
											<li>담양군</li>
											<li>목포시</li>
											<li>무안군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>보성군</li>
											<li>순천시</li>
											<li>신안군</li>
											<li>여수시</li>
											<li>영광군</li>
											<li>영암군</li>
											<li>완도군</li>
											<li>장성군</li>
											<li>장흥군</li>
											<li>진도군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>함평군</li>
											<li>해남군</li>
											<li>화순군</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										전북
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>고창군</li>
											<li>군산시</li>
											<li>김제시</li>
											<li>남원시</li>
											<li>무주군</li>
											<li>부안군</li>
											<li>순창군</li>
											<li>완주군</li>
											<li>익산시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>임실군</li>
											<li>장수군</li>
											<li>전주시 덕진구</li>
											<li>전주시 완산구</li>
											<li>정읍시</li>
											<li>진안군</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										강원
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>강릉시</li>
											<li>고성군</li>
											<li>동해시</li>
											<li>삼척시</li>
											<li>속초시</li>
											<li>양구군</li>
											<li>양양군</li>
											<li>영월군</li>
											<li>원주시</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>인제군</li>
											<li>정선군</li>
											<li>철원군</li>
											<li>춘천시</li>
											<li>태백시</li>
											<li>평창군</li>
											<li>홍천군</li>
											<li>화천군</li>
											<li>횡성군</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										제주
										<span class="region-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
											<li>서귀포시</li>
											<li>제주시</li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							분야별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">
										취미
										<span class="category-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>독서</li>
											<li>그림 그리기</li>
											<li>요리</li>
											<li>공예</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										스포츠
										<span class="category-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>축구</li>
											<li>농구</li>
											<li>배드민턴</li>
											<li>수영</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										여행
										<span class="category-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>국내 여행</li>
											<li>해외 여행</li>
											<li>배낭 여행</li>
											<li>럭셔리 여행</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										음악
										<span class="category-count">(0)</span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>악기 연주</li>
											<li>노래</li>
											<li>음악 감상</li>
											<li>작곡</li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							전공별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">
										전체
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										어문학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										인문과학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										사회과학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										자연과학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										공학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										법학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										사범학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										상경
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										생활과학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										예/체능학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										의/약학
										<span class="category-count">(0)</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										농/수산/해양학
										<span class="category-count">(0)</span>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">커뮤니티</li>
						<li class="menu-item">고객센터</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const userNickname = ref('');

const checkLoginStatus = async () => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		try {
			const response = await axios.get('http://localhost:3000/users/profile', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			isLoggedIn.value = true;
			userNickname.value = response.data.nickname;
		} catch (error) {
			console.error('프로필 조회 실패:', error);
			if (error.response?.status === 401) {
				logout();
			}
		}
	} else {
		isLoggedIn.value = false;
		userNickname.value = '';
	}
};

const logout = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	isLoggedIn.value = false;
	userNickname.value = '';
	router.push('/login');
};

watch(() => route.path, () => {
	checkLoginStatus();
});

onMounted(() => {
	checkLoginStatus();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.top-container {
	width: 100%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
}

.top-content {
	width: 70%;
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
	margin-left: auto;
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

.nav-wrapper {
	width: 70%;
	margin: 0 auto;
	background-color: #87CEEB;
	border-radius: 8px;
	height: calc(75px - 1px);
}

.nav-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem 0;
}

.nav-items {
	width: 100%;
	display: flex;
	justify-content: center;
}

.main-menu {
	display: flex;
	justify-content: space-around;
	list-style: none;
	margin: 0;
	padding: 0;
	position: relative;
}

.menu-item {
	color: #fff;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
	padding: 5px 60px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.menu-item:hover {
	color: #1a365d;
}

.sub-menu {
	display: none;
	position: absolute;
	top: 100%;
	left: 0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	border-radius: 4px;
	min-width: 150px;
	z-index: 1000;
}

.menu-item:hover > .sub-menu {
	display: flex;
	flex-direction: column;
}

.menu-item:hover > .sub-menu:has(.sub-menu-item:nth-child(10)) {
	flex-direction: row;
	flex-wrap: wrap;
	width: 300px;
}

.sub-menu:has(.sub-menu-item:nth-child(10)) .sub-menu-item {
	width: 50%;
	box-sizing: border-box;
}

.sub-menu-item {
	color: #333;
	padding: 12px 10px;
	font-size: 16px;
	position: relative;
	border-bottom: 1px solid #eee;
	white-space: nowrap;
}

.sub-menu-item:hover {
	background-color: #f8f9fa;
	color: #4A90E2;
}

.sub-sub-menu {
	position: absolute;
	left: 100%;
	top: 0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0,0,0,0.2);
	border-radius: 4px;
	min-width: 250px;
	display: none;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sub-menu-item:hover > .sub-sub-menu {
	display: flex;
	opacity: 1;
	visibility: visible;
	z-index: 1001;
}

.sub-sub-menu-column {
	min-width: 40px;
	width: 130px;
	border-right: 1px solid #eee;
	display: flex;
	flex-direction: column;
}

.sub-sub-menu-column:has(li:nth-child(10)) {
	max-height: 400px;
	overflow: hidden;
}

.sub-sub-menu-column:has(li:nth-child(10)) ~ .sub-sub-menu-column {
	border-left: 1px solid #eee;
}

.sub-sub-menu-column li {
	color: #333;
	padding: 8px 15px;
	font-size: 14px;
	border-bottom: 1px solid #eee;
	white-space: nowrap;
}

.auth-container {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.profile-icon,
.login-icon {
	width: 40px;
	height: 40px;
	cursor: pointer;
}

.logout-button {
	padding: 0.5rem 1rem;
	background-color: #f3f4f6;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 14px;
	color: #374151;
	cursor: pointer;
}

.logout-button:hover {
	background-color: #e5e7eb;
}

.login-text {
	font-size: 16px;
	color: #666;
	margin-right: 8px;
}

.sub-menu-item.region {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.region-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.region-count {
	font-size: 12px;
	color: #666;
	background-color: #f3f4f6;
	padding: 2px 6px;
	border-radius: 10px;
}

.sub-menu-item.category {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.category-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.category-count {
	font-size: 12px;
	color: #666;
	background-color: #f3f4f6;
	padding: 2px 6px;
	border-radius: 10px;
}

@media (max-width: 768px) {
	.title {
		font-size: 40px;
	}

	.logo {
		width: 80px;
	}

	.login-text {
		display: none;
	}

	.menu-item {
		font-size: 14px;
	}
}
</style>
