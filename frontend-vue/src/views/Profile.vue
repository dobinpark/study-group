<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="min-h-full">
        <div class="py-10">
            <header>
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">내 프로필</h1>
                </div>
            </header>
            <main>
                <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
import axios from 'axios';

const router = useRouter();
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
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3000/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        profile.value = response.data;
    } catch (error) {
        console.error('프로필 조회 실패:', error);
        if (error.response?.status === 401) {
            alert('로그인이 필요합니다.');
            router.push('/login');
        }
    }
};

const updateProfile = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const updateData = {
            nickname: profile.value.nickname,
            email: profile.value.email,
            phoneNumber: profile.value.phoneNumber
        };

        // 비밀번호 변경이 있는 경우
        if (passwordChange.value.currentPassword && passwordChange.value.newPassword) {
            updateData.currentPassword = passwordChange.value.currentPassword;
            updateData.newPassword = passwordChange.value.newPassword;
        }

        await axios.put('http://localhost:3000/users/profile', updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

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
