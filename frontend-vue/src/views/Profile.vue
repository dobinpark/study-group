<template>
  <div class="min-h-full">
    <div class="py-10">
      <header>
        <div class="header-container">
          <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">내 프로필</h1>
        </div>
      </header>
      <main>
        <div class="main-container">
          <div class="px-4 py-8 sm:px-0">
            <div class="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
              <div class="space-y-6">
                <div class="border-b border-gray-900/10 pb-12">
                  <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label class="block text-sm font-medium leading-6 text-gray-900">아이디</label>
                      <div class="mt-2">
                        <input type="text" v-model="profile.username" readonly
                               class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 bg-gray-50" />
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label class="block text-sm font-medium leading-6 text-gray-900">닉네임</label>
                      <div class="mt-2">
                        <input type="text" v-model="profile.nickname" class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                                    placeholder:text-gray-400" />
                      </div>
                    </div>

                    <div class="sm:col-span-4">
                      <label class="block text-sm font-medium leading-6 text-gray-900">이메일</label>
                      <div class="mt-2">
                        <input type="email" v-model="profile.email" class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                                    placeholder:text-gray-400" />
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label
                          class="block text-sm font-medium leading-6 text-gray-900">전화번호</label>
                      <div class="mt-2">
                        <input type="tel" v-model="profile.phoneNumber" class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                                    placeholder:text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-b border-gray-900/10 pb-12">
                  <h2 class="text-base font-semibold leading-7 text-gray-900">비밀번호 변경</h2>
                  <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label class="block text-sm font-medium leading-6 text-gray-900">
                        현재 비밀번호
                      </label>
                      <div class="mt-2">
                        <input type="password" v-model="passwordChange.currentPassword" class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label class="block text-sm font-medium leading-6 text-gray-900">
                        새 비밀번호
                      </label>
                      <div class="mt-2">
                        <input type="password" v-model="passwordChange.newPassword" class="block w-full rounded-md border-0 py-1.5
                                                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" class="text-sm font-semibold leading-6 text-gray-900"
                        @click="router.push('/home')">취소</button>
                <button type="submit"
                        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold
                                    text-white shadow-sm hover:bg-indigo-500 focus-visible:outline
                                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        @click="updateProfile">저장</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';

const router = useRouter();

// 프로필 정보와 비밀번호 변경 정보를 위한 ref 변수들
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

// 프로필 정보 가져오기
const getProfile = async () => {
  try {
    const response = await axios.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
    profile.value = response.data;
  } catch (error) {
    console.error('프로필 조회 실패:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다.');
      await router.push('/login');
    }
  }
};

// 프로필 업데이트
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

    await axios.put('/users/profile', updateData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    alert('프로필이 업데이트되었습니다.');
    passwordChange.value = { currentPassword: '', newPassword: '' };
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    alert(error.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
  }
};

// 컴포넌트가 마운트될 때 프로필 정보 가져오기
onMounted(() => {
  getProfile();
});
</script>

<style scoped>
.header-container, .main-container {
    max-width: 1200px; /* 네비게이션 바와 동일한 최대 너비 설정 */
    margin: 0 auto;
    padding: 0 20px;
}
</style>
