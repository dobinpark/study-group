<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="signup-container">
		<div class="signup-content">
			<h1 class="signup-title">회원가입</h1>
			<form @submit.prevent="signup" class="signup-form">
				<div class="form-group">
					<label for="username">아이디</label>
					<input type="text" id="username" v-model="username" required placeholder="아이디를 입력하세요" />
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="password">비밀번호</label>
						<input type="password" id="password" v-model="password" required
							placeholder="최소 8자 이상, 영어/숫자/특수문자 포함" />
					</div>

					<div class="form-group">
						<label for="confirmPassword">비밀번호 재확인</label>
						<input type="password" id="confirmPassword" v-model="confirmPassword" required
							placeholder="비밀번호를 다시 입력하세요." />
					</div>
				</div>

				<div class="form-group">
					<label for="nickname">닉네임</label>
					<input type="text" id="nickname" v-model="nickname" required placeholder="닉네임을 입력하세요" />
				</div>

				<div class="form-group">
					<label for="email">이메일</label>
					<input type="email" id="email" v-model="email" required placeholder="example@example.com" />
				</div>

				<div class="form-group">
					<label for="phoneNumber">전화번호</label>
					<input type="tel" id="phoneNumber" v-model="phoneNumber" required placeholder="010-1234-5678" />
				</div>

				<div class="button-group">
					<button type="button" @click="cancel" class="cancel-button">취소</button>
					<button type="submit" class="submit-button">회원가입</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const email = ref('');
const phoneNumber = ref('');

const cancel = () => {
	router.push('/home');
};

const signup = async () => {
	try {
		if (!username.value || !password.value || !confirmPassword.value || !nickname.value || !email.value || !phoneNumber.value) {
			alert('모든 필드를 입력해주세요.');
			return;
		}

		if (password.value !== confirmPassword.value) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		const formattedPhoneNumber = phoneNumber.value.replace(/-/g, '');

		const response = await axios.post('http://localhost:3000/auth/signup', {
			username: username.value,
			password: password.value,
			confirmPassword: confirmPassword.value,
			nickname: nickname.value,
			email: email.value,
			phoneNumber: formattedPhoneNumber
		});

		console.log('회원가입 성공:', response.data);
		alert('회원가입이 완료되었습니다.');
		router.push('/login');
	} catch (error) {
		console.error('회원가입 실패:', error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
		alert(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
	}
};
</script>

<style scoped>
.signup-container {
	width: 100%;
	min-height: calc(100vh - 140px);
	display: flex;
	justify-content: center;
	align-items: flex-start;
}

.signup-content {
	width: 70%;
	background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
	padding: 3rem;
	border-radius: 8px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-title {
	font-size: 2.5rem;
	font-weight: 700;
	color: #2d3748;
	text-align: center;
	margin-bottom: 2rem;
	font-family: 'Pretendard', 'Arial', sans-serif;
}

.signup-form {
	max-width: 800px;
	margin: 0 auto;
}

.form-row {
	display: flex;
	gap: 2rem;
	margin-bottom: 1.5rem;
}

.form-row .form-group {
	flex: 1;
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
	transition: all 0.2s;
}

input:focus {
	outline: none;
	border-color: #4A90E2;
	box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.button-group {
	display: flex;
	gap: 1rem;
	justify-content: flex-end;
	margin-top: 2rem;
}

.submit-button,
.cancel-button {
	padding: 0.75rem 2rem;
	border: none;
	border-radius: 6px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;
}

.submit-button {
	background-color: #4A90E2;
	color: white;
}

.submit-button:hover {
	background-color: #357abd;
	transform: translateY(-1px);
}

.cancel-button {
	background-color: #e2e8f0;
	color: #4a5568;
}

.cancel-button:hover {
	background-color: #cbd5e0;
	transform: translateY(-1px);
}

@media (max-width: 768px) {
	.signup-content {
		width: 90%;
		padding: 2rem;
	}

	.signup-title {
		font-size: 2rem;
	}

	.form-row {
		flex-direction: column;
		gap: 0;
	}

	.button-group {
		flex-direction: column;
	}

	.submit-button,
	.cancel-button {
		width: 100%;
	}
}
</style>
