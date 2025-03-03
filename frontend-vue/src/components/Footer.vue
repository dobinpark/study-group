<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 학공. All rights reserved.</p>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer'
});
</script>

<style scoped>
.footer {
  padding: 1rem;
  background-color: #f8f9fa;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 