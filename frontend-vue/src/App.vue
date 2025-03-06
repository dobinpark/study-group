<template>
	<div id="app">
		<div v-if="!sessionChecked" class="loading-indicator">
			Loading ...
		</div>
		<div v-else>
			<Header />
			<main>
				<router-view :key="$route.fullPath" v-if="sessionChecked"></router-view>
				<div v-else class="loading">
					<div class="loading-spinner"></div>
					<p>로딩 중...</p>
				</div>
			</main>
			<Footer />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { useAuthStore } from './store/auth';
import { useUserStore } from './store/user';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
	name: 'App',
	components: {
		Header,
		Footer
	},
	setup() {
		const authStore = useAuthStore();
		const userStore = useUserStore();
		const router = useRouter();
		const route = useRoute();
		const sessionChecked = ref(false);

		// 401 오류 처리를 위한 이벤트 리스너
		const handleUnauthorized = () => {
			console.log('인증되지 않은 요청 감지, 로그인 페이지로 리다이렉트');
			authStore.logout();
		};

		// 세션 만료 처리를 위한 이벤트 리스너
		const handleSessionExpired = () => {
			console.log('세션이 만료되었습니다, 다시 로그인해주세요');
			authStore.logout();
		};

		// 앱 마운트 시 이벤트 리스너 등록 및 세션 체크
		onMounted(async () => {
			sessionChecked.value = false;
			console.log('App.vue: onMounted - 세션 체크 시작');
			await authStore.checkSession().finally(() => {
				sessionChecked.value = true;
			});
			console.log('App.vue: onMounted - 세션 체크 완료, sessionChecked:', sessionChecked.value);

			// 이벤트 리스너 등록
			window.addEventListener('auth:unauthorized', handleUnauthorized);
			window.addEventListener('auth:session-expired', handleSessionExpired);

			// 5분마다 세션 연장
			const extendSessionInterval = setInterval(async () => {
				if (userStore.isLoggedIn) {
					try {
						await axios.post('/auth/extend-session');
					} catch (error) {
						console.warn('세션 연장 실패:', error);
					}
				}
			}, 5 * 60 * 1000);
		});

		// 컴포넌트 언마운트 시 이벤트 리스너 제거
		onBeforeUnmount(() => {
			window.removeEventListener('auth:unauthorized', handleUnauthorized);
			window.removeEventListener('auth:session-expired', handleSessionExpired);
		});

		return {
			sessionChecked,
		};
	}
});
</script>

<style>
@import './assets/styles/common.css';

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

/* 전역 스타일 */
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	background-color: #f5f7fa;
	line-height: 1.5;
}

/* 링크 스타일 */
a {
	color: inherit;
	text-decoration: none;
}

/* 버튼 기본 스타일 */
button {
	cursor: pointer;
	border: none;
	outline: none;
}

.loading-indicator {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100vh;
}
</style>
