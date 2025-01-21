<template>
    <div class="study-detail-container">
        <h1>{{ studyGroup.name }}</h1>
        
        <div class="member-info">
            <h2>멤버 정보</h2>
            <p>참여 인원: {{ studyGroup.members.length }}/{{ studyGroup.maxMembers }}</p>
            <ul class="member-list">
                <li v-for="member in studyGroup.members" :key="member.id">
                    {{ member.username }}
                    <span v-if="member.id === studyGroup.creator.id">(방장)</span>
                </li>
            </ul>
        </div>

        <div class="study-info">
            <p>{{ studyGroup.description }}</p>
            <p>생성일: {{ formatDate(studyGroup.createdAt) }}</p>
        </div>

        <button 
            v-if="canJoin" 
            @click="joinStudyGroup" 
            class="join-button"
            :disabled="isLoading"
        >
            스터디 그룹 참여하기
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const studyGroup = ref<any>({});
const isLoading = ref(false);

const canJoin = computed(() => {
    const user = userStore.user;
    if (!studyGroup.value || !user) return false;
    return (
        studyGroup.value.creator.id !== user.id &&
        !studyGroup.value.members.some((m: any) => m.id === user.id) &&
        studyGroup.value.members.length < studyGroup.value.maxMembers
    );
});

const loadStudyGroup = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/study-groups/${route.params.id}`);
        studyGroup.value = response.data;
    } catch (error) {
        console.error('스터디 그룹 로딩 실패:', error);
    }
};

const joinStudyGroup = async () => {
    if (!userStore.user) {
        router.push('/login');
        return;
    }

    try {
        isLoading.value = true;
        await axios.post(`http://localhost:3000/study-groups/${route.params.id}/join`);
        await loadStudyGroup();
    } catch (error: any) {
        alert(error.response?.data?.message || '참여에 실패했습니다.');
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

onMounted(() => {
    loadStudyGroup();
});
</script>

<style scoped>
.study-detail-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.member-info {
    margin: 2rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.member-list {
    list-style: none;
    padding: 0;
}

.member-list li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #eee;
}

.join-button {
    padding: 1rem 2rem;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1rem;
}

.join-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
</style> 