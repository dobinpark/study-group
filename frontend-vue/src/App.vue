<template>
	<div id="app">
		<Header />
		<router-view />
	</div>
</template>

<script>
import Header from './components/Header.vue'; // 헤더 컴포넌트 임포트

export default {
	name: 'App',
	components: {
		Header,
	},
};
</script>
