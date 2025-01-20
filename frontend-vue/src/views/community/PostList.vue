<template>
    <div class="post-list-container">
        <h2 class="board-title">{{ categoryTitle }}</h2>

        <!-- 게시글 목록 -->
        <div class="post-list">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>좋아요</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="post in posts" :key="post.id" @click="viewPost(post.id)">
                        <td>{{ post.id }}</td>
                        <td class="title">{{ post.title }}</td>
                        <td>{{ post.author.nickname }}</td>
                        <td>{{ formatDate(post.createdAt) }}</td>
                        <td>{{ post.views }}</td>
                        <td>{{ post.likes }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 검색 및 글쓰기 영역 -->
        <div class="action-bar">
            <div class="search-box">
                <input type="text" v-model="searchQuery" placeholder="검색어를 입력하세요" @keyup.enter="search">
                <button @click="search" class="search-button">검색</button>
            </div>
            <button @click="createPost" class="write-button">글쓰기</button>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination">
            <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">&lt;</button>
            <span v-for="page in totalPages" :key="page">
                <button :class="{ active: page === currentPage }" @click="changePage(page)">{{ page }}</button>
            </span>
            <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">&gt;</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { PostCategory, PostCategoryKorean } from '../../types/post';

const route = useRoute();
const router = useRouter();

const posts = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const itemsPerPage = 10;

const categoryTitle = computed(() => {
    const category = route.params.category as keyof typeof PostCategoryKorean;
    return PostCategoryKorean[category] || '게시판';
});

const loadPosts = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/posts`, {
            params: {
                category: route.params.category,
                page: currentPage.value,
                limit: itemsPerPage,
                search: searchQuery.value
            }
        });
        posts.value = response.data.items;
        totalPages.value = Math.ceil(response.data.total / itemsPerPage);
    } catch (error) {
        console.error('게시글 로딩 실패:', error);
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const search = () => {
    currentPage.value = 1;
    loadPosts();
};

const createPost = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
        return;
    }
    router.push(`/community/${route.params.category}/create`);
};

const viewPost = (id: number) => {
    router.push(`/community/${route.params.category}/${id}`);
};

const changePage = (page: number) => {
    currentPage.value = page;
    loadPosts();
};

onMounted(() => {
    loadPosts();
});

// URL 파라미터가 변경될 때마다 게시글 새로 로딩
watch(() => route.params.category, () => {
    currentPage.value = 1;
    searchQuery.value = '';
    loadPosts();
});
</script>

<style scoped>
.post-list-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.board-title {
    font-size: 2rem;
    color: #2c3e50;
    margin-bottom: 2rem;
    text-align: center;
}

.post-list table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
}

.post-list th,
.post-list td {
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #eee;
}

.post-list th {
    background-color: #f8f9fa;
    font-weight: bold;
}

.post-list td.title {
    text-align: left;
    cursor: pointer;
}

.post-list tr:hover {
    background-color: #f8f9fa;
}

.action-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.search-box {
    display: flex;
    gap: 0.5rem;
}

.search-box input {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 300px;
}

.search-button,
.write-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.search-button {
    background-color: #6c757d;
    color: white;
}

.write-button {
    background-color: #4A90E2;
    color: white;
}

.search-button:hover {
    background-color: #5a6268;
}

.write-button:hover {
    background-color: #357ABD;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
}

.pagination button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background-color: white;
    cursor: pointer;
}

.pagination button.active {
    background-color: #4A90E2;
    color: white;
    border-color: #4A90E2;
}

.pagination button:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
}
</style>
