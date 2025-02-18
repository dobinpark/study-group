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
	userStore.initialize(); // 먼저 localStorage에서 상태 복원
	try {
		// 인증 상태 확인
		await userStore.checkAuth();
	} catch (error) {
		console.error('인증 상태 확인 실패:', error);
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
