<template>
  <div class="page-container">
    <div class="page-inner">
      <div class="content-card">
        <header class="page-header">
          <h1 class="title">스터디 그룹 수정</h1>
          <div class="category-path" v-if="studyGroup">
            <span>{{ studyGroup.mainCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup.subCategory }}</span>
            <span class="separator">></span>
            <span>{{ studyGroup.detailCategory }}</span>
          </div>
        </header>
        <div v-if="isSubmitting" class="loading-overlay">
          <div class="loading-spinner"></div>
          <p class="loading-text">스터디 그룹을 수정 중입니다...</p>
        </div>
        <main class="page-content" v-if="!isLoading">
          <form @submit.prevent="handleSubmit" class="study-form">
            <div class="form-group">
              <label for="name">스터디 그룹 이름</label>
              <input id="name" type="text" v-model="studyGroup.name" placeholder="이름을 입력하세요" required minlength="3"
                maxlength="50" @input="validateForm" class="form-input" />
              <div class="form-feedback" v-if="formErrors.name">
                {{ formErrors.name }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="mainCategory">대분류</label>
                <select id="mainCategory" v-model="studyGroup.mainCategory" required @change="onMainCategoryChange"
                  class="form-select">
                  <option value="" disabled selected>대분류 선택</option>
                  <option value="지역별">지역별</option>
                  <option value="학습자별">학습자별</option>
                  <option value="전공별">전공별</option>
                </select>
              </div>
              <div class="form-group">
                <label for="subCategory">중분류</label>
                <select id="subCategory" v-model="studyGroup.subCategory" required @change="onSubCategoryChange"
                  :disabled="!studyGroup.mainCategory" class="form-select">
                  <option value="" disabled selected>중분류 선택</option>
                  <option v-for="category in subCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="detailCategory">소분류</label>
                <select id="detailCategory" v-model="studyGroup.detailCategory" required
                  :disabled="!studyGroup.subCategory" class="form-select">
                  <option value="" disabled selected>소분류 선택</option>
                  <option v-for="item in detailCategories" :key="item" :value="item">
                    {{ item }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="maxMembers">최대 인원</label>
                <input id="maxMembers" type="number" v-model="studyGroup.maxMembers" min="2" required
                  class="form-input" />
              </div>
              <div class="form-group">
                <label for="studyWay">스터디 방식</label>
                <select id="studyWay" v-model="studyGroup.isOnline" class="form-select">
                  <option value=true>온라인</option>
                  <option value=false>오프라인</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="content">스터디 설명</label>
              <textarea id="content" v-model="studyGroup.content" placeholder="스터디 그룹에 대한 설명을 입력하세요" rows="6" required
                minlength="20" class="form-textarea"></textarea>
              <div class="form-help">
                <span :class="{ 'text-danger': descriptionLength < 20 }">
                  {{ descriptionLength }}/20자 이상 작성해주세요 (최소 20자)
                </span>
              </div>
            </div>

            <div class="action-buttons">
              <button type="submit" class="edit-button" :disabled="isSubmitting || descriptionLength < 20">
                {{ isSubmitting ? '수정 중...' : '수정하기' }}
              </button>
              <button type="button" @click="goBack" class="list-button">취소</button>
            </div>
          </form>
        </main>
        <main v-else class="page-content">
          <div class="loading-spinner"></div>
          <p class="loading-text">스터디 그룹 정보를 불러오는 중...</p>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../../utils/axios';

const router = useRouter();
const route = useRoute();

// 스터디 그룹 정보를 위한 인터페이스
interface StudyGroup {
  name: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  content: string;
  maxMembers: number;
  isOnline: boolean;
}

// 스터디 그룹 정보 초기화
const studyGroup = ref<StudyGroup>({
  name: '',
  mainCategory: '',
  subCategory: '',
  detailCategory: '',
  content: '',
  maxMembers: 2,
  isOnline: true,
});

// 카테고리 데이터를 위한 인터페이스
interface CategoryData {
  [key: string]: {
    [key: string]: string[];
  };
}

// 카테고리 데이터 정의
const categoryData: CategoryData = {
  '지역별': {
    '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구',
      '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구',
      '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구',
      '은평구', '종로구', '중구', '중랑구'],
    '인천': ['강화군', '계양구', '남동구', '동구', '미추홀구', '부평구', '서구',
      '연수구', '옹진군'],
    '부산': ['강서구', '금정구', '기장군', '남구', '동구', '동래구', '부산진구',
      '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구',
      '해운대구'],
    '대구': ['군위군', '남구', '달서구', '달성군', '동구', '북구', '서구',
      '수성구', '중구'],
    '광주': ['광산구', '남구', '동구', '북구', '서구'],
    '대전': ['대덕구', '동구', '서구', '유성구', '중구'],
    '울산': ['남구', '동구', '북구', '울주군', '중구'],
    '경기': ['가평군', '고양시 덕양구', '고양시 일산동구', '고양시 일산서구',
      '과천시', '광명시', '광주시', '구리시', '군포시', '김포시', '남양주시',
      '동두천시', '부천시', '성남시 분당구', '성남시 수정구', '성남시 중원구',
      '수원시 권선구', '수원시 장안구', '수원시 팔달구', '수원시 영통구',
      '시흥시', '안산시 단원구', '안산시 상록구', '안성시', '안양시 동안구',
      '안양시 만안구', '양주시', '양평군', '여주시', '연천군', '오산시',
      '용인시 기흥구', '용인시 수지구', '용인시 처인구', '의왕시', '의정부시',
      '이천시', '파주시', '평택시', '포천시', '하남시', '화성시'],
    '세종': ['전체'],
    '충남': ['공주시', '금산군', '논산시', '당진시', '보령시', '부여군', '서산시',
      '서천군', '아산시', '예산군', '천안시 동남구', '천안시 서북구', '청양군',
      '태안군', '홍성군', '계룡시'],
    '충북': ['괴산군', '단양군', '보은군', '영동군', '옥천군', '음성군', '제천시',
      '진천군', '청주시 청원구', '청주시 상당구', '청주시 서원구', '청주시 흥덕구',
      '충주시', '증평군'],
    '경남': ['거제시', '거창군', '고성군', '김해시', '남해군', '밀양시', '사천시',
      '산청군', '양산시', '의령군', '진주시', '창녕군', '창원시 마산합포구',
      '창원시 마산회원구', '창원시 성산구', '창원시 의창구', '창원시 진해구',
      '통영시', '하동군', '함안군', '함양군', '합천군'],
    '경북': ['경산시', '경주시', '고령군', '구미시', '김천시', '문경시', '봉화군',
      '상주시', '성주군', '안동시', '영덕군', '영양군', '영주시', '영천시', '예천군',
      '울릉군', '울진군', '의성군', '청도군', '청송군', '칠곡군', '포항시 남구',
      '포항시 북구'],
    '전남': ['강진군', '고흥군', '곡성군', '광양시', '구례군', '나주시', '담양군',
      '목포시', '무안군', '보성군', '순천시', '신안군', '여수시', '영광군', '영암군',
      '완도군', '장성군', '장흥군', '진도군', '함평군', '해남군', '화순군'],
    '전북': ['고창군', '군산시', '김제시', '남원시', '무주군', '부안군', '순창군',
      '완주군', '익산시', '임실군', '장수군', '전주시 덕진구', '전주시 완산구',
      '정읍시', '진안군'],
    '강원': ['강릉시', '고성군', '동해시', '삼척시', '속초시', '양구군', '양양군',
      '영월군', '원주시', '인제군', '정선군', '철원군', '춘천시', '태백시', '평창군',
      '홍천군', '화천군', '횡성군'],
    '제주': ['서귀포시', '제주시']
  },
  '학습자별': {
    '중등': ['1학년', '2학년', '3학년'],
    '고등': ['1학년', '2학년', '3학년'],
    '대학/청년': ['대학생', '청년'],
    '취업준비/수험': ['취업준비생', '수험생'],
    '경력/이직': ['경력', '이직'],
    '취미/자기계발': ['취미', '자기계발']
  },
  '전공별': {
    '인문계열': ['철학', '역사학', '문학', '언어학', '종교학', '고고학', '예술학', '문화학'],
    '사회과학계열': ['경제학', '사회학', '심리학', '교육학', '인류학', '행정학', '법학', '언론/미디어학'],
    '자연과학계열': ['수학', '물리학', '화학', '생물학', '지구과학', '통계학'],
    '공학계열': ['기계공학', '전기전자공학', '컴퓨터공학', '화학공학', '토목공학', '건축학', '로봇공학'],
    '의학/보건학계열': ['의학', '치의학', '약학', '간호학', '수의학', '보건학'],
    '예체능계열': ['음악', '미술', '연극/영화', '무용', '체육학']
  }
};

const isLoading = ref(false);
const errorMessage = ref('');
const isSubmitting = ref(false);
const formErrors = ref({ name: '', description: '' });

// 선택된 대분류에 따른 중분류 목록 계산
const subCategories = computed(() => {
  if (!studyGroup.value.mainCategory) return [];
  return Object.keys(categoryData[studyGroup.value.mainCategory as keyof typeof categoryData] || {});
});

// 선택된 중분류에 따른 소분류 목록 계산
const detailCategories = computed(() => {
  if (!studyGroup.value.mainCategory || !studyGroup.value.subCategory) return [];
  return categoryData[studyGroup.value.mainCategory as keyof typeof categoryData]?.[studyGroup.value.subCategory] || [];
});

// 스터디 그룹 상세 정보 로드
const loadStudyGroup = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.get(`/study-groups/${route.params.id}`);

    console.log('API 응답 데이터 (response.data):', response.data);
    console.log('response.data.data:', response.data.data);

    const { name, mainCategory, subCategory, detailCategory, content, maxMembers, isOnline } = response.data.data;
    studyGroup.value = { name, mainCategory, subCategory, detailCategory, content, maxMembers, isOnline };

    console.log('스터디 그룹 데이터 (studyGroup.value):', studyGroup.value);

  } catch (error: any) {
    console.error('스터디 그룹 정보 로딩 실패:', error);
    errorMessage.value = '스터디 그룹 정보를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// 스터디 그룹 수정 처리
const handleSubmit = async () => {
  isSubmitting.value = true;
  errorMessage.value = '';
  try {
    if (!studyGroup.value.mainCategory || !studyGroup.value.subCategory || !studyGroup.value.detailCategory) {
      alert('모든 카테고리를 선택해주세요.');
      isSubmitting.value = false;
      return;
    }

    if (studyGroup.value.content.length < 20) {
      alert('스터디 설명은 최소 20자 이상 작성해주세요.');
      isSubmitting.value = false;
      return;
    }

    const updateData = {
      name: studyGroup.value.name,
      mainCategory: studyGroup.value.mainCategory,
      subCategory: studyGroup.value.subCategory,
      detailCategory: studyGroup.value.detailCategory,
      content: studyGroup.value.content,
      maxMembers: Number(studyGroup.value.maxMembers),
      isOnline: studyGroup.value.isOnline
    };

    await axios.put(`/study-groups/${route.params.id}`, updateData);

    alert('스터디 그룹이 수정되었습니다.');
    await router.push(`/study-groups/${route.params.id}`);
  } catch (error: any) {
    console.error('스터디 그룹 수정 실패:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage.value = '로그인이 필요합니다. 다시 로그인해주세요.';
    } else {
      errorMessage.value = error.response?.data?.message || '스터디 그룹 수정에 실패했습니다.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 이전 페이지로 돌아가기
const goBack = () => {
  router.back();
};

// 설명 글자 수 계산
const descriptionLength = computed(() => {
  return studyGroup.value.content?.length || 0;
});

// 폼 유효성 검증 함수
const validateForm = () => {
  // 이름 검증
  if (studyGroup.value.name.length > 0 && studyGroup.value.name.length < 3) {
    formErrors.value.name = '스터디 이름은 최소 3자 이상이어야 합니다.';
  } else if (studyGroup.value.name.length > 50) {
    formErrors.value.name = '스터디 이름은 최대 50자까지 가능합니다.';
  } else {
    formErrors.value.name = '';
  }

  // 설명 검증
  if (studyGroup.value.content.length > 0 && studyGroup.value.content.length < 20) {
    formErrors.value.description = '설명은 최소 20자 이상이어야 합니다.';
  } else if (studyGroup.value.content.length > 1000) {
    formErrors.value.description = '설명은 최대 1000자까지 가능합니다.';
  } else {
    formErrors.value.description = '';
  }
};

// 대분류 변경 시 중분류 초기화
const onMainCategoryChange = () => {
  studyGroup.value.subCategory = '';
  studyGroup.value.detailCategory = '';
};

// 중분류 변경 시 소분류 초기화
const onSubCategoryChange = () => {
  studyGroup.value.detailCategory = '';
};

// 컴포넌트가 마운트될 때 스터디 그룹 정보 로드
onMounted(() => {
  loadStudyGroup();
});
</script>

<style scoped>
@import '../../assets/styles/common.css';

.page-container {
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.page-inner {
  width: 100%;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-header {
  color: white;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
}

.page-header h1.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
}

.category-path {
  font-size: 1.1rem;
  opacity: 0.9;
}

.separator {
  margin: 0 0.5rem;
  opacity: 0.7;
}

.page-content {
  padding: 2rem;
}

.study-form {
  max-width: 1000px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  color: #2d3748;
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-help {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
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

.edit-button {
  background: #48BB78;
  color: white;
  border: none;
}

.edit-button:hover {
  background: #38A169;
}

.edit-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.list-button {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
}

.list-button:hover {
  background: #cbd5e0;
}

.text-danger {
  color: var(--danger-color);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.2rem;
  color: var(--primary-color);
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
  .title {
    font-size: 2rem;
  }

  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>
