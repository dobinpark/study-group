<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <h5 class="modal-title">비밀번호 찾기</h5>
        <button type="button" class="close-button" @click="closeModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </header>
      <div class="modal-body">
        <p>비밀번호 찾기 기능을 구현해야 합니다.</p>
        {/* 비밀번호 찾기 폼 또는 안내 내용 */}
      </div>
      <footer class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">닫기</button>
        {/* 필요하다면 추가 버튼 */}
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.3);
  width: 80%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.25rem;
  font-weight: 500;
}

.close-button {
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  float: right;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 1px 0 #fff;
  opacity: .5;
}

.close-button:hover {
  opacity: .75;
}

.modal-body {
  padding: 1.5rem;
  flex-grow: 1;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  border: 1px solid transparent;
}

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #545b62;
}
</style> 