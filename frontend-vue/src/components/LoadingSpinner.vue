<template>
  <div class="loading-spinner" role="alert" aria-live="polite">
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
  display: flex;
  flex-direction: column; /* 스피너와 메시지를 세로로 배치 */
  align-items: center; /* 가로축 중앙 정렬 */
  justify-content: center; /* 세로축 중앙 정렬 (선택 사항) */
  padding: 20px;
  /* 필요에 따라 배경색, 폰트 설정 등 추가 */
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1); /* 테두리 기본 색상 */
  border-left-color: #3498db; /* 로딩 효과 색상 */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite; /* spin 애니메이션 적용 */
  margin-bottom: 10px; /* 스피너와 메시지 간 간격 */
}

.loading-spinner p {
  color: #555; /* 메시지 텍스트 색상 */
  font-size: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
