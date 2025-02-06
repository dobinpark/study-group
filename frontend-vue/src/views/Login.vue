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
                    비밀번호를 잊으셨나요? <a href="#" @click.prevent="openFindPasswordModal">비밀번호 찾기</a>
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
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();
const username = ref('');
const password = ref('');
const isModalOpen = ref(false);

// 로그인 폼 제출 처리
const handleSubmit = async () => {
    try {
        if (!username.value || !password.value) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        // 로그인 요청
        const loginResponse = await axios.post('/auth/login', {
            username: username.value,
            password: password.value,
        });

        if (loginResponse.data.accessToken) {
            const { accessToken, userId, nickname } = loginResponse.data;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('nickname', nickname);
            router.push('/');
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.';
        alert(errorMessage);
    }
};

// 비밀번호 찾기 모달 열기
const openFindPasswordModal = () => {
    isModalOpen.value = true;
};

// 모달 닫기
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
