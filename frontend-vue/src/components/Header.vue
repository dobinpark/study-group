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
						<template v-if="user">
							<router-link to="/my-studies" class="nav-link">
								<i class="fas fa-book-reader"></i>
								내 스터디
							</router-link>
							<router-link to="/profile">
								<img src="@/assets/images/man.png" alt="프로필" class="profile-icon" />
							</router-link>
							<button @click="logout" class="logout-button">로그아웃</button>
						</template>
						<template v-else>
							<span class="login-text">로그인 하세요</span>
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
								<li class="sub-menu-item region">
									<div class="region-name">
										서울
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '전체')">전체 <span class="study-count">({{
												regionCounts['서울']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '강남구')">강남구 <span
													class="study-count">({{
														regionCounts['서울']?.['강남구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '강동구')">강동구 <span
													class="study-count">({{
														regionCounts['서울']?.['강동구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '강북구')">강북구 <span
													class="study-count">({{
														regionCounts['서울']?.['강북구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '강서구')">강서구 <span
													class="study-count">({{
														regionCounts['서울']?.['강서구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '관악구')">관악구 <span
													class="study-count">({{
														regionCounts['서울']?.['관악구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '광진구')">광진구 <span
													class="study-count">({{
														regionCounts['서울']?.['광진구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '구로구')">구로구 <span
													class="study-count">({{
														regionCounts['서울']?.['구로구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '금천구')">금천구 <span
													class="study-count">({{
														regionCounts['서울']?.['금천구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '노원구')">노원구 <span
													class="study-count">({{
														regionCounts['서울']?.['노원구'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '도봉구')">도봉구 <span
													class="study-count">({{
														regionCounts['서울']?.['도봉구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '동대문구')">동대문구 <span
													class="study-count">({{
														regionCounts['서울']?.['동대문구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '동작구')">동작구 <span
													class="study-count">({{
														regionCounts['서울']?.['동작구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '마포구')">마포구 <span
													class="study-count">({{
														regionCounts['서울']?.['마포구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '서대문구')">서대문구 <span
													class="study-count">({{
														regionCounts['서울']?.['서대문구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '서초구')">서초구 <span
													class="study-count">({{
														regionCounts['서울']?.['서초구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '성동구')">성동구 <span
													class="study-count">({{
														regionCounts['서울']?.['성동구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '성북구')">성북구 <span
													class="study-count">({{
														regionCounts['서울']?.['성북구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '송파구')">송파구 <span
													class="study-count">({{
														regionCounts['서울']?.['송파구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '양천구')">양천구 <span
													class="study-count">({{
														regionCounts['서울']?.['양천구'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '영등포구')">영등포구 <span
													class="study-count">({{
														regionCounts['서울']?.['영등포구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '용산구')">용산구 <span
													class="study-count">({{
														regionCounts['서울']?.['용산구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '은평구')">은평구 <span
													class="study-count">({{
														regionCounts['서울']?.['은평구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '종로구')">종로구 <span
													class="study-count">({{
														regionCounts['서울']?.['종로구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '중구')">중구 <span class="study-count">({{
												regionCounts['서울']?.['중구'] || 0 }})</span></li>
											<li @click="goToStudyList('서울', '중랑구')">중랑구 <span
													class="study-count">({{
														regionCounts['서울']?.['중랑구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										인천
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('인천', '전체')">전체 <span class="study-count">({{
												regionCounts['인천']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '강화군')">강화군 <span
													class="study-count">({{
														regionCounts['인천']?.['강화군'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '계양구')">계양구 <span
													class="study-count">({{
														regionCounts['인천']?.['계양구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '남동구')">남동구 <span
													class="study-count">({{
														regionCounts['인천']?.['남동구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '동구')">동구 <span class="study-count">({{
												regionCounts['인천']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '미추홀구')">미추홀구 <span
													class="study-count">({{
														regionCounts['인천']?.['미추홀구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '부평구')">부평구 <span
													class="study-count">({{
														regionCounts['인천']?.['부평구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '서구')">서구 <span class="study-count">({{
												regionCounts['인천']?.['서구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '연수구')">연수구 <span
													class="study-count">({{
														regionCounts['인천']?.['연수구'] || 0 }})</span></li>
											<li @click="goToStudyList('인천', '옹진군')">옹진군 <span
													class="study-count">({{
														regionCounts['인천']?.['옹진군'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('인천', '중구')">중구 <span class="study-count">({{
												regionCounts['인천']?.['중구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										부산
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('부산', '전체')">전체 <span class="study-count">({{
												regionCounts['부산']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '강서구')">강서구 <span
													class="study-count">({{
														regionCounts['부산']?.['강서구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '금정구')">금정구 <span
													class="study-count">({{
														regionCounts['부산']?.['금정구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '기장군')">기장군 <span
													class="study-count">({{
														regionCounts['부산']?.['기장군'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '남구')">남구 <span class="study-count">({{
												regionCounts['부산']?.['남구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '동구')">동구 <span class="study-count">({{
												regionCounts['부산']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '동래구')">동래구 <span
													class="study-count">({{
														regionCounts['부산']?.['동래구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '부산진구')">부산진구 <span
													class="study-count">({{
														regionCounts['부산']?.['부산진구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '북구')">북구 <span class="study-count">({{
												regionCounts['부산']?.['북구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '사상구')">사상구 <span
													class="study-count">({{
														regionCounts['부산']?.['사상구'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('부산', '사하구')">사하구 <span
													class="study-count">({{
														regionCounts['부산']?.['사하구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '서구')">서구 <span class="study-count">({{
												regionCounts['부산']?.['서구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '수영구')">수영구 <span
													class="study-count">({{
														regionCounts['부산']?.['수영구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '연제구')">연제구 <span
													class="study-count">({{
														regionCounts['부산']?.['연제구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '영도구')">영도구 <span
													class="study-count">({{
														regionCounts['부산']?.['영도구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '중구')">중구 <span class="study-count">({{
												regionCounts['부산']?.['중구'] || 0 }})</span></li>
											<li @click="goToStudyList('부산', '해운대구')">해운대구 <span
													class="study-count">({{
														regionCounts['부산']?.['해운대구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										대구
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('대구', '전체')">전체 <span class="study-count">({{
												regionCounts['대구']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '군위군')">군위군 <span
													class="study-count">({{
														regionCounts['대구']?.['군위군'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '남구')">남구 <span class="study-count">({{
												regionCounts['대구']?.['남구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '달서구')">달서구 <span
													class="study-count">({{
														regionCounts['대구']?.['달서구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '달성군')">달성군 <span
													class="study-count">({{
														regionCounts['대구']?.['달성군'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '동구')">동구 <span class="study-count">({{
												regionCounts['대구']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '북구')">북구 <span class="study-count">({{
												regionCounts['대구']?.['북구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '서구')">서구 <span class="study-count">({{
												regionCounts['대구']?.['서구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '수성구')">수성구 <span
													class="study-count">({{
														regionCounts['대구']?.['수성구'] || 0 }})</span></li>
											<li @click="goToStudyList('대구', '중구')">중구 <span class="study-count">({{
												regionCounts['대구']?.['중구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										광주
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('광주', '전체')">전체 <span class="study-count">({{
												regionCounts['광주']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('광주', '광산구')">광산구 <span
													class="study-count">({{
														regionCounts['광주']?.['광산구'] || 0 }})</span></li>
											<li @click="goToStudyList('광주', '남구')">남구 <span class="study-count">({{
												regionCounts['광주']?.['남구'] || 0 }})</span></li>
											<li @click="goToStudyList('광주', '동구')">동구 <span class="study-count">({{
												regionCounts['광주']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('광주', '북구')">북구 <span class="study-count">({{
												regionCounts['광주']?.['북구'] || 0 }})</span></li>
											<li @click="goToStudyList('광주', '서구')">서구 <span class="study-count">({{
												regionCounts['광주']?.['서구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										대전
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('대전', '전체')">전체 <span class="study-count">({{
												regionCounts['대전']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('대전', '대덕구')">대덕구 <span
													class="study-count">({{
														regionCounts['대전']?.['대덕구'] || 0 }})</span></li>
											<li @click="goToStudyList('대전', '동구')">동구 <span class="study-count">({{
												regionCounts['대전']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('대전', '서구')">서구 <span class="study-count">({{
												regionCounts['대전']?.['서구'] || 0 }})</span></li>
											<li @click="goToStudyList('대전', '유성구')">유성구 <span
													class="study-count">({{
														regionCounts['대전']?.['유성구'] || 0 }})</span></li>
											<li @click="goToStudyList('대전', '중구')">중구 <span class="study-count">({{
												regionCounts['대전']?.['중구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										울산
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('울산', '전체')">전체 <span class="study-count">({{
												regionCounts['울산']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('울산', '남구')">남구 <span class="study-count">({{
												regionCounts['울산']?.['남구'] || 0 }})</span></li>
											<li @click="goToStudyList('울산', '동구')">동구 <span class="study-count">({{
												regionCounts['울산']?.['동구'] || 0 }})</span></li>
											<li @click="goToStudyList('울산', '북구')">북구 <span class="study-count">({{
												regionCounts['울산']?.['북구'] || 0 }})</span></li>
											<li @click="goToStudyList('울산', '울주군')">울주군 <span
													class="study-count">({{
														regionCounts['울산']?.['울주군'] || 0 }})</span></li>
											<li @click="goToStudyList('울산', '중구')">중구 <span class="study-count">({{
												regionCounts['울산']?.['중구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경기
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '전체')">전체 <span class="study-count">({{
												regionCounts['경기']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '가평군')">가평군 <span
													class="study-count">({{
														regionCounts['경기']?.['가평군'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '고양시 덕양구')">고양시 덕양구 <span
													class="study-count">({{
														regionCounts['경기']?.['고양시 덕양구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '고양시 일산동구')">고양시 일산동구 <span
													class="study-count">({{
														regionCounts['경기']?.['고양시 일산동구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '고양시 일산서구')">고양시 일산서구 <span
													class="study-count">({{
														regionCounts['경기']?.['고양시 일산서구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '과천시')">과천시 <span
													class="study-count">({{
														regionCounts['경기']?.['과천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '광명시')">광명시 <span
													class="study-count">({{
														regionCounts['경기']?.['광명시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '광주시')">광주시 <span
													class="study-count">({{
														regionCounts['경기']?.['광주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '구리시')">구리시 <span
													class="study-count">({{
														regionCounts['경기']?.['구리시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '군포시')">군포시 <span
													class="study-count">({{
														regionCounts['경기']?.['군포시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '김포시')">김포시 <span
													class="study-count">({{
														regionCounts['경기']?.['김포시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '남양주시')">남양주시 <span
													class="study-count">({{
														regionCounts['경기']?.['남양주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '동두천시')">동두천시 <span
													class="study-count">({{
														regionCounts['경기']?.['동두천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '부천시')">부천시 <span
													class="study-count">({{
														regionCounts['경기']?.['부천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '성남시 분당구')">성남시 분당구 <span
													class="study-count">({{
														regionCounts['경기']?.['성남시 분당구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '성남시 수정구')">성남시 수정구 <span
													class="study-count">({{
														regionCounts['경기']?.['성남시 수정구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '성남시 중원구')">성남시 중원구 <span
													class="study-count">({{
														regionCounts['경기']?.['성남시 중원구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '수원시 권선구')">수원시 권선구 <span
													class="study-count">({{
														regionCounts['경기']?.['수원시 권선구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '수원시 장안구')">수원시 장안구 <span
													class="study-count">({{
														regionCounts['경기']?.['수원시 장안구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '수원시 팔달구')">수원시 팔달구 <span
													class="study-count">({{
														regionCounts['경기']?.['수원시 팔달구'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '수원시 영통구')">수원시 영통구 <span
													class="study-count">({{
														regionCounts['경기']?.['수원시 영통구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '시흥시')">시흥시 <span
													class="study-count">({{
														regionCounts['경기']?.['시흥시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '안산시 단원구')">안산시 단원구 <span
													class="study-count">({{
														regionCounts['경기']?.['안산시 단원구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '안산시 상록구')">안산시 상록구 <span
													class="study-count">({{
														regionCounts['경기']?.['안산시 상록구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '안성시')">안성시 <span
													class="study-count">({{
														regionCounts['경기']?.['안성시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '안양시 동안구')">안양시 동안구 <span
													class="study-count">({{
														regionCounts['경기']?.['안양시 동안구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '안양시 만안구')">안양시 만안구 <span
													class="study-count">({{
														regionCounts['경기']?.['안양시 만안구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '양주시')">양주시 <span
													class="study-count">({{
														regionCounts['경기']?.['양주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '양평군')">양평군 <span
													class="study-count">({{
														regionCounts['경기']?.['양평군'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '여주시')">여주시 <span
													class="study-count">({{
														regionCounts['경기']?.['여주시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '연천군')">연천군 <span
													class="study-count">({{
														regionCounts['경기']?.['연천군'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '오산시')">오산시 <span
													class="study-count">({{
														regionCounts['경기']?.['오산시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '용인시 기흥구')">용인시 기흥구 <span
													class="study-count">({{
														regionCounts['경기']?.['용인시 기흥구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '용인시 수지구')">용인시 수지구 <span
													class="study-count">({{
														regionCounts['경기']?.['용인시 수지구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '용인시 처인구')">용인시 처인구 <span
													class="study-count">({{
														regionCounts['경기']?.['용인시 처인구'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '의왕시')">의왕시 <span
													class="study-count">({{
														regionCounts['경기']?.['의왕시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '의정부시')">의정부시 <span
													class="study-count">({{
														regionCounts['경기']?.['의정부시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '이천시')">이천시 <span
													class="study-count">({{
														regionCounts['경기']?.['이천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '파주시')">파주시 <span
													class="study-count">({{
														regionCounts['경기']?.['파주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '평택시')">평택시 <span
													class="study-count">({{
														regionCounts['경기']?.['평택시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '포천시')">포천시 <span
													class="study-count">({{
														regionCounts['경기']?.['포천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '하남시')">하남시 <span
													class="study-count">({{
														regionCounts['경기']?.['하남시'] || 0 }})</span></li>
											<li @click="goToStudyList('경기', '화성시')">화성시 <span
													class="study-count">({{
														regionCounts['경기']?.['화성시'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										세종
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('세종', '전체')">전체 <span class="study-count">({{
												regionCounts['세종']?.['전체'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										충남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충남', '전체')">전체 <span class="study-count">({{
												regionCounts['충남']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '공주시')">공주시 <span
													class="study-count">({{
														regionCounts['충남']?.['공주시'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '금산군')">금산군 <span
													class="study-count">({{
														regionCounts['충남']?.['금산군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '논산시')">논산시 <span
													class="study-count">({{
														regionCounts['충남']?.['논산시'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '당진시')">당진시 <span
													class="study-count">({{
														regionCounts['충남']?.['당진시'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '보령시')">보령시 <span
													class="study-count">({{
														regionCounts['충남']?.['보령시'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '부여군')">부여군 <span
													class="study-count">({{
														regionCounts['충남']?.['부여군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '서산시')">서산시 <span
													class="study-count">({{
														regionCounts['충남']?.['서산시'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '서천군')">서천군 <span
													class="study-count">({{
														regionCounts['충남']?.['서천군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '아산시')">아산시 <span
													class="study-count">({{
														regionCounts['충남']?.['아산시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충남', '예산군')">예산군 <span
													class="study-count">({{
														regionCounts['충남']?.['예산군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '천안시 동남구')">천안시 동남구 <span
													class="study-count">({{
														regionCounts['충남']?.['천안시 동남구'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '천안시 서북구')">천안시 서북구 <span
													class="study-count">({{
														regionCounts['충남']?.['천안시 서북구'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '청양군')">청양군 <span
													class="study-count">({{
														regionCounts['충남']?.['청양군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '태안군')">태안군 <span
													class="study-count">({{
														regionCounts['충남']?.['태안군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '홍성군')">홍성군 <span
													class="study-count">({{
														regionCounts['충남']?.['홍성군'] || 0 }})</span></li>
											<li @click="goToStudyList('충남', '계룡시')">계룡시 <span
													class="study-count">({{
														regionCounts['충남']?.['계룡시'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										충북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충북', '전체')">전체 <span class="study-count">({{
												regionCounts['충북']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '괴산군')">괴산군 <span
													class="study-count">({{
														regionCounts['충북']?.['괴산군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '단양군')">단양군 <span
													class="study-count">({{
														regionCounts['충북']?.['단양군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '보은군')">보은군 <span
													class="study-count">({{
														regionCounts['충북']?.['보은군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '영동군')">영동군 <span
													class="study-count">({{
														regionCounts['충북']?.['영동군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '옥천군')">옥천군 <span
													class="study-count">({{
														regionCounts['충북']?.['옥천군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '음성군')">음성군 <span
													class="study-count">({{
														regionCounts['충북']?.['음성군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '제천시')">제천시 <span
													class="study-count">({{
														regionCounts['충북']?.['제천시'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '진천군')">진천군 <span
													class="study-count">({{
														regionCounts['충북']?.['진천군'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '청주시 청원구')">청주시 청원구 <span
													class="study-count">({{
														regionCounts['충북']?.['청주시 청원구'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충북', '청주시 상당구')">청주시 상당구 <span
													class="study-count">({{
														regionCounts['충북']?.['청주시 상당구'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '청주시 서원구')">청주시 서원구 <span
													class="study-count">({{
														regionCounts['충북']?.['청주시 서원구'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '청주시 흥덕구')">청주시 흥덕구 <span
													class="study-count">({{
														regionCounts['충북']?.['청주시 흥덕구'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '충주시')">충주시 <span
													class="study-count">({{
														regionCounts['충북']?.['충주시'] || 0 }})</span></li>
											<li @click="goToStudyList('충북', '증평군')">증평군 <span
													class="study-count">({{
														regionCounts['충북']?.['증평군'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '전체')">전체 <span class="study-count">({{
												regionCounts['경남']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '거제시')">거제시 <span
													class="study-count">({{
														regionCounts['경남']?.['거제시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '거창군')">거창군 <span
													class="study-count">({{
														regionCounts['경남']?.['거창군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '고성군')">고성군 <span
													class="study-count">({{
														regionCounts['경남']?.['고성군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '김해시')">김해시 <span
													class="study-count">({{
														regionCounts['경남']?.['김해시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '남해군')">남해군 <span
													class="study-count">({{
														regionCounts['경남']?.['남해군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '밀양시')">밀양시 <span
													class="study-count">({{
														regionCounts['경남']?.['밀양시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '사천시')">사천시 <span
													class="study-count">({{
														regionCounts['경남']?.['사천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '산청군')">산청군 <span
													class="study-count">({{
														regionCounts['경남']?.['산청군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '양산시')">양산시 <span
													class="study-count">({{
														regionCounts['경남']?.['양산시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '의령군')">의령군 <span
													class="study-count">({{
														regionCounts['경남']?.['의령군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '진주시')">진주시 <span
													class="study-count">({{
														regionCounts['경남']?.['진주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '창녕군')">창녕군 <span
													class="study-count">({{
														regionCounts['경남']?.['창녕군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '창원시 마산합포구')">창원시 마산합포구 <span
													class="study-count">({{ regionCounts['경남']?.['창원시 마산합포구'] || 0
													}})</span>
											</li>
											<li @click="goToStudyList('경남', '창원시 마산회원구')">창원시 마산회원구 <span
													class="study-count">({{ regionCounts['경남']?.['창원시 마산회원구'] || 0
													}})</span>
											</li>
											<li @click="goToStudyList('경남', '창원시 성산구')">창원시 성산구 <span
													class="study-count">({{
														regionCounts['경남']?.['창원시 성산구'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '창원시 의창구')">창원시 의창구 <span
													class="study-count">({{
														regionCounts['경남']?.['창원시 의창구'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '창원시 진해구')">창원시 진해구 <span
													class="study-count">({{
														regionCounts['경남']?.['창원시 진해구'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '통영시')">통영시 <span
													class="study-count">({{
														regionCounts['경남']?.['통영시'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '하동군')">하동군 <span
													class="study-count">({{
														regionCounts['경남']?.['하동군'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '함안군')">함안군 <span
													class="study-count">({{
														regionCounts['경남']?.['함안군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '함양군')">함양군 <span
													class="study-count">({{
														regionCounts['경남']?.['함양군'] || 0 }})</span></li>
											<li @click="goToStudyList('경남', '합천군')">합천군 <span
													class="study-count">({{
														regionCounts['경남']?.['합천군'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경북', '전체')">전체 <span class="study-count">({{
												regionCounts['경북']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '경산시')">경산시 <span
													class="study-count">({{
														regionCounts['경북']?.['경산시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '경주시')">경주시 <span
													class="study-count">({{
														regionCounts['경북']?.['경주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '고령군')">고령군 <span
													class="study-count">({{
														regionCounts['경북']?.['고령군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '구미시')">구미시 <span
													class="study-count">({{
														regionCounts['경북']?.['구미시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '김천시')">김천시 <span
													class="study-count">({{
														regionCounts['경북']?.['김천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '문경시')">문경시 <span
													class="study-count">({{
														regionCounts['경북']?.['문경시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '봉화군')">봉화군 <span
													class="study-count">({{
														regionCounts['경북']?.['봉화군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '상주시')">상주시 <span
													class="study-count">({{
														regionCounts['경북']?.['상주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '성주군')">성주군 <span
													class="study-count">({{
														regionCounts['경북']?.['성주군'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경북', '안동시')">안동시 <span
													class="study-count">({{
														regionCounts['경북']?.['안동시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '영덕군')">영덕군 <span
													class="study-count">({{
														regionCounts['경북']?.['영덕군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '영양군')">영양군 <span
													class="study-count">({{
														regionCounts['경북']?.['영양군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '영주시')">영주시 <span
													class="study-count">({{
														regionCounts['경북']?.['영주시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '영천시')">영천시 <span
													class="study-count">({{
														regionCounts['경북']?.['영천시'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '예천군')">예천군 <span
													class="study-count">({{
														regionCounts['경북']?.['예천군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '을릉군')">을릉군 <span
													class="study-count">({{
														regionCounts['경북']?.['을릉군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '울진군')">울진군 <span
													class="study-count">({{
														regionCounts['경북']?.['울진군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '의성군')">의성군 <span
													class="study-count">({{
														regionCounts['경북']?.['의성군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '청도군')">청도군 <span
													class="study-count">({{
														regionCounts['경북']?.['청도군'] || 0 }})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경북', '청송군')">청송군 <span
													class="study-count">({{
														regionCounts['경북']?.['청송군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '칠곡군')">칠곡군 <span
													class="study-count">({{
														regionCounts['경북']?.['칠곡군'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '포항시 남구')">포항시 남구 <span
													class="study-count">({{
														regionCounts['경북']?.['포항시 남구'] || 0 }})</span></li>
											<li @click="goToStudyList('경북', '포항시 북구')">포항시 북구 <span
													class="study-count">({{
														regionCounts['경북']?.['포항시 북구'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										전남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전남', '전체')">전체 <span class="study-count">({{
												regionCounts['전남']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '강진군')">강진군 <span
													class="study-count">({{
														regionCounts['전남']?.['강진군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '고흥군')">고흥군 <span
													class="study-count">({{
														regionCounts['전남']?.['고흥군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '곡성군')">곡성군 <span
													class="study-count">({{
														regionCounts['전남']?.['곡성군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '광양시')">광양시 <span
													class="study-count">({{
														regionCounts['전남']?.['광양시'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '구례군')">구례군 <span
													class="study-count">({{
														regionCounts['전남']?.['구례군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '나주시')">나주시 <span
													class="study-count">({{
														regionCounts['전남']?.['나주시'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '담양군')">담양군 <span
													class="study-count">({{
														regionCounts['전남']?.['담양군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '목포시')">목포시 <span
													class="study-count">({{
														regionCounts['전남']?.['목포시'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '무안군')">무안군 <span
													class="study-count">({{
														regionCounts['전남']?.['무안군'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전남', '보성군')">보성군 <span
													class="study-count">({{
														regionCounts['전남']?.['보성군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '순천시')">순천시 <span
													class="study-count">({{
														regionCounts['전남']?.['순천시'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '신안군')">신안군 <span
													class="study-count">({{
														regionCounts['전남']?.['신안군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '여수시')">여수시 <span
													class="study-count">({{
														regionCounts['전남']?.['여수시'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '영광군')">영광군 <span
													class="study-count">({{
														regionCounts['전남']?.['영광군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '영암군')">영암군 <span
													class="study-count">({{
														regionCounts['전남']?.['영암군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '완도군')">완도군 <span
													class="study-count">({{
														regionCounts['전남']?.['완도군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '장성군')">장성군 <span
													class="study-count">({{
														regionCounts['전남']?.['장성군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '장흥군')">장흥군 <span
													class="study-count">({{
														regionCounts['전남']?.['장흥군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '진도군')">진도군 <span
													class="study-count">({{
														regionCounts['전남']?.['진도군'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전남', '함평군')">함평군 <span
													class="study-count">({{
														regionCounts['전남']?.['함평군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '해남군')">해남군 <span
													class="study-count">({{
														regionCounts['전남']?.['해남군'] || 0 }})</span></li>
											<li @click="goToStudyList('전남', '화순군')">화순군 <span
													class="study-count">({{
														regionCounts['전남']?.['화순군'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										전북
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전북', '전체')">전체 <span class="study-count">({{
												regionCounts['전북']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '고창군')">고창군 <span
													class="study-count">({{
														regionCounts['전북']?.['고창군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '군산시')">군산시 <span
													class="study-count">({{
														regionCounts['전북']?.['군산시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '김제시')">김제시 <span
													class="study-count">({{
														regionCounts['전북']?.['김제시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '남원시')">남원시 <span
													class="study-count">({{
														regionCounts['전북']?.['남원시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '무주군')">무주군 <span
													class="study-count">({{
														regionCounts['전북']?.['무주군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '부안군')">부안군 <span
													class="study-count">({{
														regionCounts['전북']?.['부안군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '순창군')">순창군 <span
													class="study-count">({{
														regionCounts['전북']?.['순창군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '완주군')">완주군 <span
													class="study-count">({{
														regionCounts['전북']?.['완주군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '익산시')">익산시 <span
													class="study-count">({{
														regionCounts['전북']?.['익산시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '임실군')">임실군 <span
													class="study-count">({{
														regionCounts['전북']?.['임실군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '장수군')">장수군 <span
													class="study-count">({{
														regionCounts['전북']?.['장수군'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '전주시')">전주시 <span
													class="study-count">({{
														regionCounts['전북']?.['전주시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '정읍시')">정읍시 <span
													class="study-count">({{
														regionCounts['전북']?.['정읍시'] || 0 }})</span></li>
											<li @click="goToStudyList('전북', '진안군')">진안군 <span
													class="study-count">({{
														regionCounts['전북']?.['진안군'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										강원
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('강원', '전체')">전체 <span class="study-count">({{
												regionCounts['강원']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '강릉시')">강릉시 <span
													class="study-count">({{
														regionCounts['강원']?.['강릉시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '고성군')">고성군 <span
													class="study-count">({{
														regionCounts['강원']?.['고성군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '동해시')">동해시 <span
													class="study-count">({{
														regionCounts['강원']?.['동해시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '삼척시')">삼척시 <span
													class="study-count">({{
														regionCounts['강원']?.['삼척시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '속초시')">속초시 <span
													class="study-count">({{
														regionCounts['강원']?.['속초시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '양구군')">양구군 <span
													class="study-count">({{
														regionCounts['강원']?.['양구군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '양양군')">양양군 <span
													class="study-count">({{
														regionCounts['강원']?.['양양군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '영월군')">영월군 <span
													class="study-count">({{
														regionCounts['강원']?.['영월군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '원주시')">원주시 <span
													class="study-count">({{
														regionCounts['강원']?.['원주시'] || 0 }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('강원', '인제군')">인제군 <span
													class="study-count">({{
														regionCounts['강원']?.['인제군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '정선군')">정선군 <span
													class="study-count">({{
														regionCounts['강원']?.['정선군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '철원군')">철원군 <span
													class="study-count">({{
														regionCounts['강원']?.['철원군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '춘천시')">춘천시 <span
													class="study-count">({{
														regionCounts['강원']?.['춘천시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '태백시')">태백시 <span
													class="study-count">({{
														regionCounts['강원']?.['태백시'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '평창군')">평창군 <span
													class="study-count">({{
														regionCounts['강원']?.['평창군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '홍천군')">홍천군 <span
													class="study-count">({{
														regionCounts['강원']?.['홍천군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '화천군')">화천군 <span
													class="study-count">({{
														regionCounts['강원']?.['화천군'] || 0 }})</span></li>
											<li @click="goToStudyList('강원', '횡성군')">횡성군 <span
													class="study-count">({{
														regionCounts['강원']?.['횡성군'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										제주
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('제주', '전체')">전체 <span class="study-count">({{
												regionCounts['제주']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('제주', '서귀포시')">서귀포시 <span
													class="study-count">({{
														regionCounts['제주']?.['서귀포시'] || 0 }})</span></li>
											<li @click="goToStudyList('제주', '제주시')">제주시 <span
													class="study-count">({{
														regionCounts['제주']?.['제주시'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							학습자별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">중등</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('중등', '전체')">전체 <span class="study-count">({{
												regionCounts['중등']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('중등', '1학년')">1학년 <span
													class="study-count">({{
														regionCounts['중등']?.['1학년'] || 0 }})</span></li>
											<li @click="goToStudyList('중등', '2학년')">2학년 <span
													class="study-count">({{
														regionCounts['중등']?.['2학년'] || 0 }})</span></li>
											<li @click="goToStudyList('중등', '3학년')">3학년 <span
													class="study-count">({{
														regionCounts['중등']?.['3학년'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">고등</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('고등', '전체')">전체 <span class="study-count">({{
												regionCounts['고등']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('고등', '1학년')">1학년 <span
													class="study-count">({{
														regionCounts['고등']?.['1학년'] || 0 }})</span></li>
											<li @click="goToStudyList('고등', '2학년')">2학년 <span
													class="study-count">({{
														regionCounts['고등']?.['2학년'] || 0 }})</span></li>
											<li @click="goToStudyList('고등', '3학년')">3학년 <span
													class="study-count">({{
														regionCounts['고등']?.['3학년'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">대학/청년</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('대학/청년', '대학생')">대학생 <span
													class="study-count">({{
														regionCounts['대학/청년']?.['대학생'] || 0 }})</span></li>
											<li @click="goToStudyList('대학/청년', '청년')">청년 <span
													class="study-count">({{
														regionCounts['대학/청년']?.['청년'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">취업준비/수험</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('취업준비/수험', '취업준비생')">취업준비생 <span
													class="study-count">({{
														regionCounts['취업준비/수험']?.['취업준비생'] || 0 }})</span></li>
											<li @click="goToStudyList('취업준비/수험', '수험생')">수험생 <span
													class="study-count">({{
														regionCounts['취업준비/수험']?.['수험생'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">경력/이직</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경력/이직', '경력')">경력 <span
													class="study-count">({{
														regionCounts['경력/이직']?.['경력'] || 0 }})</span></li>
											<li @click="goToStudyList('경력/이직', '이직')">이직 <span
													class="study-count">({{
														regionCounts['경력/이직']?.['이직'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">취미/자기계발</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('취미/자기계발', '취미')">취미 <span
													class="study-count">({{
														regionCounts['취미/자기계발']?.['취미'] || 0 }})</span></li>
											<li @click="goToStudyList('취미/자기계발', '자기계발')">자기계발 <span
													class="study-count">({{
														regionCounts['취미/자기계발']?.['자기계발'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							전공별
							<ul class="sub-menu">
								<li class="sub-menu-item category">
									<div class="category-name">전체</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '전체')">전체 <span class="study-count">({{
												regionCounts['전공']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '인문계열')">인문계열 <span
													class="study-count">({{
														regionCounts['전공']?.['인문계열'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '사회계열')">사회계열 <span
													class="study-count">({{
														regionCounts['전공']?.['사회계열'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '자연계열')">자연계열 <span
													class="study-count">({{
														regionCounts['전공']?.['자연계열'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '공학계열')">공학계열 <span
													class="study-count">({{
														regionCounts['전공']?.['공학계열'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '예체능계열')">예체능계열 <span
													class="study-count">({{
														regionCounts['전공']?.['예체능계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										인문계열
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '전체')">전체 <span class="study-count">({{
												regionCounts['전공']?.['전체'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '국어국문학')">국어국문학 <span
													class="study-count">({{
														regionCounts['전공']?.['국어국문학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '영어영문학')">영어영문학 <span
													class="study-count">({{
														regionCounts['전공']?.['영어영문학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '철학')">철학 <span class="study-count">({{
												regionCounts['전공']?.['철학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '사학')">사학 <span class="study-count">({{
												regionCounts['전공']?.['사학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기타 인문계열')">기타 인문계열 <span
													class="study-count">({{
														regionCounts['전공']?.['기타 인문계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										사회계열
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '경영학')">경영학 <span
													class="study-count">({{
														regionCounts['전공']?.['경영학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '경제학')">경제학 <span
													class="study-count">({{
														regionCounts['전공']?.['경제학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '법학')">법학 <span class="study-count">({{
												regionCounts['전공']?.['법학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '행정학')">행정학 <span
													class="study-count">({{
														regionCounts['전공']?.['행정학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '교육학')">교육학 <span
													class="study-count">({{
														regionCounts['전공']?.['교육학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기타 사회계열')">기타 사회계열 <span
													class="study-count">({{
														regionCounts['전공']?.['기타 사회계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										자연계열
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '수학')">수학 <span class="study-count">({{
												regionCounts['전공']?.['수학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '물리학')">물리학 <span
													class="study-count">({{
														regionCounts['전공']?.['물리학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '화학')">화학 <span class="study-count">({{
												regionCounts['전공']?.['화학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '생물학')">생물학 <span
													class="study-count">({{
														regionCounts['전공']?.['생물학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '지구과학')">지구과학 <span
													class="study-count">({{
														regionCounts['전공']?.['지구과학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기타 자연계열')">기타 자연계열 <span
													class="study-count">({{
														regionCounts['전공']?.['기타 자연계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										공학계열
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '컴퓨터공학')">컴퓨터공학 <span
													class="study-count">({{
														regionCounts['전공']?.['컴퓨터공학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '전기전자공학')">전기전자공학 <span
													class="study-count">({{
														regionCounts['전공']?.['전기전자공학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기계공학')">기계공학 <span
													class="study-count">({{
														regionCounts['전공']?.['기계공학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '화학공학')">화학공학 <span
													class="study-count">({{
														regionCounts['전공']?.['화학공학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '건축공학')">건축공학 <span
													class="study-count">({{
														regionCounts['전공']?.['건축공학'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기타 공학계열')">기타 공학계열 <span
													class="study-count">({{
														regionCounts['전공']?.['기타 공학계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item category">
									<div class="category-name">
										예체능계열
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전공', '음악')">음악 <span class="study-count">({{
												regionCounts['전공']?.['음악'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '미술')">미술 <span class="study-count">({{
												regionCounts['전공']?.['미술'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '체육')">체육 <span class="study-count">({{
												regionCounts['전공']?.['체육'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '디자인')">디자인 <span
													class="study-count">({{
														regionCounts['전공']?.['디자인'] || 0 }})</span></li>
											<li @click="goToStudyList('전공', '기타 예체능계열')">기타 예체능계열 <span
													class="study-count">({{
														regionCounts['전공']?.['기타 예체능계열'] || 0 }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							<span>커뮤니티</span>
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
						<li class="menu-item">
							<router-link to="/customer-service" class="menu-link">고객센터</router-link>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios, { AxiosError } from 'axios';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';

declare global {
	interface Window {
		innerWidth: number;
		addEventListener: typeof addEventListener;
		localStorage: {
			getItem(key: string): string | null;
			setItem(key: string, value: string): void;
			removeItem(key: string): void;
		};
	}
}

type RegionCounts = {
	[key: string]: {
		[key: string]: number;
	};
};

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const isLoggedIn = ref(false);
const userNickname = ref('');
const regionCounts = ref<RegionCounts>({});
const isMobile = ref(false);

const updateMobileStatus = () => {
	isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
	updateMobileStatus();
	window.addEventListener('resize', updateMobileStatus);
	checkLoginStatus();
	fetchStudyGroupCounts();
});

const goToStudyList = (mainRegion: string, subRegion: string) => {
	let mainCategory: string;
	let subCategory: string;
	let detailCategory: string | undefined;

	if (mainRegion === '전공') {
		mainCategory = '전공별';
		subCategory = mainRegion;
		detailCategory = subRegion;
	} else if (['중등', '고등', '대학/청년', '취업준비/수험', '경력/이직', '취미/자기계발'].includes(mainRegion)) {
		mainCategory = '학습자별';
		subCategory = mainRegion;
		detailCategory = subRegion;
	} else {
		mainCategory = '지역별';
		subCategory = mainRegion;
		detailCategory = subRegion === '전체' ? undefined : subRegion;
	}

	router.push({
		name: 'StudyGroupList',
		query: {
			mainCategory,
			subCategory,
			detailCategory
		}
	});
};

const checkLoginStatus = async () => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		try {
			const response = await axios.get('http://localhost:3000/users/profile', {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			userStore.setUser(response.data);
			isLoggedIn.value = true;
			userNickname.value = response.data.nickname;
		} catch (error: unknown) {
			console.error('프로필 조회 실패:', error);
			if (error instanceof AxiosError && error.response?.status === 401) {
				logout();
			}
		}
	} else {
		userStore.setUser(null);
		isLoggedIn.value = false;
		userNickname.value = '';
	}
};

const logout = () => {
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	userStore.setUser(null);
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

watch(() => route.path, () => {
	checkLoginStatus();
});
</script>

<script lang="ts">
export default {
	// eslint-disable-next-line vue/multi-word-component-names
	name: 'Header'
}
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
	background-color: #4A90E2;
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
	cursor: default;
	/* 대분류 클릭 비활성화 */
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
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.sub-menu-item:hover {
	background-color: #f8f9fa;
	color: #4A90E2;
}

.sub-sub-menu {
	display: none;
	position: absolute;
	left: 100%;
	top: 0;
	background-color: #fff;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	border-radius: 4px;
	min-width: 400px;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.3s ease, visibility 0.3s ease;
	z-index: 1001;
}

.sub-menu-item:hover>.sub-sub-menu {
	display: flex;
	opacity: 1;
	visibility: visible;
}

.sub-sub-menu-column {
	min-width: 40px;
	width: 200px;
	/* 각 컬럼의 너비도 늘림 */
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
	cursor: pointer;
	/* 소분류만 클릭 가능 */
}

.sub-sub-menu-column li:hover {
	background-color: #f8f9fa;
	color: #4A90E2;
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

.sub-menu-item.region,
.sub-menu-item.category {
	cursor: default;
}

.region-name,
.category-name {
	flex: 1;
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

.menu-link {
	color: #fff;
	text-decoration: none;
}

.menu-link:hover {
	color: #1a365d;
}

/* 소분류 항목은 클릭 가능하도록 설정 */
.sub-sub-menu li {
	cursor: pointer;
	pointer-events: auto;
}

.nav-link {
	font-size: 18px;  /* 폰트 크기 증가 */
	font-weight: 600;  /* 폰트 굵기 증가 */
	text-decoration: none;
	color: inherit;
}

.nav-link i {
	margin-right: 5px;
}
</style>
