<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="login-container">
        <div class="login-content">
            <h1 class="login-title">로그인</h1>
            <form @submit.prevent="handleSubmit" class="login-form">
                <div class="form-group">
                    <label for="username">아이디</label>
                    <input type="text" id="username" v-model="username" required placeholder="아이디를 입력하세요" />
                </div>
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" v-model="password" required placeholder="비밀번호를 입력하세요" />
                </div>
                <button type="submit" class="login-button">로그인</button>
                <div class="signup-link">
                    계정이 없으신가요? <router-link to="/signup">회원가입</router-link>
                </div>
                <div class="find-password-link">
                    비밀번호를 까먹으셨나요? <a href="#" @click.prevent="openFindPasswordModal">비밀번호 찾기</a>
                </div>
            </form>
        </div>
        <FindPasswordModal :is-open="isModalOpen" @close="closeModal" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../utils/axios';
import FindPasswordModal from '../components/FindPasswordModal.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const isModalOpen = ref(false);

const handleSubmit = async () => {
    try {
        if (!username.value || !password.value) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        const loginResponse = await axios.post('/auth/login', {
            username: username.value,
            password: password.value,
        });

        if (!loginResponse.data || !loginResponse.data.accessToken) {
            throw new Error('로그인 응답 데이터가 올바르지 않습니다.');
        }

        // 로그인 정보 저장
        const { accessToken, userId, nickname } = loginResponse.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('nickname', nickname);

        try {
            // 프로필 정보 확인
            await axios.get('/users/profile', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 로그인 성공 후 홈으로 이동
            router.push('/');
        } catch (profileError) {
            console.error('프로필 조회 실패:', profileError);
            // 프로필 조회 실패해도 로그인은 유지
            router.push('/');
        }
    } catch (error: any) {
        console.error('Login failed:', error.response?.data?.message || '로그인에 실패했습니다.');
        alert(error.response?.data?.message || '로그인에 실패했습니다.');
    }
};

const openFindPasswordModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};
</script>

<style scoped>
.login-container {
    width: 100%;
    min-height: calc(100vh - 140px);
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.login-content {
    width: 70%;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
    padding: 3.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2d3748;
    text-align: center;
    margin-bottom: 2rem;
    font-family: 'Pretendard', 'Arial', sans-serif;
}

.login-form {
    max-width: 400px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    font-size: 1rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: #4A90E2;
}

.login-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
}

.login-button:hover {
    background-color: #357abd;
}

.signup-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #4a5568;
}

.signup-link a {
    color: #4A90E2;
    text-decoration: none;
    font-weight: 600;
}

.signup-link a:hover {
    text-decoration: underline;
}

.find-password-link {
    text-align: center;
    margin-top: 1rem;
    color: #4a5568;
}

.find-password-link a {
    color: #4A90E2;
    text-decoration: none;
    font-weight: 600;
}

.find-password-link a:hover {
    text-decoration: underline;
}

@media (max-width: 768px) {
    .login-content {
        width: 90%;
        padding: 2rem;
    }

    .login-title {
        font-size: 2rem;
    }
}
</style>
