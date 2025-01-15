<template>
    <div v-if="isOpen" class="modal-overlay">
        <div class="modal-content">
            <h2 class="modal-title">비밀번호 찾기</h2>
            <form @submit.prevent="handleSubmit" class="modal-form">
                <div class="form-group">
                    <label for="username">아이디</label>
                    <input
                        type="text"
                        id="username"
                        v-model="username"
                        required
                        placeholder="아이디를 입력하세요"
                    />
                </div>
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input
                        type="email"
                        id="email"
                        v-model="email"
                        required
                        placeholder="이메일을 입력하세요"
                    />
                </div>
                <div class="button-group">
                    <button type="submit" class="submit-button">확인</button>
                    <button type="button" @click="close" class="cancel-button">취소</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
    isOpen: Boolean
});

const emit = defineEmits(['close']);

const username = ref('');
const email = ref('');

const handleSubmit = async () => {
    try {
        const response = await axios.post('http://localhost:3000/users/find-password', {
            username: username.value,
            email: email.value
        });
        
        alert(`임시 비밀번호가 발급되었습니다: ${response.data.password}\n로그인 후 반드시 비밀번호를 변경해주세요.`);
        close();
    } catch (error) {
        if (error.response?.status === 404) {
            alert('입력하신 아이디와 이메일이 일치하지 않습니다.');
        } else {
            alert('비밀번호 찾기 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }
};

const close = () => {
    username.value = '';
    email.value = '';
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
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-title {
    font-size: 1.5rem;
    color: #2d3748;
    text-align: center;
    margin-bottom: 1.5rem;
    font-weight: 600;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    font-size: 0.875rem;
    color: #4a5568;
    margin-bottom: 0.5rem;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
}

input:focus {
    outline: none;
    border-color: #4A90E2;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.submit-button, .cancel-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-button {
    background-color: #4A90E2;
    color: white;
}

.submit-button:hover {
    background-color: #357abd;
}

.cancel-button {
    background-color: #e2e8f0;
    color: #4a5568;
}

.cancel-button:hover {
    background-color: #cbd5e0;
}
</style> 