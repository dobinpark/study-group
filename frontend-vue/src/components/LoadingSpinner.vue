<template>
    <div class="loading-spinner">
        <div class="spinner"></div>
        <p>{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: '로딩 중입니다...'
    }
});
</script>

<style>
.loading-spinner {
    /* 구체적인 스타일 추가 */
}
</style>
