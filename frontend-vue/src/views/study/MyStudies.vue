<template>
    <div class="my-studies-container">
        <div class="page-header">
            <h1>내 스터디</h1>
        </div>

        <div v-if="loading" class="loading">
            <div class="loading-spinner"></div>
            로딩 중...
        </div>

        <div v-else>
            <!-- 내가 생성한 스터디 -->
            <div class="study-section">
                <h2>내가 만든 스터디</h2>
                <div v-if="createdStudies.length" class="study-grid">
                    <div v-for="study in createdStudies" :key="study.id" class="study-card">
                        <div class="study-card-header">
                            <h3>{{ study.name }}</h3>
                            <div class="category-path">
                                {{ study.mainCategory }} > {{ study.subCategory }} > {{ study.detailCategory }}
                            </div>
                        </div>
                        <div class="study-card-content">
                            <div class="meta-info">
                                <span class="members">
                                    <i class="fas fa-users"></i>
                                    {{ study.members.length }}/{{ study.maxMembers }}명
                                </span>
                                <span class="date">
                                    <i class="fas fa-calendar"></i>
                                    {{ formatDate(study.createdAt) }}
                                </span>
                            </div>
                            <p class="description">{{ truncateText(study.content, 100) }}</p>
                        </div>
                        <div class="study-card-footer">
                            <button @click="goToStudyDetail(study.id)" class="view-button">
                                자세히 보기
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-message">
                    아직 생성한 스터디가 없습니다.
                </div>
            </div>

            <!-- 내가 참여한 스터디 -->
            <div class="study-section">
                <h2>참여중인 스터디</h2>
                <div v-if="joinedStudies.length" class="study-grid">
                    <div v-for="study in joinedStudies" :key="study.id" class="study-card">
                        <div class="study-card-header">
                            <h3>{{ study.name }}</h3>
                            <div class="category-path">
                                {{ study.mainCategory }} > {{ study.subCategory }} > {{ study.detailCategory }}
                            </div>
                        </div>
                        <div class="study-card-content">
                            <div class="meta-info">
                                <span class="creator">
                                    <i class="fas fa-user"></i>
                                    {{ study.creator.nickname }}
                                </span>
                                <span class="members">
                                    <i class="fas fa-users"></i>
                                    {{ study.members.length }}/{{ study.maxMembers }}명
                                </span>
                                <span class="date">
                                    <i class="fas fa-calendar"></i>
                                    {{ formatDate(study.createdAt) }}
                                </span>
                            </div>
                            <p class="description">{{ truncateText(study.content, 100) }}</p>
                        </div>
                        <div class="study-card-footer">
                            <button @click="goToStudyDetail(study.id)" class="view-button">
                                자세히 보기
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-message">
                    아직 참여중인 스터디가 없습니다.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios';

declare global {
    interface Window {
        localStorage: Storage;
    }
}

interface User {
    id: number;
    nickname: string;
}

interface StudyGroup {
    id: number;
    name: string;
    content: string;
    mainCategory: string;
    subCategory: string;
    detailCategory: string;
    creator: User;
    members: User[];
    maxMembers: number;
    createdAt: string;
}

const router = useRouter();
const createdStudies = ref<StudyGroup[]>([]);
const joinedStudies = ref<StudyGroup[]>([]);
const loading = ref(true);

const fetchMyStudies = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        loading.value = true;
        const response = await axios.get('/study-groups/my-studies', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log('내 스터디 조회 응답:', response.data);

        if (response.data) {
            createdStudies.value = response.data.created || [];
            joinedStudies.value = response.data.joined || [];
        }
    } catch (error) {
        console.error('내 스터디 조회 실패:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
        } else {
            alert('스터디 그룹 조회에 실패했습니다.');
        }
    } finally {
        loading.value = false;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

const goToStudyDetail = (studyId: number) => {
    if (!studyId) return;
    router.push(`/study-groups/${studyId}`);
};

onMounted(() => {
    fetchMyStudies();
});
</script>

<style scoped>
.my-studies-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.page-header {
    margin-bottom: 2rem;
    text-align: center;
}

.page-header h1 {
    font-size: 2.5rem;
    color: #2d3748;
    font-weight: 700;
}

.study-section {
    margin-bottom: 3rem;
}

.study-section h2 {
    font-size: 1.8rem;
    color: #2d3748;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
}

.study-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.study-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
}

.study-card:hover {
    transform: translateY(-4px);
}

.study-card-header {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;
    padding: 1.5rem;
}

.study-card-header h3 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
}

.category-path {
    font-size: 0.9rem;
    opacity: 0.9;
}

.study-card-content {
    padding: 1.5rem;
}

.meta-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    color: #4a5568;
    font-size: 0.9rem;
}

.meta-info span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.description {
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 1rem;
}

.study-card-footer {
    padding: 1rem 1.5rem;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
}

.view-button {
    width: 100%;
    padding: 0.75rem;
    background: #4A90E2;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
}

.view-button:hover {
    background: #357ABD;
}

.empty-message {
    text-align: center;
    padding: 3rem;
    color: #718096;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 1.1rem;
}

.loading {
    text-align: center;
    padding: 4rem;
    color: #4a5568;
    font-size: 1.1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4A90E2;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .study-grid {
        grid-template-columns: 1fr;
    }

    .page-header h1 {
        font-size: 2rem;
    }

    .study-section h2 {
        font-size: 1.5rem;
    }
}
</style>
