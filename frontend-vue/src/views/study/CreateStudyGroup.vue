<template>
  <div class="create-study-container">
    <div class="create-study-inner">
      <div class="study-card">
        <header class="study-header">
          <h1>스터디 그룹 생성</h1>
        </header>
        <main class="study-content">
          <form @submit.prevent="handleSubmit" class="study-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">스터디 그룹 이름</label>
                <input type="text" id="name" v-model="studyGroup.name" required />
              </div>
            </div>

            <div class="form-row category-row">
              <div class="form-group">
                <label>대분류</label>
                <select v-model="studyGroup.mainCategory" required>
                  <option value="">대분류 선택</option>
                  <option value="지역별">지역별</option>
                  <option value="학습자별">학습자별</option>
                  <option value="전공별">전공별</option>
                </select>
              </div>

              <div class="form-group">
                <label>중분류</label>
                <select v-model="studyGroup.subCategory" required>
                  <option value="">중분류 선택</option>
                  <option v-for="category in subCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>소분류</label>
                <select v-model="studyGroup.detailCategory" required>
                  <option value="">소분류 선택</option>
                  <option v-for="category in detailCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="content">스터디 그룹 설명</label>
                <textarea id="content" v-model="studyGroup.content" required rows="6"></textarea>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="maxMembers">모집 인원</label>
                <input type="number" id="maxMembers" v-model="studyGroup.maxMembers" required min="2" max="100" />
                <small class="form-help">2명에서 100명까지 설정 가능합니다.</small>
              </div>
            </div>

            <div class="button-group">
              <button type="button" @click="goBack" class="btn-cancel">취소</button>
              <button type="submit" class="btn-save">생성하기</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../../utils/axios';
import { emitter } from '../../components/Header.vue';

const router = useRouter();

// 스터디 그룹 정보를 위한 인터페이스
interface StudyGroup {
  name: string;
  mainCategory: string;
  subCategory: string;
  detailCategory: string;
  content: string;
  maxMembers: number;
}

// 스터디 그룹 정보 초기화
const studyGroup = ref<StudyGroup>({
  name: '',
  mainCategory: '',
  subCategory: '',
  detailCategory: '',
  content: '',
  maxMembers: 2
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
    '경남': ['거제시', '거창군', '고성군', '김해시', '남구', '밀양시', '사천시',
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
    '예체능계역': ['음악', '미술', '연극/영화', '무용', '체육학']
  }
};

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

// 스터디 그룹 생성 처리
const handleSubmit = async () => {
  try {
    const response = await axios.post('/study-groups-create', studyGroup.value, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    if (response.status === 201) {
      emitter?.emit('studyGroupCreated');
      alert('스터디 그룹이 생성되었습니다.');
      await router.push('/study-groups');
    }
  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      alert('로그인이 필요합니다. 다시 로그인해주세요.');
      await router.push('/login');
    } else {
      alert(error.response?.data?.message || '스터디 그룹 생성에 실패했습니다.');
    }
  }
};

// 이전 페이지로 돌아가기
const goBack = () => {
  router.back();
};

// 스터디 그룹 생성/삭제 이벤트 감지
if (emitter) {
  emitter.on('studyGroupCreated', () => {
    fetchStudyGroupCounts();
  });
}

// 그룹 카운트 가져오는 로직
const fetchStudyGroupCounts = () => {
  // 그룹 카운트 가져오는 로직 (현재는 비어 있음)
};
</script>

<style scoped>
.create-study-container {
  min-height: calc(100vh - 200px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
}

.create-study-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.study-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.study-card:hover {
  transform: translateY(-5px);
}

.study-header {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  padding: 2rem;
  text-align: center;
}

.study-header h1 {
  color: white;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.study-content {
  padding: 2rem;
}

.study-form {
  max-width: 1000px;
  margin: 0 auto;
}

.form-row {
  margin-bottom: 1.5rem;
}

.category-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-group textarea {
  resize: vertical;
  min-height: 150px;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4A90E2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.form-help {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #718096;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-save {
  padding: 0.75rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background-color: #e2e8f0;
  color: #4a5568;
  border: none;
}

.btn-save {
  background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 6px rgba(74, 144, 226, 0.2);
}

.btn-cancel:hover {
  background-color: #cbd5e0;
  transform: translateY(-1px);
}

.btn-save:hover {
  background: linear-gradient(135deg, #357ABD 0%, #2868A6 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 8px rgba(74, 144, 226, 0.3);
}

@media (max-width: 768px) {
  .create-study-inner {
    padding: 0 1rem;
  }

  .category-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .study-header {
    padding: 1.5rem;
  }

  .study-header h1 {
    font-size: 1.5rem;
  }

  .study-content {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
