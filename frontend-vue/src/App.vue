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

const userStore = useUserStore();

onMounted(async () => {
	await userStore.fetchSessionStatus(); // 앱 시작 시 세션 상태 확인
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
