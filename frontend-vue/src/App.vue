<template>
	<div id="app">
		<Header />
		<main>
			<router-view v-if="!isLoading"></router-view>
			<div v-else class="loading">
				<div class="loading-spinner"></div>
				<p>로딩 중...</p>
			</div>
		</main>
		<Footer />
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from './store/auth';
import { useUserStore } from './store/user';
import Header from './components/Header.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
	name: 'App',
	components: {
		Header,
	},
	setup() {
		const authStore = useAuthStore();
		const userStore = useUserStore();
		const router = useRouter();
		const isLoading = computed(() => authStore.isLoading);

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

		// 앱 마운트 시 이벤트 리스너 등록
		onMounted(async () => {
			// 앱 마운트 시 한 번만 세션 체크
			if (!authStore.sessionChecked) {
				await authStore.checkSession();
			}

			// 401 오류 이벤트 리스너 등록
			window.addEventListener('auth:unauthorized', handleUnauthorized);
			window.addEventListener('auth:session-expired', handleSessionExpired);
		});

		// 컴포넌트 언마운트 시 이벤트 리스너 제거
		onBeforeUnmount(() => {
			window.removeEventListener('auth:unauthorized', handleUnauthorized);
			window.removeEventListener('auth:session-expired', handleSessionExpired);
		});

		return {
			isLoading
		};
	}
});
</script>

<style>
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
</style>
