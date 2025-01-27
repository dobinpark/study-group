<template>
    <div class="edit-post-container">
        <div class="edit-post-content">
            <h2 class="page-title">게시글 수정</h2>

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
                    <button class="btn btn-cancel" @click="goBack">
                        <i class="fas fa-times"></i> 취소
                    </button>
                    <button class="btn btn-submit" @click="submitEdit">
                        <i class="fas fa-check"></i> 수정하기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const title = ref('');
const content = ref('');
const errors = ref({
    title: '',
    content: ''
});

const fetchPost = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/posts/${route.params.id}`);
        title.value = response.data.title;
        content.value = response.data.content;
        
        if (response.data.category && !route.query.category) {
            router.replace({
                path: route.path,
                query: { category: response.data.category }
            });
        }
    } catch (error) {
        console.error('게시글 조회 실패:', error);
        router.push({
            path: '/posts',
            query: { category: route.query.category }
        });
    }
};

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

const submitEdit = async () => {
    if (!validateForm()) return;

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        const updateData = {
            title: title.value.trim(),
            content: content.value.trim()
        };

        const response = await axios.put(
            `http://localhost:3000/posts/${route.params.id}`,
            updateData,
            {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.data) {
            router.push({
                path: `/posts/${route.params.id}`,
                query: { category: route.query.category }
            });
        }
    } catch (error: any) {
        console.error('게시글 수정 실패:', error.response?.data || error);
        if (error.response?.status === 401) {
            alert('권한이 없습니다.');
            router.push('/login');
        } else {
            alert(error.response?.data?.message || '게시글 수정에 실패했습니다.');
        }
    }
};

const goBack = () => {
    // 취소 시에도 카테고리 정보 유지
    router.push({
        path: `/posts/${route.params.id}`,
        query: { category: route.query.category }
    });
};

onMounted(() => {
    fetchPost();
});
</script>

<style scoped>
.edit-post-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.edit-post-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.page-title {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
}

.form-container {
    max-width: 800px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 1.1rem;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background-color: #f8fafc;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #4A90E2;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 200px;
}

.error {
    border-color: #dc3545 !important;
}

.error-message {
    color: #dc3545;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: block;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.btn {
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-cancel {
    background-color: #6c757d;
    color: white;
}

.btn-submit {
    background-color: #4A90E2;
    color: white;
}

@media (max-width: 768px) {
    .edit-post-content {
        padding: 1.5rem;
    }

    .button-group {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style> 