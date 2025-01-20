<template>
    <div class="study-list-container">
        <div class="header">
            <h2>{{ route.params.mainRegion }} {{ route.params.subRegion !== '전체' ? '> ' + route.params.subRegion : '' }}</h2>
            <router-link to="/create-study" class="create-btn">스터디 만들기</router-link>
        </div>
        
        <div class="study-list">
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>스터디명</th>
                        <th>작성자</th>
                        <th>생성일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="study in studyGroups" :key="study.id" @click="goToDetail(study.id)">
                        <td>{{ study.id }}</td>
                        <td>{{ study.name }}</td>
                        <td>{{ study.creator.username }}</td>
                        <td>{{ formatDate(study.createdAt) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const studyGroups = ref([]);

const mainCategory = ref(route.query.mainCategory || '');
const subCategory = ref(route.query.subCategory || '');
const detailCategory = ref(route.query.detailCategory || '');

const loadStudyGroups = async () => {
    try {
        const mainRegion = route.params.mainRegion;
        const subRegion = route.params.subRegion;

        const response = await axios.get('http://localhost:3000/study-groups', {
            params: {
                mainRegion,
                subRegion: subRegion === '전체' ? undefined : subRegion,
                mainCategory: '지역별'  // 지역별 스터디 그룹만 필터링
            }
        });
        studyGroups.value = response.data;
    } catch (error) {
        console.error('스터디 그룹 로딩 실패:', error);
    }
};

// 라우트 파라미터가 변경될 때마다 스터디 그룹 목록을 다시 로드
watch(
    () => route.params,
    () => {
        loadStudyGroups();
    }
);

const goToDetail = (id: number) => {
    router.push(`/study-groups/${id}`);
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
};

onMounted(() => {
    loadStudyGroups();
});
</script>

<style scoped>
.study-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.create-btn {
    padding: 0.5rem 1rem;
    background-color: #4A90E2;
    color: white;
    border-radius: 4px;
    text-decoration: none;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
}

tbody tr:hover {
    background-color: #f5f5f5;
    cursor: pointer;
}
</style> 