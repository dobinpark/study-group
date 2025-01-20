<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<div class="top-container">
			<div class="top-content">
				<div class="logo-container">
					<img src="@/assets/images/book.png" alt="로고" class="logo" />
					<router-link to="/home">
						<span class="title">함공</span>
					</router-link>
				</div>
				<div class="right-section">
					<span v-if="isLoggedIn" class="welcome-text">{{ userNickname }}님, 환영합니다</span>
					<div class="auth-container">
						<template v-if="isLoggedIn">
							<router-link to="/profile">
								<img src="@/assets/images/man.png" alt="프로필" class="profile-icon" />
							</router-link>
							<button @click="logout" class="logout-button">로그아웃</button>
						</template>
						<template v-else>
							<span class="login-text" v-if="!isMobile">로그인하세요.</span>
							<router-link to="/login">
								<img src="@/assets/images/man.png" alt="로그인" class="login-icon" />
							</router-link>
						</template>
					</div>
				</div>
			</div>
		</div>
		<div class="nav-wrapper">
			<div class="nav-container">
				<nav class="nav-items">
					<ul class="main-menu">
						<li class="menu-item">
							지역별
							<ul class="sub-menu">
								<li class="sub-menu-item region" @click="goToStudyList('서울', '전체')">
									<div class="region-name">
										서울
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['서울']?.['전체'] || 0
													}})</span></li>
											<li>강남구 <span class="study-count">({{ regionCounts['서울']?.['강남구'] || 0
													}})</span>
											</li>
											<li>강동구 <span class="study-count">({{ regionCounts['서울']?.['강동구'] || 0
													}})</span>
											</li>
											<li>강북구 <span class="study-count">({{ regionCounts['서울']?.['강북구'] || 0
													}})</span>
											</li>
											<li>강서구 <span class="study-count">({{ regionCounts['서울']?.['강서구'] || 0
													}})</span>
											</li>
											<li>관악구 <span class="study-count">({{ regionCounts['서울']?.['관악구'] || 0
													}})</span>
											</li>
											<li>광진구 <span class="study-count">({{ regionCounts['서울']?.['광진구'] || 0
													}})</span>
											</li>
											<li>구로구 <span class="study-count">({{ regionCounts['서울']?.['구로구'] || 0
													}})</span>
											</li>
											<li>금천구 <span class="study-count">({{ regionCounts['서울']?.['금천구'] || 0
													}})</span>
											</li>
											<li>노원구 <span class="study-count">({{ regionCounts['서울']?.['노원구'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>도봉구 <span class="study-count">({{ regionCounts['서울']?.['도봉구'] || 0
													}})</span>
											</li>
											<li>동대문구 <span class="study-count">({{ regionCounts['서울']?.['동대문구'] || 0
													}})</span>
											</li>
											<li>동작구 <span class="study-count">({{ regionCounts['서울']?.['동작구'] || 0
													}})</span>
											</li>
											<li>마포구 <span class="study-count">({{ regionCounts['서울']?.['마포구'] || 0
													}})</span>
											</li>
											<li>서대문구 <span class="study-count">({{ regionCounts['서울']?.['서대문구'] || 0
													}})</span>
											</li>
											<li>서초구 <span class="study-count">({{ regionCounts['서울']?.['서초구'] || 0
													}})</span>
											</li>
											<li>성동구 <span class="study-count">({{ regionCounts['서울']?.['성동구'] || 0
													}})</span>
											</li>
											<li>성북구 <span class="study-count">({{ regionCounts['서울']?.['성북구'] || 0
													}})</span>
											</li>
											<li>송파구 <span class="study-count">({{ regionCounts['서울']?.['송파구'] || 0
													}})</span>
											</li>
											<li>양천구 <span class="study-count">({{ regionCounts['서울']?.['양천구'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>영등포구 <span class="study-count">({{ regionCounts['서울']?.['영등포구'] || 0
													}})</span>
											</li>
											<li>용산구 <span class="study-count">({{ regionCounts['서울']?.['용산구'] || 0
													}})</span>
											</li>
											<li>은평구 <span class="study-count">({{ regionCounts['서울']?.['은평구'] || 0
													}})</span>
											</li>
											<li>종로구 <span class="study-count">({{ regionCounts['서울']?.['종로구'] || 0
													}})</span>
											</li>
											<li>중구 <span class="study-count">({{ regionCounts['서울']?.['중구'] || 0
													}})</span></li>
											<li>중랑구 <span class="study-count">({{ regionCounts['서울']?.['중랑구'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('인천', '전체')">
									<div class="region-name">
										인천
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['인천']?.['전체'] || 0
													}})</span></li>
											<li>강화군 <span class="study-count">({{ regionCounts['인천']?.['강화군'] || 0
													}})</span>
											</li>
											<li>계양구 <span class="study-count">({{ regionCounts['인천']?.['계양구'] || 0
													}})</span>
											</li>
											<li>남동구 <span class="study-count">({{ regionCounts['인천']?.['남동구'] || 0
													}})</span>
											</li>
											<li>동구 <span class="study-count">({{ regionCounts['인천']?.['동구'] || 0
													}})</span></li>
											<li>미추홀구 <span class="study-count">({{ regionCounts['인천']?.['미추홀구'] || 0
													}})</span>
											</li>
											<li>부평구 <span class="study-count">({{ regionCounts['인천']?.['부평구'] || 0
													}})</span>
											</li>
											<li>서구 <span class="study-count">({{ regionCounts['인천']?.['서구'] || 0
													}})</span></li>
											<li>연수구 <span class="study-count">({{ regionCounts['인천']?.['연수구'] || 0
													}})</span>
											</li>
											<li>옹진군</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>중구 <span class="study-count">({{ regionCounts['인천']?.['중구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('부산', '전체')">
									<div class="region-name">
										부산
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['부산']?.['전체'] || 0
													}})</span></li>
											<li>강서구 <span class="study-count">({{ regionCounts['부산']?.['강서구'] || 0
													}})</span>
											</li>
											<li>금정구 <span class="study-count">({{ regionCounts['부산']?.['금정구'] || 0
													}})</span>
											</li>
											<li>기장군 <span class="study-count">({{ regionCounts['부산']?.['기장군'] || 0
													}})</span>
											</li>
											<li>남구 <span class="study-count">({{ regionCounts['부산']?.['남구'] || 0
													}})</span></li>
											<li>동구 <span class="study-count">({{ regionCounts['부산']?.['동구'] || 0
													}})</span></li>
											<li>동래구 <span class="study-count">({{ regionCounts['부산']?.['동래구'] || 0
													}})</span>
											</li>
											<li>부산진구 <span class="study-count">({{ regionCounts['부산']?.['부산진구'] || 0
													}})</span>
											</li>
											<li>북구 <span class="study-count">({{ regionCounts['부산']?.['북구'] || 0
													}})</span></li>
											<li>사상구 <span class="study-count">({{ regionCounts['부산']?.['사상구'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>사하구 <span class="study-count">({{ regionCounts['부산']?.['사하구'] || 0
													}})</span>
											</li>
											<li>서구 <span class="study-count">({{ regionCounts['부산']?.['서구'] || 0
													}})</span></li>
											<li>수영구 <span class="study-count">({{ regionCounts['부산']?.['수영구'] || 0
													}})</span>
											</li>
											<li>연제구 <span class="study-count">({{ regionCounts['부산']?.['연제구'] || 0
													}})</span>
											</li>
											<li>영도구 <span class="study-count">({{ regionCounts['부산']?.['영도구'] || 0
													}})</span>
											</li>
											<li>중구 <span class="study-count">({{ regionCounts['부산']?.['중구'] || 0
													}})</span></li>
											<li>해운대구 <span class="study-count">({{ regionCounts['부산']?.['해운대구'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('대구', '전체')">
									<div class="region-name">
										대구
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['대구']?.['전체'] || 0
													}})</span></li>
											<li>군위군 <span class="study-count">({{ regionCounts['대구']?.['군위군'] || 0
													}})</span>
											</li>
											<li>남구 <span class="study-count">({{ regionCounts['대구']?.['남구'] || 0
													}})</span></li>
											<li>달서구 <span class="study-count">({{ regionCounts['대구']?.['달서구'] || 0
													}})</span>
											</li>
											<li>달성군 <span class="study-count">({{ regionCounts['대구']?.['달성군'] || 0
													}})</span>
											</li>
											<li>동구 <span class="study-count">({{ regionCounts['대구']?.['동구'] || 0
													}})</span></li>
											<li>북구 <span class="study-count">({{ regionCounts['대구']?.['북구'] || 0
													}})</span></li>
											<li>서구 <span class="study-count">({{ regionCounts['대구']?.['서구'] || 0
													}})</span></li>
											<li>수성구 <span class="study-count">({{ regionCounts['대구']?.['수성구'] || 0
													}})</span>
											</li>
											<li>중구 <span class="study-count">({{ regionCounts['대구']?.['중구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('광주', '전체')">
									<div class="region-name">
										광주
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['광주']?.['전체'] || 0
													}})</span></li>
											<li>광산구 <span class="study-count">({{ regionCounts['광주']?.['광산구'] || 0
													}})</span>
											</li>
											<li>남구 <span class="study-count">({{ regionCounts['광주']?.['남구'] || 0
													}})</span></li>
											<li>동구 <span class="study-count">({{ regionCounts['광주']?.['동구'] || 0
													}})</span></li>
											<li>북구 <span class="study-count">({{ regionCounts['광주']?.['북구'] || 0
													}})</span></li>
											<li>서구 <span class="study-count">({{ regionCounts['광주']?.['서구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('대전', '전체')">
									<div class="region-name">
										대전
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['대전']?.['전체'] || 0
													}})</span></li>
											<li>대덕구 <span class="study-count">({{ regionCounts['대전']?.['대덕구'] || 0
													}})</span>
											</li>
											<li>동구 <span class="study-count">({{ regionCounts['대전']?.['동구'] || 0
													}})</span></li>
											<li>서구 <span class="study-count">({{ regionCounts['대전']?.['서구'] || 0
													}})</span></li>
											<li>유성구 <span class="study-count">({{ regionCounts['대전']?.['유성구'] || 0
													}})</span>
											</li>
											<li>중구 <span class="study-count">({{ regionCounts['대전']?.['중구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('울산', '전체')">
									<div class="region-name">
										울산
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['울산']?.['전체'] || 0
													}})</span></li>
											<li>남구 <span class="study-count">({{ regionCounts['울산']?.['남구'] || 0
													}})</span></li>
											<li>동구 <span class="study-count">({{ regionCounts['울산']?.['동구'] || 0
													}})</span></li>
											<li>북구 <span class="study-count">({{ regionCounts['울산']?.['북구'] || 0
													}})</span></li>
											<li>울주군 <span class="study-count">({{ regionCounts['울산']?.['울주군'] || 0
													}})</span>
											</li>
											<li>중구 <span class="study-count">({{ regionCounts['울산']?.['중구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('경기', '전체')">
									<div class="region-name">
										경기
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['경기']?.['전체'] || 0
													}})</span></li>
											<li>가평군 <span class="study-count">({{ regionCounts['경기']?.['가평군'] || 0
													}})</span>
											</li>
											<li>고양시 덕양구 <span class="study-count">({{ regionCounts['경기']?.['고양시 덕양구'] ||
												0
													}})</span></li>
											<li>고양시 일산동구 <span class="study-count">({{ regionCounts['경기']?.['고양시 일산동구']
												|| 0
													}})</span></li>
											<li>고양시 일산서구 <span class="study-count">({{ regionCounts['경기']?.['고양시 일산서구']
												|| 0
													}})</span></li>
											<li>과천시 <span class="study-count">({{ regionCounts['경기']?.['과천시'] || 0
													}})</span>
											</li>
											<li>광명시 <span class="study-count">({{ regionCounts['경기']?.['광명시'] || 0
													}})</span>
											</li>
											<li>광주시 <span class="study-count">({{ regionCounts['경기']?.['광주시'] || 0
													}})</span>
											</li>
											<li>구리시 <span class="study-count">({{ regionCounts['경기']?.['구리시'] || 0
													}})</span>
											</li>
											<li>군포시 <span class="study-count">({{ regionCounts['경기']?.['군포시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>김포시 <span class="study-count">({{ regionCounts['경기']?.['김포시'] || 0
													}})</span>
											</li>
											<li>남양주시 <span class="study-count">({{ regionCounts['경기']?.['남양주시'] || 0
													}})</span>
											</li>
											<li>동두천시 <span class="study-count">({{ regionCounts['경기']?.['동두천시'] || 0
													}})</span>
											</li>
											<li>부천시 <span class="study-count">({{ regionCounts['경기']?.['부천시'] || 0
													}})</span>
											</li>
											<li>성남시 분당구 <span class="study-count">({{ regionCounts['경기']?.['성남시 분당구'] ||
												0
													}})</span></li>
											<li>성남시 수정구 <span class="study-count">({{ regionCounts['경기']?.['성남시 수정구'] ||
												0
													}})</span></li>
											<li>성남시 중원구 <span class="study-count">({{ regionCounts['경기']?.['성남시 중원구'] ||
												0
													}})</span></li>
											<li>수원시 권선구 <span class="study-count">({{ regionCounts['경기']?.['수원시 권선구'] ||
												0
													}})</span></li>
											<li>수원시 장안구 <span class="study-count">({{ regionCounts['경기']?.['수원시 장안구'] ||
												0
													}})</span></li>
											<li>수원시 팔달구 <span class="study-count">({{ regionCounts['경기']?.['수원시 팔달구'] ||
												0
													}})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>수원시 영통구 <span class="study-count">({{ regionCounts['경기']?.['수원시 영통구'] ||
												0
													}})</span></li>
											<li>시흥시 <span class="study-count">({{ regionCounts['경기']?.['시흥시'] || 0
													}})</span>
											</li>
											<li>안산시 단원구 <span class="study-count">({{ regionCounts['경기']?.['안산시 단원구'] ||
												0
													}})</span></li>
											<li>안산시 상록구 <span class="study-count">({{ regionCounts['경기']?.['안산시 상록구'] ||
												0
													}})</span></li>
											<li>안성시 <span class="study-count">({{ regionCounts['경기']?.['안성시'] || 0
													}})</span>
											</li>
											<li>안양시 동안구 <span class="study-count">({{ regionCounts['경기']?.['안양시 동안구'] ||
												0
													}})</span></li>
											<li>안양시 만안구 <span class="study-count">({{ regionCounts['경기']?.['안양시 만안구'] ||
												0
													}})</span></li>
											<li>양주시 <span class="study-count">({{ regionCounts['경기']?.['양주시'] || 0
													}})</span>
											</li>
											<li>양평군 <span class="study-count">({{ regionCounts['경기']?.['양평군'] || 0
													}})</span>
											</li>
											<li>여주시 <span class="study-count">({{ regionCounts['경기']?.['여주시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>연천군 <span class="study-count">({{ regionCounts['경기']?.['연천군'] || 0
													}})</span>
											</li>
											<li>오산시 <span class="study-count">({{ regionCounts['경기']?.['오산시'] || 0
													}})</span>
											</li>
											<li>용인시 기흥구 <span class="study-count">({{ regionCounts['경기']?.['용인시 기흥구'] ||
												0
													}})</span></li>
											<li>용인시 수지구 <span class="study-count">({{ regionCounts['경기']?.['용인시 수지구'] ||
												0
													}})</span></li>
											<li>용인시 처인구 <span class="study-count">({{ regionCounts['경기']?.['용인시 처인구'] ||
												0
													}})</span></li>
											<li>의왕시 <span class="study-count">({{ regionCounts['경기']?.['의왕시'] || 0
													}})</span>
											</li>
											<li>의정부시 <span class="study-count">({{ regionCounts['경기']?.['의정부시'] || 0
													}})</span>
											</li>
											<li>이천시 <span class="study-count">({{ regionCounts['경기']?.['이천시'] || 0
													}})</span>
											</li>
											<li>파주시 <span class="study-count">({{ regionCounts['경기']?.['파주시'] || 0
													}})</span>
											</li>
											<li>평택시 <span class="study-count">({{ regionCounts['경기']?.['평택시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>포천시 <span class="study-count">({{ regionCounts['경기']?.['포천시'] || 0
													}})</span>
											</li>
											<li>하남시 <span class="study-count">({{ regionCounts['경기']?.['하남시'] || 0
													}})</span>
											</li>
											<li>화성시 <span class="study-count">({{ regionCounts['경기']?.['화성시'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('세종', '전체')">
									<div class="region-name">
										세종
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('충남', '전체')">
									<div class="region-name">
										충남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['충남']?.['전체'] || 0
													}})</span></li>
											<li>공주시 <span class="study-count">({{ regionCounts['충남']?.['공주시'] || 0
													}})</span>
											</li>
											<li>금산군 <span class="study-count">({{ regionCounts['충남']?.['금산군'] || 0
													}})</span>
											</li>
											<li>논산시 <span class="study-count">({{ regionCounts['충남']?.['논산시'] || 0
													}})</span>
											</li>
											<li>당진시 <span class="study-count">({{ regionCounts['충남']?.['당진시'] || 0
													}})</span>
											</li>
											<li>보령시 <span class="study-count">({{ regionCounts['충남']?.['보령시'] || 0
													}})</span>
											</li>
											<li>부여군 <span class="study-count">({{ regionCounts['충남']?.['부여군'] || 0
													}})</span>
											</li>
											<li>서산시 <span class="study-count">({{ regionCounts['충남']?.['서산시'] || 0
													}})</span>
											</li>
											<li>서천군 <span class="study-count">({{ regionCounts['충남']?.['서천군'] || 0
													}})</span>
											</li>
											<li>아산시 <span class="study-count">({{ regionCounts['충남']?.['아산시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>예산군 <span class="study-count">({{ regionCounts['충남']?.['예산군'] || 0
													}})</span>
											</li>
											<li>천안시 동남구 <span class="study-count">({{ regionCounts['충남']?.['천안시 동남구'] ||
												0
													}})</span></li>
											<li>천안시 서북구 <span class="study-count">({{ regionCounts['충남']?.['천안시 서북구'] ||
												0
													}})</span></li>
											<li>청양군 <span class="study-count">({{ regionCounts['충남']?.['청양군'] || 0
													}})</span>
											</li>
											<li>태안군 <span class="study-count">({{ regionCounts['충남']?.['태안군'] || 0
													}})</span>
											</li>
											<li>홍성군 <span class="study-count">({{ regionCounts['충남']?.['홍성군'] || 0
													}})</span>
											</li>
											<li>계룡시 <span class="study-count">({{ regionCounts['충남']?.['계룡시'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('충북', '전체')">
									<div class="region-name">
										충북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['충북']?.['전체'] || 0
													}})</span></li>
											<li>괴산군 <span class="study-count">({{ regionCounts['충북']?.['괴산군'] || 0
													}})</span>
											</li>
											<li>단양군 <span class="study-count">({{ regionCounts['충북']?.['단양군'] || 0
													}})</span>
											</li>
											<li>보은군 <span class="study-count">({{ regionCounts['충북']?.['보은군'] || 0
													}})</span>
											</li>
											<li>영동군 <span class="study-count">({{ regionCounts['충북']?.['영동군'] || 0
													}})</span>
											</li>
											<li>옥천군 <span class="study-count">({{ regionCounts['충북']?.['옥천군'] || 0
													}})</span>
											</li>
											<li>음성군 <span class="study-count">({{ regionCounts['충북']?.['음성군'] || 0
													}})</span>
											</li>
											<li>제천시 <span class="study-count">({{ regionCounts['충북']?.['제천시'] || 0
													}})</span>
											</li>
											<li>진천군 <span class="study-count">({{ regionCounts['충북']?.['진천군'] || 0
													}})</span>
											</li>
											<li>청주시 청원구 <span class="study-count">({{ regionCounts['충북']?.['청주시 청원구'] ||
												0
													}})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>청주시 상당구 <span class="study-count">({{ regionCounts['충북']?.['청주시 상당구'] ||
												0
													}})</span></li>
											<li>청주시 서원구 <span class="study-count">({{ regionCounts['충북']?.['청주시 서원구'] ||
												0
													}})</span></li>
											<li>청주시 흥덕구 <span class="study-count">({{ regionCounts['충북']?.['청주시 흥덕구'] ||
												0
													}})</span></li>
											<li>충주시 <span class="study-count">({{ regionCounts['충북']?.['충주시'] || 0
													}})</span>
											</li>
											<li>증평군 <span class="study-count">({{ regionCounts['충북']?.['증평군'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('경남', '전체')">
									<div class="region-name">
										경남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['경남']?.['전체'] || 0
													}})</span></li>
											<li>거제시 <span class="study-count">({{ regionCounts['경남']?.['거제시'] || 0
													}})</span>
											</li>
											<li>거창군 <span class="study-count">({{ regionCounts['경남']?.['거창군'] || 0
													}})</span>
											</li>
											<li>고성군 <span class="study-count">({{ regionCounts['경남']?.['고성군'] || 0
													}})</span>
											</li>
											<li>김해시 <span class="study-count">({{ regionCounts['경남']?.['김해시'] || 0
													}})</span>
											</li>
											<li>남해군 <span class="study-count">({{ regionCounts['경남']?.['남해군'] || 0
													}})</span>
											</li>
											<li>밀양시 <span class="study-count">({{ regionCounts['경남']?.['밀양시'] || 0
													}})</span>
											</li>
											<li>사천시 <span class="study-count">({{ regionCounts['경남']?.['사천시'] || 0
													}})</span>
											</li>
											<li>산청군 <span class="study-count">({{ regionCounts['경남']?.['산청군'] || 0
													}})</span>
											</li>
											<li>양산시 <span class="study-count">({{ regionCounts['경남']?.['양산시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>의령군 <span class="study-count">({{ regionCounts['경남']?.['의령군'] || 0
													}})</span>
											</li>
											<li>진주시 <span class="study-count">({{ regionCounts['경남']?.['진주시'] || 0
													}})</span>
											</li>
											<li>창녕군 <span class="study-count">({{ regionCounts['경남']?.['창녕군'] || 0
													}})</span>
											</li>
											<li>창원시 마산합포구 <span class="study-count">({{ regionCounts['경남']?.['창원시 마산합포구'] || 0
													}})</span></li>
											<li>창원시 마산회원구 <span class="study-count">({{ regionCounts['경남']?.['창원시 마산회원구'] || 0
													}})</span></li>
											<li>창원시 성산구 <span class="study-count">({{ regionCounts['경남']?.['창원시 성산구'] ||
												0
													}})</span></li>
											<li>창원시 의창구 <span class="study-count">({{ regionCounts['경남']?.['창원시 의창구'] ||
												0
													}})</span></li>
											<li>창원시 진해구 <span class="study-count">({{ regionCounts['경남']?.['창원시 진해구'] ||
												0
													}})</span></li>
											<li>통영시 <span class="study-count">({{ regionCounts['경남']?.['통영시'] || 0
													}})</span>
											</li>
											<li>하동군 <span class="study-count">({{ regionCounts['경남']?.['하동군'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>함안군 <span class="study-count">({{ regionCounts['경남']?.['함안군'] || 0
													}})</span>
											</li>
											<li>함양군 <span class="study-count">({{ regionCounts['경남']?.['함양군'] || 0
													}})</span>
											</li>
											<li>합천군 <span class="study-count">({{ regionCounts['경남']?.['합천군'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('경북', '전체')">
									<div class="region-name">
										경북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['경북']?.['전체'] || 0
													}})</span></li>
											<li>경산시 <span class="study-count">({{ regionCounts['경북']?.['경산시'] || 0
													}})</span>
											</li>
											<li>경주시 <span class="study-count">({{ regionCounts['경북']?.['경주시'] || 0
													}})</span>
											</li>
											<li>고령군 <span class="study-count">({{ regionCounts['경북']?.['고령군'] || 0
													}})</span>
											</li>
											<li>구미시 <span class="study-count">({{ regionCounts['경북']?.['구미시'] || 0
													}})</span>
											</li>
											<li>김천시 <span class="study-count">({{ regionCounts['경북']?.['김천시'] || 0
													}})</span>
											</li>
											<li>문경시 <span class="study-count">({{ regionCounts['경북']?.['문경시'] || 0
													}})</span>
											</li>
											<li>봉화군 <span class="study-count">({{ regionCounts['경북']?.['봉화군'] || 0
													}})</span>
											</li>
											<li>상주시 <span class="study-count">({{ regionCounts['경북']?.['상주시'] || 0
													}})</span>
											</li>
											<li>성주군 <span class="study-count">({{ regionCounts['경북']?.['성주군'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>안동시 <span class="study-count">({{ regionCounts['경북']?.['안동시'] || 0
													}})</span>
											</li>
											<li>영덕군 <span class="study-count">({{ regionCounts['경북']?.['영덕군'] || 0
													}})</span>
											</li>
											<li>영양군 <span class="study-count">({{ regionCounts['경북']?.['영양군'] || 0
													}})</span>
											</li>
											<li>영주시 <span class="study-count">({{ regionCounts['경북']?.['영주시'] || 0
													}})</span>
											</li>
											<li>영천시 <span class="study-count">({{ regionCounts['경북']?.['영천시'] || 0
													}})</span>
											</li>
											<li>예천군 <span class="study-count">({{ regionCounts['경북']?.['예천군'] || 0
													}})</span>
											</li>
											<li>을릉군 <span class="study-count">({{ regionCounts['경북']?.['을릉군'] || 0
													}})</span>
											</li>
											<li>울진군 <span class="study-count">({{ regionCounts['경북']?.['울진군'] || 0
													}})</span>
											</li>
											<li>의성군 <span class="study-count">({{ regionCounts['경북']?.['의성군'] || 0
													}})</span>
											</li>
											<li>청도군 <span class="study-count">({{ regionCounts['경북']?.['청도군'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>청송군 <span class="study-count">({{ regionCounts['경북']?.['청송군'] || 0
													}})</span>
											</li>
											<li>칠곡군 <span class="study-count">({{ regionCounts['경북']?.['칠곡군'] || 0
													}})</span>
											</li>
											<li>포항시 남구 <span class="study-count">({{ regionCounts['경북']?.['포항시 남구'] || 0
													}})</span></li>
											<li>포항시 북구 <span class="study-count">({{ regionCounts['경북']?.['포항시 북구'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('전남', '전체')">
									<div class="region-name">
										전남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['전남']?.['전체'] || 0
													}})</span></li>
											<li>강진군 <span class="study-count">({{ regionCounts['전남']?.['강진군'] || 0
													}})</span>
											</li>
											<li>고흥군 <span class="study-count">({{ regionCounts['전남']?.['고흥군'] || 0
													}})</span>
											</li>
											<li>곡성군 <span class="study-count">({{ regionCounts['전남']?.['곡성군'] || 0
													}})</span>
											</li>
											<li>광양시 <span class="study-count">({{ regionCounts['전남']?.['광양시'] || 0
													}})</span>
											</li>
											<li>구례군 <span class="study-count">({{ regionCounts['전남']?.['구례군'] || 0
													}})</span>
											</li>
											<li>나주시 <span class="study-count">({{ regionCounts['전남']?.['나주시'] || 0
													}})</span>
											</li>
											<li>담양군 <span class="study-count">({{ regionCounts['전남']?.['담양군'] || 0
													}})</span>
											</li>
											<li>목포시 <span class="study-count">({{ regionCounts['전남']?.['목포시'] || 0
													}})</span>
											</li>
											<li>무안군 <span class="study-count">({{ regionCounts['전남']?.['무안군'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>보성군 <span class="study-count">({{ regionCounts['전남']?.['보성군'] || 0
													}})</span>
											</li>
											<li>순천시 <span class="study-count">({{ regionCounts['전남']?.['순천시'] || 0
													}})</span>
											</li>
											<li>신안군 <span class="study-count">({{ regionCounts['전남']?.['신안군'] || 0
													}})</span>
											</li>
											<li>여수시 <span class="study-count">({{ regionCounts['전남']?.['여수시'] || 0
													}})</span>
											</li>
											<li>영광군 <span class="study-count">({{ regionCounts['전남']?.['영광군'] || 0
													}})</span>
											</li>
											<li>영암군 <span class="study-count">({{ regionCounts['전남']?.['영암군'] || 0
													}})</span>
											</li>
											<li>완도군 <span class="study-count">({{ regionCounts['전남']?.['완도군'] || 0
													}})</span>
											</li>
											<li>장성군 <span class="study-count">({{ regionCounts['전남']?.['장성군'] || 0
													}})</span>
											</li>
											<li>장흥군 <span class="study-count">({{ regionCounts['전남']?.['장흥군'] || 0
													}})</span>
											</li>
											<li>진도군 <span class="study-count">({{ regionCounts['전남']?.['진도군'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>함평군 <span class="study-count">({{ regionCounts['전남']?.['함평군'] || 0
													}})</span>
											</li>
											<li>해남군 <span class="study-count">({{ regionCounts['전남']?.['해남군'] || 0
													}})</span>
											</li>
											<li>화순군 <span class="study-count">({{ regionCounts['전남']?.['화순군'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('전북', '전체')">
									<div class="region-name">
										전북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['전북']?.['전체'] || 0
													}})</span></li>
											<li>고창군 <span class="study-count">({{ regionCounts['전북']?.['고창군'] || 0
													}})</span>
											</li>
											<li>군산시 <span class="study-count">({{ regionCounts['전북']?.['군산시'] || 0
													}})</span>
											</li>
											<li>김제시 <span class="study-count">({{ regionCounts['전북']?.['김제시'] || 0
													}})</span>
											</li>
											<li>남원시 <span class="study-count">({{ regionCounts['전북']?.['남원시'] || 0
													}})</span>
											</li>
											<li>무주군 <span class="study-count">({{ regionCounts['전북']?.['무주군'] || 0
													}})</span>
											</li>
											<li>부안군 <span class="study-count">({{ regionCounts['전북']?.['부안군'] || 0
													}})</span>
											</li>
											<li>순창군 <span class="study-count">({{ regionCounts['전북']?.['순창군'] || 0
													}})</span>
											</li>
											<li>완주군 <span class="study-count">({{ regionCounts['전북']?.['완주군'] || 0
													}})</span>
											</li>
											<li>익산시 <span class="study-count">({{ regionCounts['전북']?.['익산시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>임실군 <span class="study-count">({{ regionCounts['전북']?.['임실군'] || 0
													}})</span>
											</li>
											<li>장수군 <span class="study-count">({{ regionCounts['전북']?.['장수군'] || 0
													}})</span>
											</li>
											<li>전주시 덕진구 <span class="study-count">({{ regionCounts['전북']?.['전주시 덕진구'] ||
												0
													}})</span></li>
											<li>전주시 완산구 <span class="study-count">({{ regionCounts['전북']?.['전주시 완산구'] ||
												0
													}})</span></li>
											<li>정읍시 <span class="study-count">({{ regionCounts['전북']?.['정읍시'] || 0
													}})</span>
											</li>
											<li>진안군 <span class="study-count">({{ regionCounts['전북']?.['진안군'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('강원', '전체')">
									<div class="region-name">
										강원
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['강원']?.['전체'] || 0
													}})</span></li>
											<li>강릉시 <span class="study-count">({{ regionCounts['강원']?.['강릉시'] || 0
													}})</span>
											</li>
											<li>고성군 <span class="study-count">({{ regionCounts['강원']?.['고성군'] || 0
													}})</span>
											</li>
											<li>동해시 <span class="study-count">({{ regionCounts['강원']?.['동해시'] || 0
													}})</span>
											</li>
											<li>삼척시 <span class="study-count">({{ regionCounts['강원']?.['삼척시'] || 0
													}})</span>
											</li>
											<li>속초시 <span class="study-count">({{ regionCounts['강원']?.['속초시'] || 0
													}})</span>
											</li>
											<li>양구군 <span class="study-count">({{ regionCounts['강원']?.['양구군'] || 0
													}})</span>
											</li>
											<li>양양군 <span class="study-count">({{ regionCounts['강원']?.['양양군'] || 0
													}})</span>
											</li>
											<li>영월군 <span class="study-count">({{ regionCounts['강원']?.['영월군'] || 0
													}})</span>
											</li>
											<li>원주시 <span class="study-count">({{ regionCounts['강원']?.['원주시'] || 0
													}})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li>인제군 <span class="study-count">({{ regionCounts['강원']?.['인제군'] || 0
													}})</span>
											</li>
											<li>정선군 <span class="study-count">({{ regionCounts['강원']?.['정선군'] || 0
													}})</span>
											</li>
											<li>철원군 <span class="study-count">({{ regionCounts['강원']?.['철원군'] || 0
													}})</span>
											</li>
											<li>춘천시 <span class="study-count">({{ regionCounts['강원']?.['춘천시'] || 0
													}})</span>
											</li>
											<li>태백시 <span class="study-count">({{ regionCounts['강원']?.['태백시'] || 0
													}})</span>
											</li>
											<li>평창군 <span class="study-count">({{ regionCounts['강원']?.['평창군'] || 0
													}})</span>
											</li>
											<li>홍천군 <span class="study-count">({{ regionCounts['강원']?.['홍천군'] || 0
													}})</span>
											</li>
											<li>화천군 <span class="study-count">({{ regionCounts['강원']?.['화천군'] || 0
													}})</span>
											</li>
											<li>횡성군 <span class="study-count">({{ regionCounts['강원']?.['횡성군'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region" @click="goToStudyList('제주', '전체')">
									<div class="region-name">
										제주
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>전체 <span class="study-count">({{ regionCounts['제주']?.['전체'] || 0
													}})</span></li>
											<li>서귀포시 <span class="study-count">({{ regionCounts['제주']?.['서귀포시'] || 0
													}})</span>
											</li>
											<li>제주시 <span class="study-count">({{ regionCounts['제주']?.['제주시'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							학습자별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">
										전체
										<span class="category-count">({{ regionCounts['전공별']?.['전체'] || 0 }})</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										중등
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>1학년 <span class="study-count">({{ regionCounts['중등']?.['1학년'] || 0
													}})</span>
											</li>
											<li>2학년 <span class="study-count">({{ regionCounts['중등']?.['2학년'] || 0
													}})</span>
											</li>
											<li>3학년 <span class="study-count">({{ regionCounts['중등']?.['3학년'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										고등
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>1학년 <span class="study-count">({{ regionCounts['고등']?.['1학년'] || 0
													}})</span>
											</li>
											<li>2학년 <span class="study-count">({{ regionCounts['고등']?.['2학년'] || 0
													}})</span>
											</li>
											<li>3학년 <span class="study-count">({{ regionCounts['고등']?.['3학년'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										대학/청년
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>대학생 <span class="study-count">({{ regionCounts['대학/청년']?.['대학생'] || 0
													}})</span>
											</li>
											<li>청년 <span class="study-count">({{ regionCounts['대학/청년']?.['청년'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										취업준비/수험
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>취업준비생 <span class="study-count">({{ regionCounts['취업준비/수험']?.['취업준비생']
												|| 0
													}})</span></li>
											<li>수험생 <span class="study-count">({{ regionCounts['취업준비/수험']?.['수험생'] || 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										경력/이직
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>경력 <span class="study-count">({{ regionCounts['경력/이직']?.['경력'] || 0
													}})</span>
											</li>
											<li>이직 <span class="study-count">({{ regionCounts['경력/이직']?.['이직'] || 0
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										취미/자기계발
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>취미 <span class="study-count">({{ regionCounts['취미/자기계발']?.['취미'] || 0
													}})</span>
											</li>
											<li>자기계발 <span class="study-count">({{ regionCounts['취미/자기계발']?.['자기계발'] ||
												0
													}})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							전공별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">
										전체
										<span class="category-count">({{ regionCounts['전공별']?.['전체'] || 0 }})</span>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										어문학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>국어국문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['국어국문학과'] ||
												0 }})</span></li>
											<li>영어영문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['영어영문학과'] ||
												0 }})</span></li>
											<li>독일어문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['독일어문학과'] ||
												0 }})</span></li>
											<li>프랑스어문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['프랑스어문학과']
												|| 0 }})</span></li>
											<li>중어중문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['중어중문학과'] ||
												0 }})</span></li>
											<li>일본어학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['일본어학과'] || 0
											}})</span></li>
											<li>러시아어문학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['러시아어문학과']
												|| 0 }})</span></li>
											<li>기타언어학과 <span class="study-count">({{
												regionCounts['전공별']?.['어문학']?.['기타언어학과'] ||
												0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										인문과학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>철학과 <span class="study-count">({{ regionCounts['전공별']?.['인문과학']?.['철학과']
												|| 0
													}})</span></li>
											<li>역사학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['역사학과'] || 0
											}})</span></li>
											<li>심리학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['심리학과'] || 0
											}})</span></li>
											<li>사회학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['사회학과'] || 0
											}})</span></li>
											<li>인류학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['인류학과'] || 0
											}})</span></li>
											<li>문헌정보학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['문헌정보학과']
												|| 0 }})</span></li>
											<li>문화인류학과 <span class="study-count">({{
												regionCounts['전공별']?.['인문과학']?.['문화인류학과']
												|| 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										사회과학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>정치외교학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['정치외교학과']
												|| 0 }})</span></li>
											<li>경제학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['경제학과'] || 0
											}})</span></li>
											<li>사회복지학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['사회복지학과']
												|| 0 }})</span></li>
											<li>행정학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['행정학과'] || 0
											}})</span></li>
											<li>국제관계학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['국제관계학과']
												|| 0 }})</span></li>
											<li>도시공학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['도시공학과'] ||
												0 }})</span></li>
											<li>지역개발학과 <span class="study-count">({{
												regionCounts['전공별']?.['사회과학']?.['지역개발학과']
												|| 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										자연과학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>물리학과 <span class="study-count">({{
												regionCounts['전공별']?.['자연과학']?.['물리학과'] || 0
											}})</span></li>
											<li>화학과 <span class="study-count">({{ regionCounts['전공별']?.['자연과학']?.['화학과']
												|| 0
													}})</span></li>
											<li>생물학과 <span class="study-count">({{
												regionCounts['전공별']?.['자연과학']?.['생물학과'] || 0
											}})</span></li>
											<li>지구과학과 <span class="study-count">({{
												regionCounts['전공별']?.['자연과학']?.['지구과학과'] ||
												0 }})</span></li>
											<li>수학과 <span class="study-count">({{ regionCounts['전공별']?.['자연과학']?.['수학과']
												|| 0
													}})</span></li>
											<li>통계학과 <span class="study-count">({{
												regionCounts['전공별']?.['자연과학']?.['통계학과'] || 0
											}})</span></li>
											<li>환경과학과 <span class="study-count">({{
												regionCounts['전공별']?.['자연과학']?.['환경과학과'] ||
												0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										공학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>기계공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['기계공학과'] || 0
											}})</span></li>
											<li>전기전자공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['전기전자공학과']
												|| 0 }})</span></li>
											<li>컴퓨터공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['컴퓨터공학과'] ||
												0 }})</span></li>
											<li>화학공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['화학공학과'] || 0
											}})</span></li>
											<li>토목공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['토목공학과'] || 0
											}})</span></li>
											<li>건축공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['건축공학과'] || 0
											}})</span></li>
											<li>산업공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['산업공학과'] || 0
											}})</span></li>
											<li>항공우주공학과 <span class="study-count">({{
												regionCounts['전공별']?.['공학']?.['항공우주공학과']
												|| 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										법학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>법학과 <span class="study-count">({{ regionCounts['전공별']?.['법학']?.['법학과']
												|| 0
													}})</span></li>
											<li>국제법학과 <span class="study-count">({{
												regionCounts['전공별']?.['법학']?.['국제법학과'] || 0
											}})</span></li>
											<li>형사법학과 <span class="study-count">({{
												regionCounts['전공별']?.['법학']?.['형사법학과'] || 0
											}})</span></li>
											<li>민사법학과 <span class="study-count">({{
												regionCounts['전공별']?.['법학']?.['민사법학과'] || 0
											}})</span></li>
											<li>행정법학과 <span class="study-count">({{
												regionCounts['전공별']?.['법학']?.['행정법학과'] || 0
											}})</span></li>
											<li>상법학과 <span class="study-count">({{ regionCounts['전공별']?.['법학']?.['상법학과']
												|| 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										사범학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>초등교육과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['초등교육과'] || 0
											}})</span></li>
											<li>유아교육과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['유아교육과'] || 0
											}})</span></li>
											<li>중등교육과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['중등교육과'] || 0
											}})</span></li>
											<li>특수교육과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['특수교육과'] || 0
											}})</span></li>
											<li>교육학과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['교육학과'] || 0
											}})</span></li>
											<li>교육행정학과 <span class="study-count">({{
												regionCounts['전공별']?.['사범학']?.['교육행정학과'] ||
												0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										상경
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>경영학과 <span class="study-count">({{ regionCounts['전공별']?.['상경']?.['경영학과']
												|| 0
													}})</span></li>
											<li>회계학과 <span class="study-count">({{ regionCounts['전공별']?.['상경']?.['회계학과']
												|| 0
													}})</span></li>
											<li>마케팅학과 <span class="study-count">({{
												regionCounts['전공별']?.['상경']?.['마케팅학과'] || 0
											}})</span></li>
											<li>금융학과 <span class="study-count">({{ regionCounts['전공별']?.['상경']?.['금융학과']
												|| 0
													}})</span></li>
											<li>무역학과 <span class="study-count">({{ regionCounts['전공별']?.['상경']?.['무역학과']
												|| 0
													}})</span></li>
											<li>경제학과 <span class="study-count">({{ regionCounts['전공별']?.['상경']?.['경제학과']
												|| 0
													}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										생활과학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>가정관리학과 <span class="study-count">({{
												regionCounts['전공별']?.['생활과학']?.['가정관리학과']
												|| 0 }})</span></li>
											<li>식품영양학과 <span class="study-count">({{
												regionCounts['전공별']?.['생활과학']?.['식품영양학과']
												|| 0 }})</span></li>
											<li>의류학과 <span class="study-count">({{
												regionCounts['전공별']?.['생활과학']?.['의류학과'] || 0
											}})</span></li>
											<li>주거환경학과 <span class="study-count">({{
												regionCounts['전공별']?.['생활과학']?.['주거환경학과']
												|| 0 }})</span></li>
											<li>아동학과 <span class="study-count">({{
												regionCounts['전공별']?.['생활과학']?.['아동학과'] || 0
											}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										예/체능학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>미술학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['미술학과'] || 0
											}})</span></li>
											<li>음악학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['음악학과'] || 0
											}})</span></li>
											<li>체육학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['체육학과'] || 0
											}})</span></li>
											<li>무용학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['무용학과'] || 0
											}})</span></li>
											<li>디자인학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['디자인학과'] ||
												0 }})</span></li>
											<li>영화학과 <span class="study-count">({{
												regionCounts['전공별']?.['예/체능학']?.['영화학과'] || 0
											}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										의/약학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>의학과 <span class="study-count">({{ regionCounts['전공별']?.['의/약학']?.['의학과']
												|| 0
													}})</span></li>
											<li>간호학과 <span class="study-count">({{
												regionCounts['전공별']?.['의/약학']?.['간호학과'] || 0
											}})</span></li>
											<li>약학과 <span class="study-count">({{ regionCounts['전공별']?.['의/약학']?.['약학과']
												|| 0
													}})</span></li>
											<li>치의학과 <span class="study-count">({{
												regionCounts['전공별']?.['의/약학']?.['치의학과'] || 0
											}})</span></li>
											<li>한의학과 <span class="study-count">({{
												regionCounts['전공별']?.['의/약학']?.['한의학과'] || 0
											}})</span></li>
											<li>보건학과 <span class="study-count">({{
												regionCounts['전공별']?.['의/약학']?.['보건학과'] || 0
											}})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										농/수산/해양학
										<span class="category-count"></span>
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li>농업경제학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['농업경제학과'] || 0 }})</span></li>
											<li>식물학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['식물학과']
												|| 0 }})</span></li>
											<li>동물학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['동물학과']
												|| 0 }})</span></li>
											<li>수산학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['수산학과']
												|| 0 }})</span></li>
											<li>해양학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['해양학과']
												|| 0 }})</span></li>
											<li>농업생명과학과 <span class="study-count">({{
												regionCounts['전공별']?.['농/수산/해양학']?.['농업생명과학과'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							커뮤니티
							<ul class="sub-menu">
								<li class="sub-menu-item" @click="$router.push('/community/free')">
									자유게시판
								</li>
								<li class="sub-menu-item" @click="$router.push('/community/question')">
									질문게시판
								</li>
								<li class="sub-menu-item" @click="$router.push('/community/suggestion')">
									건의게시판
								</li>
							</ul>
						</li>
						<li class="menu-item">고객센터</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const isLoggedIn = ref(false);
const userNickname = ref('');
const regionCounts = ref({});
const isMobile = ref(window.innerWidth <= 768);

const checkLoginStatus = async () => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		try {
			const response = await axios.get('http://localhost:3000/users/profile', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			isLoggedIn.value = true;
			userNickname.value = response.data.nickname;
		} catch (error) {
			console.error('프로필 조회 실패:', error);
			if (error.response?.status === 401) {
				logout();
			}
		}
	} else {
		isLoggedIn.value = false;
		userNickname.value = '';
	}
};

const logout = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	isLoggedIn.value = false;
	userNickname.value = '';
	router.push('/login');
};

const fetchStudyGroupCounts = async () => {
	try {
		const response = await axios.get('http://localhost:3000/study-groups/counts/region');
		regionCounts.value = response.data;
	} catch (error) {
		console.error('스터디 그룹 수 조회 실패:', error);
	}
};

const goToStudyList = (region: string, district: string) => {
	router.push({
		path: '/study-groups',
		query: {
			mainCategory: '지역별',
			subCategory: region,
			detailCategory: district
		}
	});
};

watch(() => route.path, () => {
	checkLoginStatus();
});

onMounted(() => {
	checkLoginStatus();
	fetchStudyGroupCounts();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');

.top-container {
	width: 100%;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 20px;
}

.top-content {
	width: 70%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;
}

.logo-container {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 10px;
	z-index: 1;
}

.right-section {
	display: flex;
	align-items: center;
	gap: 20px;
	margin-left: auto;
}

.logo {
	width: 100px;
	height: auto;
}

.title {
	font-size: 65px;
	font-weight: 400;
	color: #1a365d;
	text-decoration: none;
	font-family: 'Nanum Pen Script', cursive;
	letter-spacing: 1px;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.title:hover {
	color: #4A90E2;
	transform: scale(1.05) rotate(-2deg);
}

.welcome-text {
	font-size: 16px;
	color: #666;
}

.nav-wrapper {
	width: 70%;
	margin: 0 auto;
	background-color: #87CEEB;
	border-radius: 8px;
	height: calc(75px - 1px);
}

.nav-container {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1rem 0;
}

.nav-items {
	width: 100%;
	display: flex;
	justify-content: center;
}

.main-menu {
	display: flex;
	justify-content: space-around;
	list-style: none;
	margin: 0;
	padding: 0;
	position: relative;
}

.menu-item {
	color: #fff;
	font-weight: bold;
	font-size: 20px;
	cursor: pointer;
	padding: 5px 60px;
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
}

.menu-item:hover {
	color: #1a365d;
}

.sub-menu {
	display: none;
	position: absolute;
	top: 100%;
	left: 0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	min-width: 150px;
	z-index: 1000;
}

.menu-item:hover>.sub-menu {
	display: flex;
	flex-direction: column;
}

.menu-item:hover>.sub-menu:has(.sub-menu-item:nth-child(10)) {
	flex-direction: row;
	flex-wrap: wrap;
	width: 300px;
}

.sub-menu:has(.sub-menu-item:nth-child(10)) .sub-menu-item {
	width: 50%;
	box-sizing: border-box;
}

.sub-menu-item {
	color: #333;
	padding: 12px 10px;
	font-size: 16px;
	position: relative;
	border-bottom: 1px solid #eee;
	white-space: nowrap;
}

.sub-menu-item:hover {
	background-color: #f8f9fa;
	color: #4A90E2;
}

.sub-sub-menu {
	position: absolute;
	left: 100%;
	top: 0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	min-width: 250px;
	display: none;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease, visibility 0.3s ease;
}

.sub-menu-item:hover>.sub-sub-menu {
	display: flex;
	opacity: 1;
	visibility: visible;
	z-index: 1001;
}

.sub-sub-menu-column {
	min-width: 40px;
	width: 130px;
	border-right: 1px solid #eee;
	display: flex;
	flex-direction: column;
}

.sub-sub-menu-column:has(li:nth-child(10)) {
	max-height: 400px;
	overflow: hidden;
}

.sub-sub-menu-column:has(li:nth-child(10))~.sub-sub-menu-column {
	border-left: 1px solid #eee;
}

.sub-sub-menu-column li {
	color: #333;
	padding: 8px 15px;
	font-size: 14px;
	border-bottom: 1px solid #eee;
	white-space: nowrap;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.auth-container {
	display: flex;
	align-items: center;
	gap: 1rem;
}

.profile-icon,
.login-icon {
	width: 40px;
	height: 40px;
	cursor: pointer;
}

.logout-button {
	padding: 0.5rem 1rem;
	background-color: #f3f4f6;
	border: 1px solid #d1d5db;
	border-radius: 0.375rem;
	font-size: 14px;
	color: #374151;
	cursor: pointer;
}

.logout-button:hover {
	background-color: #e5e7eb;
}

.login-text {
	font-size: 16px;
	color: #666;
	margin-right: 8px;
}

.sub-menu-item.region {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.region-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.region-count {
	display: none;
}

.study-count {
	font-size: 12px;
	color: #666;
	background-color: #f3f4f6;
	padding: 2px 6px;
	border-radius: 10px;
	margin-left: 8px;
}

.sub-menu-item.category {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.category-name {
	display: flex;
	align-items: center;
	gap: 8px;
}

.category-count {
	font-size: 12px;
	color: #666;
	background-color: #f3f4f6;
	padding: 2px 6px;
	border-radius: 10px;
}

@media (max-width: 768px) {
	.title {
		font-size: 40px;
	}

	.logo {
		width: 80px;
	}

	.login-text {
		display: none;
	}

	.menu-item {
		font-size: 14px;
	}
}
</style>
