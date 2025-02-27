<template>
	<div id="app">
		<Header />
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import Header from './components/Header.vue'
import { useUserStore } from './store/user';

const userStore = useUserStore();

onMounted(() => {
	userStore.checkAuth();
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

.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	font-size: 1.2rem;
	color: #666;
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
