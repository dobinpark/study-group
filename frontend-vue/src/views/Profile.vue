<template>
  <div class="profile-container">
    <div class="profile-content">
      <h1>프로필</h1>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input type="text" id="nickname" v-model="form.nickname" required />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">전화번호</label>
          <input type="tel" id="phoneNumber" v-model="form.phoneNumber" required />
        </div>
        <div class="button-group">
          <button type="submit">수정하기</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';

const router = useRouter();

const form = reactive({
  nickname: '',
  email: '',
  phoneNumber: ''
});

const fetchProfile = async () => {
  try {
    const response = await axios.get('/auth/me');
    if (response.data.success) {
      Object.assign(form, response.data.data);
    }
  } catch (error: any) {
    alert('프로필 정보를 불러올 수 없습니다');
    router.push('/');
  }
};

const handleSubmit = async () => {
  try {
    const response = await axios.put('/users/profile', form);
    if (response.data.success) {
      alert('프로필이 수정되었습니다');
      router.push('/');
    }
  } catch (error: any) {
    alert(error.response?.data?.message || '프로필 수정에 실패했습니다');
  }
};

onMounted(fetchProfile);
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 200px); /* 네비게이션 바 높이를 고려한 조정 */
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}

.profile-content {
  max-width: 1200px; /* 네비게이션 바와 동일한 최대 너비 */
  margin: 0 auto;
  padding: 0 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-submit {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
}

.btn-submit:hover {
  background: linear-gradient(135deg, #357ABD 0%, #2868A6 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
}

@media (max-width: 768px) {
  .profile-content {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-submit {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
