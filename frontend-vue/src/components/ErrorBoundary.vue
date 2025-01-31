<template>
  <slot v-if="!hasError" />
  <div v-else class="error-fallback">
    <h2>문제가 발생했습니다</h2>
    <button @click="resetError">다시 시도</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const hasError = ref(false);
const resetError = () => {
  hasError.value = false;
  window.location.reload();
};

const errorHandler = (err) => {
  hasError.value = true;
  console.error('Error Boundary:', err);
};

defineExpose({ errorHandler });
</script>
