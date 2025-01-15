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
				<div class="nav-items">
					<ul>
						<li>분야별</li>
						<li>전공별</li>
						<li>지역별</li>
						<li>문의사항</li>
					</ul>
				</div>
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
	font-size: 50px;
	font-weight: bold;
	color: #000;
	text-decoration: none;
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
}

.nav-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem 0;
}

.nav-items ul {
	display: flex;
	justify-content: center;
	list-style: none;
	margin: 0;
	padding: 0;
	gap: 10rem;
}

.nav-items li {
	color: #fff;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
}

.nav-items li:hover {
	color: #1a365d;
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
</style>
