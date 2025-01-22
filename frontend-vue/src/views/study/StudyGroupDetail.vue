<template>
    <div class="study-detail-container">
        <div v-if="error" class="error-message">
            {{ error }}
        </div>
        <div v-else-if="studyGroup" class="study-detail">
            <div class="header-section">
                <h1 class="title">{{ studyGroup.name }}</h1>
                <div class="category-path">
                    <span>{{ studyGroup.mainCategory }}</span>
                    <span class="separator">></span>
                    <span>{{ studyGroup.subCategory }}</span>
                    <span class="separator">></span>
                    <span>{{ studyGroup.detailCategory }}</span>
                </div>
            </div>

            <div class="content-section">
                <div class="info-card">
                    <div class="info-header">
                        <h2>스터디 정보</h2>
                        <div class="meta-info">
                            <span class="creator">
                                <i class="fas fa-user"></i>
                                개설자: {{ studyGroup.creator?.nickname }}
                            </span>
                            <span class="date">
                                <i class="fas fa-calendar"></i>
                                개설일: {{ formatDate(studyGroup.createdAt) }}
                            </span>
                            <span class="members">
                                <i class="fas fa-users"></i>
                                참여인원: {{ studyGroup.members?.length || 0 }}/{{ studyGroup.maxMembers }}
                            </span>
                        </div>
                    </div>
                    <div class="description">
                        {{ studyGroup.content }}
                    </div>
                </div>

                <div class="members-card">
                    <h2>참여 멤버 ({{ studyGroup.members?.length || 0 }}명)</h2>
                    <div v-if="studyGroup.members?.length" class="members-list">
                        <div v-for="member in studyGroup.members" :key="member.id" class="member-item">
                            <div class="member-avatar">{{ member.nickname[0] }}</div>
                            <span class="member-name">
                                {{ member.nickname }}
                                <span v-if="member.id === studyGroup.creator?.id" class="creator-badge">방장</span>
                            </span>
                        </div>
                    </div>
                    <div v-else class="no-members">
                        아직 참여한 멤버가 없습니다.
                    </div>
                </div>

                <div class="action-buttons">
                    <button 
                        v-if="userStore.user && studyGroup"
                        @click="joinStudyGroup" 
                        class="join-button" 
                        :disabled="isLoading || isAlreadyMember || isCreator"
                    >
                        <i class="fas fa-sign-in-alt"></i>
                        <span v-if="isCreator">내가 만든 스터디입니다</span>
                        <span v-else-if="isAlreadyMember">이미 참여하였습니다</span>
                        <span v-else>스터디 참여하기</span>
                    </button>
                    <template v-if="isCreator">
                        <button @click="handleEdit" class="edit-button">
                            <i class="fas fa-edit"></i>
                            수정
                        </button>
                        <button @click="handleDelete" class="delete-button">
                            <i class="fas fa-trash"></i>
                            삭제
                        </button>
                    </template>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <div class="loading-spinner"></div>
            로딩 중...
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
    content: string;
    mainCategory: string;
    subCategory: string;
    detailCategory: string;
    creator: User;
    members: User[];
    maxMembers: number;
    createdAt: string;
}

import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const studyGroup = ref<StudyGroup | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isCreator = computed(() => {
    if (!studyGroup.value || !userStore.user) return false;
    return studyGroup.value.creator.id === userStore.user.id;
});

const isAlreadyMember = computed(() => {
    if (!studyGroup.value?.members || !userStore.user) return false;
    return studyGroup.value.members.some(m => m.id === userStore.user?.id);
});

const loadStudyGroup = async () => {
    error.value = null;
    isLoading.value = true;
    
    try {
        const response = await axios.get(`http://localhost:3000/study-groups/${route.params.id}`);
        console.log('스터디 그룹 데이터:', response.data);
        console.log('현재 로그인 상태:', userStore.user);
        
        if (!response.data) {
            throw new Error('데이터가 없습니다.');
        }
        
        studyGroup.value = {
            ...response.data,
            members: Array.isArray(response.data.members) ? response.data.members : [],
            creator: response.data.creator || { id: 0, nickname: '알 수 없음' }
        };

        console.log('스터디 그룹 생성자:', studyGroup.value.creator);
        console.log('현재 사용자:', userStore.user);
        console.log('isCreator 값:', isCreator.value);
        
    } catch (err: any) {
        console.error('스터디 그룹 로딩 실패:', err);
        error.value = '스터디 그룹 정보를 불러오는데 실패했습니다.';
        setTimeout(() => {
            router.push('/study-groups');
        }, 2000);
    } finally {
        isLoading.value = false;
    }
};

const joinStudyGroup = async () => {
    if (!userStore.user) {
        router.push('/login');
        return;
    }

    try {
        isLoading.value = true;
        await axios.post(`http://localhost:3000/study-groups/${route.params.id}/join`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        });
        await loadStudyGroup();
        alert('스터디 그룹에 참여하였습니다.');
    } catch (error: any) {
        alert(error.response?.data?.message || '참여에 실패했습니다.');
    } finally {
        isLoading.value = false;
    }
};

const handleEdit = () => {
    router.push(`/study-groups/${route.params.id}/edit`);
};

const handleDelete = async () => {
    if (!confirm('정말로 삭제하시겠습니까?')) return;

    try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`http://localhost:3000/study-groups/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        alert('스터디 그룹이 삭제되었습니다.');
        router.push('/study-groups');
    } catch (error: any) {
        alert('스터디 그룹 삭제에 실패했습니다: ' + error.response?.data?.message || error.message);
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
};

onMounted(async () => {
    // 로그인 상태 체크
    const token = window.localStorage.getItem('accessToken');
    if (token && !userStore.user) {
        try {
            const response = await axios.get('http://localhost:3000/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            userStore.setUser(response.data);
        } catch (error) {
            console.error('사용자 정보 로딩 실패:', error);
        }
    }
    
    await loadStudyGroup();
});
</script>

<style scoped>
.study-detail-container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.study-detail {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.header-section {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
    color: white;
    padding: 2rem;
    text-align: center;
}

.title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.category-path {
    font-size: 1.1rem;
    opacity: 0.9;
}

.separator {
    margin: 0 0.5rem;
    opacity: 0.7;
}

.content-section {
    padding: 2rem;
}

.info-card {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.info-header {
    margin-bottom: 1.5rem;
}

.info-header h2 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
}

.meta-info {
    display: flex;
    gap: 1.5rem;
    color: #4a5568;
    font-size: 0.95rem;
}

.meta-info span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.description {
    color: #4a5568;
    line-height: 1.7;
    white-space: pre-wrap;
}

.members-card {
    background: #f8fafc;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.members-card h2 {
    font-size: 1.5rem;
    color: #2d3748;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.members-list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.member-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 50px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.member-avatar {
    width: 2.5rem;
    height: 2.5rem;
    background: #4A90E2;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
}

.member-name {
    font-weight: 500;
    color: #2d3748;
}

.creator-badge {
    background: #4A90E2;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-left: 0.5rem;
}

.action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

.action-buttons button {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.join-button {
    background: #4A90E2;
    color: white;
    border: none;
    padding: 1rem 2rem;
}

.join-button:hover {
    background: #357ABD;
    transform: translateY(-2px);
}

.join-button:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
}

.edit-button {
    background: #48BB78;
    color: white;
    border: none;
}

.edit-button:hover {
    background: #38A169;
}

.delete-button {
    background: #F56565;
    color: white;
    border: none;
}

.delete-button:hover {
    background: #E53E3E;
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
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
    .title {
        font-size: 2rem;
    }

    .meta-info {
        flex-direction: column;
        gap: 0.75rem;
    }

    .action-buttons {
        flex-direction: column;
    }

    .action-buttons button {
        width: 100%;
    }
}

.no-members {
    text-align: center;
    padding: 2rem;
    color: #718096;
    font-size: 0.95rem;
}
</style>
