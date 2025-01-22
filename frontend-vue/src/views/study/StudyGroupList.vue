<template>
    <div class="study-list-container">
        <h1 class="title">스터디 그룹 목록</h1>
        <div class="category-path" v-if="route.query.mainCategory">
            <span class="path-item">{{ route.query.mainCategory }}</span>
            <span class="path-separator" v-if="route.query.subCategory">></span>
            <span class="path-item" v-if="route.query.subCategory">{{ route.query.subCategory }}</span>
            <span class="path-separator" v-if="route.query.detailCategory">></span>
            <span class="path-item" v-if="route.query.detailCategory">{{ route.query.detailCategory }}</span>
        </div>
        <div v-if="loading" class="loading">
            로딩 중...
        </div>
        <div v-else-if="studyGroups && studyGroups.length > 0" class="study-groups">
            <div v-for="studyGroup in studyGroups" :key="studyGroup.id" class="study-group-card"
                @click="goToDetail(studyGroup.id)">
                <h2 class="study-group-title">{{ studyGroup.name }}</h2>
                <div class="study-group-meta">
                    <span class="category">{{ studyGroup.mainCategory }} > {{ studyGroup.subCategory }} > {{
                        studyGroup.detailCategory }}</span>
                    <span class="creator">작성자: {{ studyGroup.creator?.nickname }}</span>
                    <span class="members">참여 인원: {{ studyGroup.members?.length || 0 }}/{{ studyGroup.maxMembers
                        }}</span>
                    <span class="date">{{ formatDate(studyGroup.createdAt) }}</span>
                </div>
                <p class="study-group-content">{{ truncateContent(studyGroup?.description) }}</p>
            </div>
        </div>
        <div v-else class="no-results">
            검색 결과가 없습니다.
        </div>

        <!-- 검색 및 스터디 생성 버튼 -->
        <div class="action-bar">
            <div class="search-box">
                <input type="text" v-model="searchQuery" placeholder="스터디 그룹 검색" @keyup.enter="search">
                <button @click="search" class="search-button">검색</button>
            </div>
            <button @click="createStudyGroup" class="create-button">스터디 만들기</button>
        </div>
    </div>
</template>

<script setup lang="ts">
interface User {
    id: number;
    nickname: string;
}

interface StudyGroup {
    id: number;
    name: string;
    mainCategory: string;
    subCategory: string;
    detailCategory: string;
    description: string;
    creator: User;
    members: User[];
    maxMembers: number;
    createdAt: string;
}

import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const studyGroups = ref<StudyGroup[]>([]);
const searchQuery = ref('');
const loading = ref(true);

const fetchStudyGroups = async () => {
    loading.value = true;
    try {
        const response = await axios.get('http://localhost:3000/study-groups', {
            params: route.query
        });
        studyGroups.value = response.data || [];
    } catch (error) {
        console.error('스터디 그룹 조회 실패:', error);
        studyGroups.value = [];
    } finally {
        loading.value = false;
    }
};

const goToDetail = (id: number) => {
    router.push(`/study-groups/${id}`);
};

const createStudyGroup = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        router.push('/login');
        return;
    }
    router.push('/create-study');
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const truncateContent = (content: string | undefined) => {
    if (!content) return '';
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
};

const search = () => {
    fetchStudyGroups();
};

onMounted(() => {
    fetchStudyGroups();
});

// URL 쿼리 파라미터가 변경될 때마다 목록 새로 로딩
watch(() => route.query, () => {
    fetchStudyGroups();
}, { deep: true });
</script>

<style scoped>
.study-list-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.title {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 2rem;
    text-align: center;
}

.study-groups {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.study-group-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.study-group-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.study-group-title {
    font-size: 1.25rem;
    color: #2d3748;
    margin-bottom: 1rem;
}

.study-group-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #4a5568;
}

.category {
    color: #4A90E2;
}

.study-group-content {
    color: #4a5568;
    font-size: 0.875rem;
    line-height: 1.5;
}

.action-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    margin: 2rem 0;
    padding: 0 1rem;
}

.search-box {
    display: flex;
    gap: 0.5rem;
    max-width: 400px;
}

.search-box input {
    height: 40px;
    padding: 0 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    width: 300px;
    transition: border-color 0.2s;
}

.search-box input:focus {
    outline: none;
    border-color: #4A90E2;
}

.search-button {
    height: 40px;
    padding: 0 1.2rem;
    background-color: #4A90E2;
    color: white;
    font-weight: 500;
    border-radius: 6px;
    font-size: 0.95rem;
}

.search-button:hover {
    background-color: #357ABD;
}

.create-button {
    height: 40px;
    padding: 0 1.5rem;
    background-color: #4A90E2;
    color: white;
    font-weight: 600;
    border-radius: 6px;
    font-size: 0.95rem;
    box-shadow: 0 2px 4px rgba(74, 144, 226, 0.2);
    transition: all 0.2s ease;
}

.create-button:hover {
    background-color: #357ABD;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(74, 144, 226, 0.3);
}

.loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #4a5568;
}

.no-results {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #4a5568;
}

.category-path {
    text-align: center;
    margin-bottom: 2rem;
    padding: 1rem;
    background-color: #f7fafc;
    border-radius: 8px;
    color: #4a5568;
}

.path-item {
    font-weight: 600;
    color: #4A90E2;
}

.path-separator {
    margin: 0 0.5rem;
    color: #718096;
}
</style>
