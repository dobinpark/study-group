<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<form @submit.prevent="signup">
		<div class="border-b border-gray-900/10 pb-12">
			<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">회원가입</h2>

			<div class="sm:col-span-5">
				<label for="username" class="block text-sm/6 font-medium text-gray-900">아이디</label>
				<div class="mt-2">
					<input id="username" name="username" type="text" v-model="username" autocomplete="username"
						placeholder="ex) example" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
								 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
								 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
				</div>
			</div>

			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-3">
					<label for="password" class="block text-sm/6 font-medium text-gray-900">비밀번호</label>
					<div class="mt-2">
						<input type="password" v-model="password" name="password" id="password" autocomplete="password"
							placeholder="ex) 최소 8자 이상, 영어/숫자/특수문자 각각 1자 이상 포함" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
									 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
									 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
					</div>
				</div>

				<div class="sm:col-span-3">
					<label for="confirmPassword" class="block text-sm/6 font-medium text-gray-900">비밀번호 재확인</label>
					<div class="mt-2">
						<input type="password" v-model="confirmPassword" name="confirmPassword" id="confirmPassword"
							autocomplete="current-password" placeholder="ex) 12345678" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
									 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
									 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
					</div>
				</div>

				<div class="sm:col-span-6">
					<label for="nickname" class="block text-sm/6 font-medium text-gray-900">닉네임</label>
					<div class="mt-2">
						<input id="nickname" name="nickname" type="text" v-model="nickname" autocomplete="nickname"
							placeholder="ex) 홍길동" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
									 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
									 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
					</div>
				</div>

				<div class="sm:col-span-6">
					<label for="email" class="block text-sm/6 font-medium text-gray-900">이메일</label>
					<div class="mt-2">
						<input id="email" name="email" type="email" v-model="email" autocomplete="email"
							placeholder="ex) example@example.com" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
									 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
									 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
					</div>
				</div>

				<div class="sm:col-span-6">
					<label for="phoneNumber" class="block text-sm/6 font-medium text-gray-900">전화번호</label>
					<div class="mt-2">
						<input id="phoneNumber" name="phoneNumber" type="text" v-model="phoneNumber" ocomplete="tel"
							placeholder="ex) 010-1234-5678" class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1
									 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2
									 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 flex items-center justify-end gap-x-6">
			<button type="button" @click="cancel" class="text-sm/6 font-semibold text-gray-900">취소</button>
			<button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm
							hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
							focus-visible:outline-indigo-600">회원가입</button>
		</div>
	</form>
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
		// 입력값 검증
		if (!username.value || !password.value || !confirmPassword.value || !nickname.value || !email.value || !phoneNumber.value) {
			alert('모든 필드를 입력해주세요.');
			return;
		}

		if (password.value !== confirmPassword.value) {
			alert('비밀번호가 일치하지 않습니다.');
			return;
		}

		// 전화번호 형식 변환 (하이픈 제거)
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
.signup {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
}

form {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	max-width: 600px;
	margin: 0 auto;
	padding: 20px;
}

input {
	margin: 10px 0;
}
</style>
