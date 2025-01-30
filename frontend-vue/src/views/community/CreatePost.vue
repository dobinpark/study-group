<template>
    <div class="create-post-container">
        <h2 class="page-title">{{ categoryTitle }} 글쓰기</h2>

        <div class="form-container">
            <div class="form-group">
                <label for="title">제목</label>
                <input type="text" id="title" v-model="title" placeholder="제목을 입력하세요"
                    :class="{ 'error': errors.title }">
                <span class="error-message" v-if="errors.title">{{ errors.title }}</span>
            </div>

            <div class="form-group">
                <label for="content">내용</label>
                <textarea id="content" v-model="content" placeholder="내용을 입력하세요" rows="15"
                    :class="{ 'error': errors.content }"></textarea>
                <span class="error-message" v-if="errors.content">{{ errors.content }}</span>
            </div>

            <div class="button-group">
                <button class="cancel-button" @click="cancel">취소</button>
                <button class="submit-button" @click="submitPost">등록</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { PostCategoryKorean } from '../../types/post';

const route = useRoute();
const router = useRouter();

const title = ref('');
const content = ref('');
const errors = ref({
    title: '',
    content: ''
});

const categoryTitle = computed(() => {
    const category = route.params.category as keyof typeof PostCategoryKorean;
    return PostCategoryKorean[category] || '게시판';
});

const validateForm = () => {
    let isValid = true;
    errors.value = {
        title: '',
        content: ''
    };

    if (!title.value.trim()) {
        errors.value.title = '제목을 입력해주세요.';
        isValid = false;
    }

    if (!content.value.trim()) {
        errors.value.content = '내용을 입력해주세요.';
        isValid = false;
    }

    return isValid;
};

const submitPost = async () => {
    if (!validateForm()) return;

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        const category = getCategory(String(route.params.category));
        console.log('Route params:', route.params);
        console.log('Submitting post with category:', category);

        const response = await axios.post('http://localhost:3000/posts', {
            title: title.value,
            content: content.value,
            category: category
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        window.alert('게시글이 성공적으로 작성되었습니다.');
        router.push({
            path: `/posts/${response.data.id}`,
            query: { 
                category: category
            }
        });
    } catch (error: any) {
        window.alert(error.response?.data?.message || '게시글 작성에 실패했습니다.');
    }
};

const cancel = () => {
    router.push({
        path: '/posts',
        query: { category: getCategory(String(route.params.category)) }
    });
};

const getCategory = (category: string): string => {
    console.log('Incoming category parameter:', category);
    const categoryMap: { [key: string]: string } = {
        'free': 'FREE',
        'question': 'QUESTION',
        'suggestion': 'SUGGESTION'
    };
    const mappedCategory = categoryMap[category.toLowerCase()];
    console.log('Category mapping:', { original: category, mapped: mappedCategory });
    return mappedCategory || 'FREE';
};
</script>

<style scoped>
.create-post-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.page-title {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.form-container {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #2c3e50;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #4A90E2;
}

.form-group input.error,
.form-group textarea.error {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.cancel-button,
.submit-button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.cancel-button {
    background-color: #6c757d;
    color: white;
}

.submit-button {
    background-color: #4A90E2;
    color: white;
}

.cancel-button:hover {
    background-color: #5a6268;
}

.submit-button:hover {
    background-color: #357ABD;
}
</style>
