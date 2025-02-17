<template>
  <div class="profile-container">
    <div class="profile-inner">
      <div class="profile-card">
        <header class="profile-header">
          <h1>내 프로필</h1>
        </header>
        <main class="profile-content">
          <form @submit.prevent="updateProfile" class="profile-form">
            <div class="form-row">
              <div class="form-group">
                <label for="username">아이디</label>
                <input type="text" id="username" v-model="profile.username" readonly />
              </div>

              <div class="form-group">
                <label for="nickname">닉네임</label>
                <input type="text" id="nickname" v-model="profile.nickname" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">이메일</label>
                <input type="email" id="email" v-model="profile.email" />
              </div>

              <div class="form-group">
                <label for="phoneNumber">전화번호</label>
                <input type="tel" id="phoneNumber" v-model="profile.phoneNumber" />
              </div>
            </div>

            <fieldset class="password-section">
              <legend>비밀번호 변경 (선택 사항)</legend>
              <div class="form-row">
                <div class="form-group">
                  <label for="currentPassword">현재 비밀번호</label>
                  <input type="password" id="currentPassword" v-model="passwordChange.currentPassword" />
                </div>

                <div class="form-group">
                  <label for="newPassword">새 비밀번호</label>
                  <input type="password" id="newPassword" v-model="passwordChange.newPassword" />
                </div>
              </div>
            </fieldset>

            <div class="button-group">
              <button type="button" class="btn-cancel" @click="router.push('/home')">
                취소
              </button>
              <button type="submit" class="btn-save">
                저장
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import axios from '../utils/axios';

const router = useRouter();
const userStore = useUserStore();

const profile = ref({
  username: '',
  nickname: '',
  email: '',
  phoneNumber: ''
});

const passwordChange = ref({
  currentPassword: '',
  newPassword: ''
});

const getProfile = async () => {
  try {
    const response = await axios.get('/users/profile');
    profile.value = response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다.');
      userStore.clearUser();
      await router.push('/login');
    }
  }
};

const updateProfile = async () => {
  try {
    const updateData = {
      nickname: profile.value.nickname,
      email: profile.value.email,
      phoneNumber: profile.value.phoneNumber
    };

    if (passwordChange.value.currentPassword && passwordChange.value.newPassword) {
      updateData.currentPassword = passwordChange.value.currentPassword;
      updateData.newPassword = passwordChange.value.newPassword;
    }

    await axios.put('/users/profile', updateData);

    alert('프로필이 업데이트되었습니다.');
    passwordChange.value = { currentPassword: '', newPassword: '' };
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    alert(error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
  }
};

onMounted(() => {
  getProfile();
});
</script>

<style scoped>
.profile-container {
  min-height: calc(100vh - 200px); /* 네비게이션 바 높이를 고려한 조정 */
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}

.profile-inner {
  max-width: 1200px; /* 네비게이션 바와 동일한 최대 너비 */
  margin: 0 auto;
  padding: 0 2rem;
}

.profile-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.profile-header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 2rem;
  text-align: center;
}

.profile-header h1 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-content {
  padding: 2rem;
}

.profile-form {
  max-width: 1000px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
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

.form-group input[readonly] {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  cursor: not-allowed;
}

.password-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.password-section legend {
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  margin-bottom: 1rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-save {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
}

.btn-cancel:hover {
  background-color: #cbd5e0;
  transform: translateY(-1px);
}

.btn-save:hover {
  background: linear-gradient(135deg, #357ABD 0%, #2868A6 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
}

@media (max-width: 768px) {
  .profile-inner {
    padding: 0 1rem;
  }

  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .profile-header {
    padding: 1.5rem;
  }

  .profile-header h1 {
    font-size: 1.5rem;
  }

  .profile-content {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
