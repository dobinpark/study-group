<template>
  <div class="action-menu" ref="menuRef">
    <div class="action-button" @click="$emit('sendMessage')">
      <i class="fas fa-envelope"></i>
      쪽지 보내기
    </div>
    <div v-if="isCreator && !isMemberCreator" class="action-button danger" @click="$emit('removeMember')">
      <i class="fas fa-user-minus"></i>
      스터디 강제 탈퇴
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  isCreator: boolean;
  isMemberCreator: boolean;
}>();

const emit = defineEmits(['sendMessage', 'removeMember', 'close']);

const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit('close');
  }
};

// 메뉴 외부 클릭 시 닫기
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({
  handleClickOutside
});
</script>

<script lang="ts">
export default {
  name: 'MemberActionMenu'
};
</script>

<style scoped>
.action-menu {
  position: absolute;
  z-index: 10;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 0.5rem 0;
}

.action-button {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  color: #4a5568;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #f7fafc;
}

.action-button.danger {
  color: #e53e3e;
}

.action-button.danger:hover {
  background-color: #fff5f5;
}

.action-button i {
  font-size: 0.9rem;
}
</style> 