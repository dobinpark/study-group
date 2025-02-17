<template>
	<div id="app">
		<Header />
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/store';
import Header from './components/Header.vue'
import axios from '@/utils/axios';

const userStore = useUserStore();

onMounted(async () => {
	// localStorage에서 사용자 정보 복원
	userStore.initializeFromStorage();
	
	if (localStorage.getItem('accessToken')) {
		try {
			// 서버에서 최신 사용자 정보 가져오기
			const response = await axios.get('/auth/profile');
			userStore.setUser(response.data);
		} catch (error) {
			console.error('사용자 정보 조회 실패:', error);
			userStore.clearUser();
		}
	}
});
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
