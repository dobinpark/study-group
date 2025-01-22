<template>
	<div id="app">
		<Header />
		<router-view></router-view>
	</div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
