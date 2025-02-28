<template>
	<div id="app">
		<Header />
		<main>
			<router-view v-if="!isLoading"></router-view>
		</main>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { defineAsyncComponent } from 'vue';
const Header = defineAsyncComponent(() => import('./components/Header.vue'));
import { useTypedUserStore } from './utils/store-helpers';
import { useRouter } from 'vue-router';

const userStore = useTypedUserStore();
const router = useRouter();
const isLoading = ref(false);

// 401 오류 처리를 위한 이벤트 리스너
const handleUnauthorized = () => {
	console.log('인증되지 않은 요청 감지, 로그인 페이지로 리다이렉트');
	userStore.clearUserData();
	router.push('/login');
};

// 세션 만료 처리를 위한 이벤트 리스너
const handleSessionExpired = () => {
	console.log('세션이 만료되었습니다, 다시 로그인해주세요');
	userStore.clearUserData();
	router.push('/login');
};

// 앱 마운트 시 이벤트 리스너 등록
onMounted(() => {
	// 401 오류 이벤트 리스너 등록
	window.addEventListener('auth:unauthorized', handleUnauthorized);
	window.addEventListener('auth:session-expired', handleSessionExpired);

	// 앱 시작 시 세션 상태 확인
	userStore.checkAuth().then(isAuthenticated => {
		console.log('초기 세션 상태 확인 완료:', isAuthenticated ? '로그인됨' : '로그인되지 않음');
	}).catch(error => {
		console.error('세션 상태 확인 중 오류:', error);
	});
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
	window.removeEventListener('auth:unauthorized', handleUnauthorized);
	window.removeEventListener('auth:session-expired', handleSessionExpired);
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
