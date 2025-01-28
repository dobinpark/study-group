<template>
    <div v-if="loading" class="loading">
        로딩 중...
    </div>
    <div v-else-if="post" class="post-detail-container">
        <div class="post-header">
            <div class="category-badge">{{ postType }}</div>
            <h2 class="post-title">{{ post.title }}</h2>
            <div class="post-meta">
                <div class="post-info">
                    <span class="author-name">
                        <i class="fas fa-user"></i> {{ post.author?.nickname }}
                    </span>
                    <span class="post-date">
                        <i class="fas fa-calendar"></i> {{ formatDate(post.createdAt) }}
                    </span>
                </div>
                <div class="post-stats">
                    <span class="views">
                        <i class="fas fa-eye"></i> {{ post.views }}
                    </span>
                    <button class="like-button" @click="toggleLike" :class="{ 'liked': isLiked }"
                        :disabled="!isLoggedIn" :title="!isLoggedIn ? '로그인이 필요합니다' : ''">
                        <i class="fas fa-heart"></i>
                        {{ post.likes }}
                    </button>
                </div>
            </div>
        </div>

        <div class="post-content" v-html="formattedContent"></div>

        <div class="action-buttons">
            <button @click="goBack" class="btn btn-back">
                <i class="fas fa-arrow-left"></i> 목록으로
            </button>
            <div v-if="isLoggedIn && isAuthor" class="author-actions">
                <button @click="editPost" class="btn btn-edit">
                    <i class="fas fa-edit"></i> 수정
                </button>
                <button @click="deletePost" class="btn btn-delete">
                    <i class="fas fa-trash"></i> 삭제
                </button>
            </div>
        </div>
    </div>
    <div v-else class="error">
        게시글을 찾을 수 없습니다.
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

interface Post {
    id: number;
    title: string;
    content: string;
    author: {
        id: number;
        nickname: string;
    };
    createdAt: string;
    views: number;
    likes: number;
}

const route = useRoute();
const router = useRouter();
const post = ref<Post | null>(null);
const loading = ref(true);
const isAuthor = ref(false);
const isLoggedIn = computed(() => {
    return !!localStorage.getItem('accessToken');
});
const isLiked = ref(false);

const postType = computed(() => {
    const category = (route.query.category as string || 'FREE').toUpperCase();

    switch (category) {
        case 'FREE':
            return '자유';
        case 'QUESTION':
            return '질문';
        case 'SUGGESTION':
            return '건의';
        default:
            return '게시글';
    }
});

const formattedContent = computed(() => {
    return post.value?.content?.replace(/\n/g, '<br>') || '';
});

const fetchPost = async () => {
    try {
        loading.value = true;
        const response = await axios.get(`http://localhost:3000/posts/${route.params.id}`);
        post.value = response.data;

        if (response.data.category && !route.query.category) {
            router.replace({
                path: route.path,
                query: { category: response.data.category }
            });
        }

        const userId = localStorage.getItem('userId');
        isAuthor.value = userId === String(post.value?.author?.id);
    } catch (error) {
        console.error('게시글 조회 실패:', error);
        router.push({
            path: '/posts',
            query: { category: route.query.category }
        });
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
};

const goBack = () => {
    router.push({
        path: '/posts',
        query: { category: route.query.category }
    });
};

const editPost = () => {
    router.push(`/posts/${route.params.id}/edit`);
};

const deletePost = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        await axios.delete(`http://localhost:3000/posts/${route.params.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        window.alert('게시글이 삭제되었습니다.');
        router.push(`/posts?category=${route.query.category}`);
    } catch (error: any) {
        window.alert(error.response?.data?.message || '게시글 삭제에 실패했습니다.');
    }
};

const toggleLike = async () => {
    if (!isLoggedIn.value) {
        alert('로그인이 필요한 서비스입니다.');
        return;
    }

    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
            `http://localhost:3000/posts/${route.params.id}/toggle-like`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );

        isLiked.value = response.data.liked;
        post.value.likes += response.data.liked ? 1 : -1;
    } catch (error) {
        console.error('좋아요 처리 실패:', error);
    }
};

onMounted(() => {
    fetchPost();
});
</script>

<style scoped>
.post-detail-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-header {
    margin-bottom: 2rem;
}

.category-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background-color: #4A90E2;
    color: white;
    border-radius: 20px;
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.post-title {
    font-size: 2rem;
    color: #2c3e50;
    margin: 1rem 0;
    word-break: break-word;
}

.post-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
}

.post-info {
    display: flex;
    gap: 1.5rem;
    color: #666;
}

.author-name,
.post-date,
.views {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.post-stats {
    display: flex;
    gap: 1.5rem;
    align-items: center;
}

.like-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    border-radius: 20px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.like-button:not(:disabled):hover {
    transform: scale(1.05);
}

.like-button.liked {
    background: #e74c3c;
    color: white;
    border-color: #e74c3c;
}

.like-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.post-content {
    padding: 2rem 0;
    line-height: 1.8;
    font-size: 1.1rem;
    color: #2c3e50;
    min-height: 200px;
    white-space: pre-wrap;
    word-break: break-word;
}

.action-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
}

.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-back {
    background-color: #6c757d;
    color: white;
}

.btn-edit {
    background-color: #4A90E2;
    color: white;
    margin-right: 0.5rem;
}

.btn-delete {
    background-color: #dc3545;
    color: white;
}

.author-actions {
    display: flex;
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .post-meta {
        flex-direction: column;
        gap: 1rem;
    }

    .post-info {
        flex-direction: column;
        gap: 0.5rem;
    }

    .post-stats {
        width: 100%;
        justify-content: center;
    }

    .action-buttons {
        flex-direction: column;
        gap: 1rem;
    }

    .author-actions {
        width: 100%;
        justify-content: space-between;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
