<template>
    <div class="create-study-container">
        <h1 class="title">스터디 그룹 생성</h1>
        <form @submit.prevent="handleSubmit" class="study-form">
            <div class="form-group">
                <label for="name">스터디 그룹 이름</label>
                <input type="text" id="name" v-model="studyGroup.name" required placeholder="스터디 그룹 이름을 입력하세요" />
            </div>

            <div class="categories">
                <div class="form-group">
                    <label for="mainCategory">대분류</label>
                    <select id="mainCategory" v-model="studyGroup.mainCategory" required
                        @change="handleMainCategoryChange">
                        <option value="">선택하세요</option>
                        <option v-for="category in mainCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="subCategory">중분류</label>
                    <select id="subCategory" v-model="studyGroup.subCategory" required @change="handleSubCategoryChange"
                        :disabled="!studyGroup.mainCategory">
                        <option value="">선택하세요</option>
                        <option v-for="category in subCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="detailCategory">소분류</label>
                    <select id="detailCategory" v-model="studyGroup.detailCategory" required
                        :disabled="!studyGroup.subCategory">
                        <option value="">선택하세요</option>
                        <option v-for="category in detailCategories" :key="category" :value="category">
                            {{ category }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label for="content">스터디 그룹 내용</label>
                <textarea id="content" v-model="studyGroup.content" required placeholder="스터디 그룹에 대한 설명을 입력하세요"
                    rows="10"></textarea>
            </div>

            <div class="button-group">
                <button type="button" @click="handleCancel" class="cancel-button">취소</button>
                <button type="submit" class="submit-button">생성하기</button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const studyGroup = ref({
    name: '',
    mainCategory: '',
    subCategory: '',
    detailCategory: '',
    content: ''
});

// 카테고리 데이터
const categories = {
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
        '취업준비/수험': ['취업 준비생', '수험생'],
        '경력/이직': ['경력', '이직'],
        '취미/자기계발': ['취미', '자기계발']
    },
    '전공별': {
        '어문학': ['국어국문학', '영어영문학', '독일어문학', '프랑스어문학', '중국어문학',
            '일본어문학', '러시아어문학', '기타언어학'],
        '인문학': ['철학', '역사학', '심리학', '사회학', '인류학', '문헌정보학',
            '문화인류학'],
        '사회과학': ['정치외교학', '경제학', '사회복지학', '행정학', '국제관계학',
            '도시공학', '지역개발학'],
        '자연과학': ['물리학', '화학', '생물학', '지구과학', '수학', '통계학', '환경과학'],
        '공학': ['기계공학', '전기전자공학', '컴퓨터공학', '화학공학', '토목공학',
            '건축공학', '산업공학', '항공우주공학'],
        '법학': ['법학', '국제법학', '형사법학', '민사법학', '행정법학', '상법학'],
        '사범학': ['유아교육학', '초등교육학', '중등교육학', '특수교육학', '교육학',
            '교육행정학'],
        '상경': ['경영학', '회계학', '마케팅학', '금융학', '무역학', '경제학'],
        '생활과학': ['가정관리학', '식품영양학', '의류학', '주거환경학', '아동학'],
        '예/체능학': ['미술학', '음악학', '체육학', '무용학', '디자인학', '영화학'],
        '의/약학': ['의학', '간호학', '약학', '치의학', '한의학', '보건학'],
        '농/수산/해양학': ['농업경제학', '식물학', '동물학', '수산학', '해양학', '농업생명과학']
    }
};

const mainCategories = Object.keys(categories);

const subCategories = computed(() => {
    if (!studyGroup.value.mainCategory) return [];
    return Object.keys(categories[studyGroup.value.mainCategory]);
});

const detailCategories = computed(() => {
    if (!studyGroup.value.mainCategory || !studyGroup.value.subCategory) return [];
    return categories[studyGroup.value.mainCategory][studyGroup.value.subCategory];
});

const handleMainCategoryChange = () => {
    studyGroup.value.subCategory = '';
    studyGroup.value.detailCategory = '';
};

const handleSubCategoryChange = () => {
    studyGroup.value.detailCategory = '';
};

const handleSubmit = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        await axios.post('http://localhost:3000/study-groups', studyGroup.value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        alert('스터디 그룹이 생성되었습니다.');
        router.push('/');
    } catch (error) {
        alert('스터디 그룹 생성에 실패했습니다.');
        console.error('Error:', error);
    }
};

const handleCancel = () => {
    router.go(-1);
};
</script>

<style scoped>
.create-study-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title {
    font-size: 2rem;
    color: #2d3748;
    margin-bottom: 2rem;
    text-align: center;
}

.study-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.categories {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
}

input,
select,
textarea {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
    outline: none;
    border-color: #4A90E2;
}

textarea {
    resize: vertical;
    min-height: 150px;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.submit-button,
.cancel-button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
}

.submit-button {
    background-color: #4A90E2;
    color: white;
}

.submit-button:hover {
    background-color: #357abd;
}

.cancel-button {
    background-color: #e2e8f0;
    color: #4a5568;
}

.cancel-button:hover {
    background-color: #cbd5e0;
}

select:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
}
</style>
