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
					<div class="auth-container">
						<template v-if="isLoggedIn">
							<span class="welcome-text">{{ userNickname }}님, 환영합니다</span>
							<div class="nav-buttons">
								<router-link to="/my-studies" class="nav-button">
									<i class="fas fa-book-reader"></i>
									내 스터디
								</router-link>
								<router-link to="/profile" class="nav-button">
									<i class="fas fa-user"></i>
									프로필
								</router-link>
							</div>
							<button @click="logout" class="logout-button">
								<i class="fas fa-sign-out-alt"></i>
								로그아웃
							</button>
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
							<span>지역별</span>
							<ul class="sub-menu">
								<li class="sub-menu-item region">
									<div class="region-name">
										서울
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '전체')">전체 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '전체') }})</span></li>
											<li @click="goToStudyList('서울', '강남구')">강남구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '강남구') }})</span></li>
											<li @click="goToStudyList('서울', '강동구')">강동구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '강동구') }})</span></li>
											<li @click="goToStudyList('서울', '강북구')">강북구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '강북구') }})</span></li>
											<li @click="goToStudyList('서울', '강서구')">강서구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '강서구') }})</span></li>
											<li @click="goToStudyList('서울', '관악구')">관악구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '관악구') }})</span></li>
											<li @click="goToStudyList('서울', '광진구')">광진구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '광진구') }})</span></li>
											<li @click="goToStudyList('서울', '구로구')">구로구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '구로구') }})</span></li>
											<li @click="goToStudyList('서울', '금천구')">금천구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '금천구') }})</span></li>
											<li @click="goToStudyList('서울', '노원구')">노원구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '노원구') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '도봉구')">도봉구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '도봉구') }})</span></li>
											<li @click="goToStudyList('서울', '동대문구')">동대문구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '동대문구') }})</span></li>
											<li @click="goToStudyList('서울', '동작구')">동작구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '동작구') }})</span></li>
											<li @click="goToStudyList('서울', '마포구')">마포구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '마포구') }})</span></li>
											<li @click="goToStudyList('서울', '서대문구')">서대문구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '서대문구') }})</span></li>
											<li @click="goToStudyList('서울', '서초구')">서초구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '서초구') }})</span></li>
											<li @click="goToStudyList('서울', '성동구')">성동구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '성동구') }})</span></li>
											<li @click="goToStudyList('서울', '성북구')">성북구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '성북구') }})</span></li>
											<li @click="goToStudyList('서울', '송파구')">송파구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '송파구') }})</span></li>
											<li @click="goToStudyList('서울', '양천구')">양천구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '양천구') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('서울', '영등포구')">영등포구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '영등포구') }})</span></li>
											<li @click="goToStudyList('서울', '용산구')">용산구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '용산구') }})</span></li>
											<li @click="goToStudyList('서울', '은평구')">은평구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '은평구') }})</span></li>
											<li @click="goToStudyList('서울', '종로구')">종로구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '종로구') }})</span></li>
											<li @click="goToStudyList('서울', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '중구') }})</span></li>
											<li @click="goToStudyList('서울', '중랑구')">중랑구 <span class="study-count">({{
												getCategoryCount('지역별', '서울', '중랑구') }})</span></li>
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
												getCategoryCount('지역별', '인천', '전체') }})</span></li>
											<li @click="goToStudyList('인천', '강화군')">강화군 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '강화군') }})</span></li>
											<li @click="goToStudyList('인천', '계양구')">계양구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '계양구') }})</span></li>
											<li @click="goToStudyList('인천', '남동구')">남동구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '남동구') }})</span></li>
											<li @click="goToStudyList('인천', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '동구') }})</span></li>
											<li @click="goToStudyList('인천', '미추홀구')">미추홀구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '미추홀구') }})</span></li>
											<li @click="goToStudyList('인천', '부평구')">부평구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '부평구') }})</span></li>
											<li @click="goToStudyList('인천', '서구')">서구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '서구') }})</span></li>
											<li @click="goToStudyList('인천', '연수구')">연수구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '연수구') }})</span></li>
											<li @click="goToStudyList('인천', '옹진군')">옹진군 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '옹진군') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('인천', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '인천', '중구') }})</span></li>
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
												getCategoryCount('지역별', '부산', '전체') }})</span></li>
											<li @click="goToStudyList('부산', '강서구')">강서구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '강서구') }})</span></li>
											<li @click="goToStudyList('부산', '금정구')">금정구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '금정구') }})</span></li>
											<li @click="goToStudyList('부산', '기장군')">기장군 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '기장군') }})</span></li>
											<li @click="goToStudyList('부산', '남구')">남구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '남구') }})</span></li>
											<li @click="goToStudyList('부산', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '동구') }})</span></li>
											<li @click="goToStudyList('부산', '동래구')">동래구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '동래구') }})</span></li>
											<li @click="goToStudyList('부산', '부산진구')">부산진구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '부산진구') }})</span></li>
											<li @click="goToStudyList('부산', '북구')">북구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '북구') }})</span></li>
											<li @click="goToStudyList('부산', '사상구')">사상구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '사상구') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('부산', '사하구')">사하구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '사하구') }})</span></li>
											<li @click="goToStudyList('부산', '서구')">서구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '서구') }})</span></li>
											<li @click="goToStudyList('부산', '수영구')">수영구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '수영구') }})</span></li>
											<li @click="goToStudyList('부산', '연제구')">연제구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '연제구') }})</span></li>
											<li @click="goToStudyList('부산', '영도구')">영도구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '영도구') }})</span></li>
											<li @click="goToStudyList('부산', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '중구') }})</span></li>
											<li @click="goToStudyList('부산', '해운대구')">해운대구 <span class="study-count">({{
												getCategoryCount('지역별', '부산', '해운대구') }})</span></li>
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
												getCategoryCount('지역별', '대구', '전체') }})</span></li>
											<li @click="goToStudyList('대구', '군위군')">군위군 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '군위군') }})</span></li>
											<li @click="goToStudyList('대구', '남구')">남구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '남구') }})</span></li>
											<li @click="goToStudyList('대구', '달서구')">달서구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '달서구') }})</span></li>
											<li @click="goToStudyList('대구', '달성군')">달성군 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '달성군') }})</span></li>
											<li @click="goToStudyList('대구', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '동구') }})</span></li>
											<li @click="goToStudyList('대구', '북구')">북구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '북구') }})</span></li>
											<li @click="goToStudyList('대구', '서구')">서구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '서구') }})</span></li>
											<li @click="goToStudyList('대구', '수성구')">수성구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '수성구') }})</span></li>
											<li @click="goToStudyList('대구', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '대구', '중구') }})</span></li>
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
												getCategoryCount('지역별', '광주', '전체') }})</span></li>
											<li @click="goToStudyList('광주', '광산구')">광산구 <span class="study-count">({{
												getCategoryCount('지역별', '광주', '광산구') }})</span></li>
											<li @click="goToStudyList('광주', '남구')">남구 <span class="study-count">({{
												getCategoryCount('지역별', '광주', '남구') }})</span></li>
											<li @click="goToStudyList('광주', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '광주', '동구') }})</span></li>
											<li @click="goToStudyList('광주', '북구')">북구 <span class="study-count">({{
												getCategoryCount('지역별', '광주', '북구') }})</span></li>
											<li @click="goToStudyList('광주', '서구')">서구 <span class="study-count">({{
												getCategoryCount('지역별', '광주', '서구') }})</span></li>
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
												getCategoryCount('지역별', '대전', '전체') }})</span></li>
											<li @click="goToStudyList('대전', '대덕구')">대덕구 <span class="study-count">({{
												getCategoryCount('지역별', '대전', '대덕구') }})</span></li>
											<li @click="goToStudyList('대전', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '대전', '동구') }})</span></li>
											<li @click="goToStudyList('대전', '서구')">서구 <span class="study-count">({{
												getCategoryCount('지역별', '대전', '서구') }})</span></li>
											<li @click="goToStudyList('대전', '유성구')">유성구 <span class="study-count">({{
												getCategoryCount('지역별', '대전', '유성구') }})</span></li>
											<li @click="goToStudyList('대전', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '대전', '중구') }})</span></li>
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
												getCategoryCount('지역별', '울산', '전체') }})</span></li>
											<li @click="goToStudyList('울산', '남구')">남구 <span class="study-count">({{
												getCategoryCount('지역별', '울산', '남구') }})</span></li>
											<li @click="goToStudyList('울산', '동구')">동구 <span class="study-count">({{
												getCategoryCount('지역별', '울산', '동구') }})</span></li>
											<li @click="goToStudyList('울산', '북구')">북구 <span class="study-count">({{
												getCategoryCount('지역별', '울산', '북구') }})</span></li>
											<li @click="goToStudyList('울산', '울주군')">울주군 <span class="study-count">({{
												getCategoryCount('지역별', '울산', '울주군') }})</span></li>
											<li @click="goToStudyList('울산', '중구')">중구 <span class="study-count">({{
												getCategoryCount('지역별', '울산', '중구') }})</span></li>
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
												getCategoryCount('지역별', '경기', '전체') }})</span></li>
											<li @click="goToStudyList('경기', '가평군')">가평군 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '가평군') }})</span></li>
											<li @click="goToStudyList('경기', '고양시 덕양구')">고양시 덕양구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '고양시 덕양구') }})</span></li>
											<li @click="goToStudyList('경기', '고양시 일산동구')">고양시 일산동구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '고양시 일산동구') }})</span></li>
											<li @click="goToStudyList('경기', '고양시 일산서구')">고양시 일산서구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '고양시 일산서구') }})</span></li>
											<li @click="goToStudyList('경기', '과천시')">과천시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '과천시') }})</span></li>
											<li @click="goToStudyList('경기', '광명시')">광명시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '광명시') }})</span></li>
											<li @click="goToStudyList('경기', '광주시')">광주시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '광주시') }})</span></li>
											<li @click="goToStudyList('경기', '구리시')">구리시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '구리시') }})</span></li>
											<li @click="goToStudyList('경기', '군포시')">군포시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '군포시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '김포시')">김포시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '김포시') }})</span></li>
											<li @click="goToStudyList('경기', '남양주시')">남양주시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '남양주시') }})</span></li>
											<li @click="goToStudyList('경기', '동두천시')">동두천시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '동두천시') }})</span></li>
											<li @click="goToStudyList('경기', '부천시')">부천시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '부천시') }})</span></li>
											<li @click="goToStudyList('경기', '성남시 분당구')">성남시 분당구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '성남시 분당구') }})</span></li>
											<li @click="goToStudyList('경기', '성남시 수정구')">성남시 수정구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '성남시 수정구') }})</span></li>
											<li @click="goToStudyList('경기', '성남시 중원구')">성남시 중원구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '성남시 중원구') }})</span></li>
											<li @click="goToStudyList('경기', '수원시 권선구')">수원시 권선구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '수원시 권선구') }})</span></li>
											<li @click="goToStudyList('경기', '수원시 장안구')">수원시 장안구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '수원시 장안구') }})</span></li>
											<li @click="goToStudyList('경기', '수원시 팔달구')">수원시 팔달구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '수원시 팔달구') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '수원시 영통구')">수원시 영통구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '수원시 영통구') }})</span></li>
											<li @click="goToStudyList('경기', '시흥시')">시흥시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '시흥시') }})</span></li>
											<li @click="goToStudyList('경기', '안산시 단원구')">안산시 단원구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '안산시 단원구') }})</span></li>
											<li @click="goToStudyList('경기', '안산시 상록구')">안산시 상록구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '안산시 상록구') }})</span></li>
											<li @click="goToStudyList('경기', '안성시')">안성시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '안성시') }})</span></li>
											<li @click="goToStudyList('경기', '안양시 동안구')">안양시 동안구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '안양시 동안구') }})</span></li>
											<li @click="goToStudyList('경기', '안양시 만안구')">안양시 만안구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '안양시 만안구') }})</span></li>
											<li @click="goToStudyList('경기', '양주시')">양주시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '양주시') }})</span></li>
											<li @click="goToStudyList('경기', '양평군')">양평군 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '양평군') }})</span></li>
											<li @click="goToStudyList('경기', '여주시')">여주시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '여주시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '연천군')">연천군 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '연천군') }})</span></li>
											<li @click="goToStudyList('경기', '오산시')">오산시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '오산시') }})</span></li>
											<li @click="goToStudyList('경기', '용인시 기흥구')">용인시 기흥구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '용인시 기흥구') }})</span></li>
											<li @click="goToStudyList('경기', '용인시 수지구')">용인시 수지구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '용인시 수지구') }})</span></li>
											<li @click="goToStudyList('경기', '용인시 처인구')">용인시 처인구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경기', '용인시 처인구') }})</span></li>
											<li @click="goToStudyList('경기', '의왕시')">의왕시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '의왕시') }})</span></li>
											<li @click="goToStudyList('경기', '의정부시')">의정부시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '의정부시') }})</span></li>
											<li @click="goToStudyList('경기', '이천시')">이천시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '이천시') }})</span></li>
											<li @click="goToStudyList('경기', '파주시')">파주시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '파주시') }})</span></li>
											<li @click="goToStudyList('경기', '평택시')">평택시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '평택시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경기', '포천시')">포천시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '포천시') }})</span></li>
											<li @click="goToStudyList('경기', '하남시')">하남시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '하남시') }})</span></li>
											<li @click="goToStudyList('경기', '화성시')">화성시 <span class="study-count">({{
												getCategoryCount('지역별', '경기', '화성시') }})</span></li>
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
												getCategoryCount('지역별', '세종', '전체') }})</span></li>
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
												getCategoryCount('지역별', '충남', '전체') }})</span></li>
											<li @click="goToStudyList('충남', '공주시')">공주시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '공주시') }})</span></li>
											<li @click="goToStudyList('충남', '금산군')">금산군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '금산군') }})</span></li>
											<li @click="goToStudyList('충남', '논산시')">논산시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '논산시') }})</span></li>
											<li @click="goToStudyList('충남', '당진시')">당진시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '당진시') }})</span></li>
											<li @click="goToStudyList('충남', '보령시')">보령시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '보령시') }})</span></li>
											<li @click="goToStudyList('충남', '부여군')">부여군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '부여군') }})</span></li>
											<li @click="goToStudyList('충남', '서산시')">서산시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '서산시') }})</span></li>
											<li @click="goToStudyList('충남', '서천군')">서천군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '서천군') }})</span></li>
											<li @click="goToStudyList('충남', '아산시')">아산시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '아산시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충남', '예산군')">예산군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '예산군') }})</span></li>
											<li @click="goToStudyList('충남', '천안시 동남구')">천안시 동남구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충남', '천안시 동남구') }})</span></li>
											<li @click="goToStudyList('충남', '천안시 서북구')">천안시 서북구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충남', '천안시 서북구') }})</span></li>
											<li @click="goToStudyList('충남', '청양군')">청양군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '청양군') }})</span></li>
											<li @click="goToStudyList('충남', '태안군')">태안군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '태안군') }})</span></li>
											<li @click="goToStudyList('충남', '홍성군')">홍성군 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '홍성군') }})</span></li>
											<li @click="goToStudyList('충남', '계룡시')">계룡시 <span class="study-count">({{
												getCategoryCount('지역별', '충남', '계룡시') }})</span></li>
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
												getCategoryCount('지역별', '충북', '전체') }})</span></li>
											<li @click="goToStudyList('충북', '괴산군')">괴산군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '괴산군') }})</span></li>
											<li @click="goToStudyList('충북', '단양군')">단양군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '단양군') }})</span></li>
											<li @click="goToStudyList('충북', '보은군')">보은군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '보은군') }})</span></li>
											<li @click="goToStudyList('충북', '영동군')">영동군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '영동군') }})</span></li>
											<li @click="goToStudyList('충북', '옥천군')">옥천군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '옥천군') }})</span></li>
											<li @click="goToStudyList('충북', '음성군')">음성군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '음성군') }})</span></li>
											<li @click="goToStudyList('충북', '제천시')">제천시 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '제천시') }})</span></li>
											<li @click="goToStudyList('충북', '진천군')">진천군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '진천군') }})</span></li>
											<li @click="goToStudyList('충북', '청주시 청원구')">청주시 청원구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충북', '청주시 청원구') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('충북', '청주시 상당구')">청주시 상당구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충북', '청주시 상당구') }})</span></li>
											<li @click="goToStudyList('충북', '청주시 서원구')">청주시 서원구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충북', '청주시 서원구') }})</span></li>
											<li @click="goToStudyList('충북', '청주시 흥덕구')">청주시 흥덕구 <span
													class="study-count">({{
														getCategoryCount('지역별', '충북', '청주시 흥덕구') }})</span></li>
											<li @click="goToStudyList('충북', '충주시')">충주시 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '충주시') }})</span></li>
											<li @click="goToStudyList('충북', '증평군')">증평군 <span class="study-count">({{
												getCategoryCount('지역별', '충북', '증평군') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">
										경남
									</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '전체')">전체<span class="study-count">({{
												getCategoryCount('지역별', '경남', '전체') }})</span></li>
											<li @click="goToStudyList('경남', '거제시')">거제시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '거제시') }})</span></li>
											<li @click="goToStudyList('경남', '거창군')">거창군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '거창군') }})</span></li>
											<li @click="goToStudyList('경남', '고성군')">고성군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '고성군') }})</span></li>
											<li @click="goToStudyList('경남', '김해시')">김해시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '김해시') }})</span></li>
											<li @click="goToStudyList('경남', '남해군')">남해군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '남해군') }})</span></li>
											<li @click="goToStudyList('경남', '밀양시')">밀양시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '밀양시') }})</span></li>
											<li @click="goToStudyList('경남', '사천시')">사천시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '사천시') }})</span></li>
											<li @click="goToStudyList('경남', '산청군')">산청군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '산청군') }})</span></li>
											<li @click="goToStudyList('경남', '양산시')">양산시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '양산시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '의령군')">의령군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '의령군') }})</span></li>
											<li @click="goToStudyList('경남', '진주시')">진주시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '진주시') }})</span></li>
											<li @click="goToStudyList('경남', '창녕군')">창녕군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '창녕군') }})</span></li>
											<li @click="goToStudyList('경남', '창원시 마산합포구')">창원시 마산합포구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경남', '창원시 마산합포구') }})</span>
											</li>
											<li @click="goToStudyList('경남', '창원시 마산회원구')">창원시 마산회원구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경남', '창원시 마산회원구') }})</span>
											</li>
											<li @click="goToStudyList('경남', '창원시 성산구')">창원시 성산구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경남', '창원시 성산구') }})</span></li>
											<li @click="goToStudyList('경남', '창원시 의창구')">창원시 의창구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경남', '창원시 의창구') }})</span></li>
											<li @click="goToStudyList('경남', '창원시 진해구')">창원시 진해구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경남', '창원시 진해구') }})</span></li>
											<li @click="goToStudyList('경남', '통영시')">통영시 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '통영시') }})</span></li>
											<li @click="goToStudyList('경남', '하동군')">하동군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '하동군') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경남', '함안군')">함안군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '함안군') }})</span></li>
											<li @click="goToStudyList('경남', '함양군')">함양군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '함양군') }})</span></li>
											<li @click="goToStudyList('경남', '합천군')">합천군 <span class="study-count">({{
												getCategoryCount('지역별', '경남', '합천군') }})</span></li>
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
												getCategoryCount('지역별', '경북', '전체') }})</span></li>
											<li @click="goToStudyList('경북', '경산시')">경산시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '경산시') }})</span></li>
											<li @click="goToStudyList('경북', '경주시')">경주시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '경주시') }})</span></li>
											<li @click="goToStudyList('경북', '고령군')">고령군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '고령군') }})</span></li>
											<li @click="goToStudyList('경북', '구미시')">구미시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '구미시') }})</span></li>
											<li @click="goToStudyList('경북', '김천시')">김천시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '김천시') }})</span></li>
											<li @click="goToStudyList('경북', '문경시')">문경시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '문경시') }})</span></li>
											<li @click="goToStudyList('경북', '봉화군')">봉화군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '봉화군') }})</span></li>
											<li @click="goToStudyList('경북', '상주시')">상주시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '상주시') }})</span></li>
											<li @click="goToStudyList('경북', '성주군')">성주군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '성주군') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경북', '안동시')">안동시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '안동시') }})</span></li>
											<li @click="goToStudyList('경북', '영덕군')">영덕군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '영덕군') }})</span></li>
											<li @click="goToStudyList('경북', '영양군')">영양군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '영양군') }})</span></li>
											<li @click="goToStudyList('경북', '영주시')">영주시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '영주시') }})</span></li>
											<li @click="goToStudyList('경북', '영천시')">영천시 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '영천시') }})</span></li>
											<li @click="goToStudyList('경북', '예천군')">예천군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '예천군') }})</span></li>
											<li @click="goToStudyList('경북', '을릉군')">을릉군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '을릉군') }})</span></li>
											<li @click="goToStudyList('경북', '울진군')">울진군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '울진군') }})</span></li>
											<li @click="goToStudyList('경북', '의성군')">의성군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '의성군') }})</span></li>
											<li @click="goToStudyList('경북', '청도군')">청도군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '청도군') }})</span>
											</li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경북', '청송군')">청송군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '청송군') }})</span></li>
											<li @click="goToStudyList('경북', '칠곡군')">칠곡군 <span class="study-count">({{
												getCategoryCount('지역별', '경북', '칠곡군') }})</span></li>
											<li @click="goToStudyList('경북', '포항시 남구')">포항시 남구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경북', '포항시 남구') }})</span></li>
											<li @click="goToStudyList('경북', '포항시 북구')">포항시 북구 <span
													class="study-count">({{
														getCategoryCount('지역별', '경북', '포항시 북구') }})</span></li>
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
												getCategoryCount('지역별', '전남', '전체') }})</span></li>
											<li @click="goToStudyList('전남', '강진군')">강진군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '강진군') }})</span></li>
											<li @click="goToStudyList('전남', '고흥군')">고흥군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '고흥군') }})</span></li>
											<li @click="goToStudyList('전남', '곡성군')">곡성군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '곡성군') }})</span></li>
											<li @click="goToStudyList('전남', '광양시')">광양시 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '광양시') }})</span></li>
											<li @click="goToStudyList('전남', '구례군')">구례군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '구례군') }})</span></li>
											<li @click="goToStudyList('전남', '나주시')">나주시 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '나주시') }})</span></li>
											<li @click="goToStudyList('전남', '담양군')">담양군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '담양군') }})</span></li>
											<li @click="goToStudyList('전남', '목포시')">목포시 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '목포시') }})</span></li>
											<li @click="goToStudyList('전남', '무안군')">무안군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '무안군') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전남', '보성군')">보성군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '보성군') }})</span></li>
											<li @click="goToStudyList('전남', '순천시')">순천시 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '순천시') }})</span></li>
											<li @click="goToStudyList('전남', '신안군')">신안군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '신안군') }})</span></li>
											<li @click="goToStudyList('전남', '여수시')">여수시 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '여수시') }})</span></li>
											<li @click="goToStudyList('전남', '영광군')">영광군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '영광군') }})</span></li>
											<li @click="goToStudyList('전남', '영암군')">영암군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '영암군') }})</span></li>
											<li @click="goToStudyList('전남', '완도군')">완도군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '완도군') }})</span></li>
											<li @click="goToStudyList('전남', '장성군')">장성군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '장성군') }})</span></li>
											<li @click="goToStudyList('전남', '장흥군')">장흥군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '장흥군') }})</span></li>
											<li @click="goToStudyList('전남', '진도군')">진도군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '진도군') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('전남', '함평군')">함평군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '함평군') }})</span></li>
											<li @click="goToStudyList('전남', '해남군')">해남군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '해남군') }})</span></li>
											<li @click="goToStudyList('전남', '화순군')">화순군 <span class="study-count">({{
												getCategoryCount('지역별', '전남', '화순군') }})</span></li>
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
												getCategoryCount('지역별', '전북', '전체') }})</span></li>
											<li @click="goToStudyList('전북', '고창군')">고창군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '고창군') }})</span></li>
											<li @click="goToStudyList('전북', '군산시')">군산시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '군산시') }})</span></li>
											<li @click="goToStudyList('전북', '김제시')">김제시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '김제시') }})</span></li>
											<li @click="goToStudyList('전북', '남원시')">남원시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '남원시') }})</span></li>
											<li @click="goToStudyList('전북', '무주군')">무주군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '무주군') }})</span></li>
											<li @click="goToStudyList('전북', '부안군')">부안군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '부안군') }})</span></li>
											<li @click="goToStudyList('전북', '순창군')">순창군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '순창군') }})</span></li>
											<li @click="goToStudyList('전북', '완주군')">완주군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '완주군') }})</span></li>
											<li @click="goToStudyList('전북', '익산시')">익산시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '익산시') }})</span></li>
											<li @click="goToStudyList('전북', '임실군')">임실군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '임실군') }})</span></li>
											<li @click="goToStudyList('전북', '장수군')">장수군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '장수군') }})</span></li>
											<li @click="goToStudyList('전북', '전주시')">전주시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '전주시') }})</span></li>
											<li @click="goToStudyList('전북', '정읍시')">정읍시 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '정읍시') }})</span></li>
											<li @click="goToStudyList('전북', '진안군')">진안군 <span class="study-count">({{
												getCategoryCount('지역별', '전북', '진안군') }})</span></li>
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
												getCategoryCount('지역별', '강원', '전체') }})</span></li>
											<li @click="goToStudyList('강원', '강릉시')">강릉시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '강릉시') }})</span></li>
											<li @click="goToStudyList('강원', '고성군')">고성군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '고성군') }})</span></li>
											<li @click="goToStudyList('강원', '동해시')">동해시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '동해시') }})</span></li>
											<li @click="goToStudyList('강원', '삼척시')">삼척시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '삼척시') }})</span></li>
											<li @click="goToStudyList('강원', '속초시')">속초시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '속초시') }})</span></li>
											<li @click="goToStudyList('강원', '양구군')">양구군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '양구군') }})</span></li>
											<li @click="goToStudyList('강원', '양양군')">양양군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '양양군') }})</span></li>
											<li @click="goToStudyList('강원', '영월군')">영월군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '영월군') }})</span></li>
											<li @click="goToStudyList('강원', '원주시')">원주시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '원주시') }})</span></li>
										</ul>
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('강원', '인제군')">인제군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '인제군') }})</span></li>
											<li @click="goToStudyList('강원', '정선군')">정선군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '정선군') }})</span></li>
											<li @click="goToStudyList('강원', '철원군')">철원군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '철원군') }})</span></li>
											<li @click="goToStudyList('강원', '춘천시')">춘천시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '춘천시') }})</span></li>
											<li @click="goToStudyList('강원', '태백시')">태백시 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '태백시') }})</span></li>
											<li @click="goToStudyList('강원', '평창군')">평창군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '평창군') }})</span></li>
											<li @click="goToStudyList('강원', '홍천군')">홍천군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '홍천군') }})</span></li>
											<li @click="goToStudyList('강원', '화천군')">화천군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '화천군') }})</span></li>
											<li @click="goToStudyList('강원', '횡성군')">횡성군 <span class="study-count">({{
												getCategoryCount('지역별', '강원', '횡성군') }})</span></li>
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
												getCategoryCount('지역별', '제주', '전체') }})</span></li>
											<li @click="goToStudyList('제주', '서귀포시')">서귀포시 <span class="study-count">({{
												getCategoryCount('지역별', '제주', '서귀포시') }})</span></li>
											<li @click="goToStudyList('제주', '제주시')">제주시 <span class="study-count">({{
												getCategoryCount('지역별', '제주', '제주시') }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							<span>학습자별</span>
							<ul class="sub-menu">
								<li class="sub-menu-item region">
									<div class="region-name">중등</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('중등', '전체')">전체
												<span class="study-count">({{ getCategoryCount('학습자별', '중등', '전체')
													}})</span>
											</li>
											<li @click="goToStudyList('중등', '1학년')">1학년
												<span class="study-count">({{ getCategoryCount('학습자별', '중등', '1학년')
													}})</span>
											</li>
											<li @click="goToStudyList('중등', '2학년')">2학년
												<span class="study-count">({{ getCategoryCount('학습자별', '중등', '2학년')
													}})</span>
											</li>
											<li @click="goToStudyList('중등', '3학년')">3학년
												<span class="study-count">({{ getCategoryCount('학습자별', '중등', '3학년')
													}})</span>
											</li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">고등</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('고등', '전체')">전체 <span class="study-count">({{
												getCategoryCount('학습자별', '고등', '전체') }})</span></li>
											<li @click="goToStudyList('고등', '1학년')">1학년 <span class="study-count">({{
												getCategoryCount('학습자별', '고등', '1학년') }})</span></li>
											<li @click="goToStudyList('고등', '2학년')">2학년 <span class="study-count">({{
												getCategoryCount('학습자별', '고등', '2학년') }})</span></li>
											<li @click="goToStudyList('고등', '3학년')">3학년 <span class="study-count">({{
												getCategoryCount('학습자별', '고등', '3학년') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">대학/청년</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('대학/청년', '대학생')">대학생 <span class="study-count">({{
												getCategoryCount('학습자별', '대학/청년', '대학생') }})</span></li>
											<li @click="goToStudyList('대학/청년', '청년')">청년 <span class="study-count">({{
												getCategoryCount('학습자별', '대학/청년', '청년') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">취업준비/수험</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('취업준비/수험', '취업준비생')">취업준비생 <span
													class="study-count">({{
														getCategoryCount('학습자별', '취업준비/수험', '취업준비생') }})</span></li>
											<li @click="goToStudyList('취업준비/수험', '수험생')">수험생 <span
													class="study-count">({{
														getCategoryCount('학습자별', '취업준비/수험', '수험생') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">경력/이직</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('경력/이직', '경력')">경력 <span class="study-count">({{
												getCategoryCount('학습자별', '경력/이직', '경력') }})</span></li>
											<li @click="goToStudyList('경력/이직', '이직')">이직 <span class="study-count">({{
												getCategoryCount('학습자별', '경력/이직', '이직') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">취미/자기계발</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('취미/자기계발', '취미')">취미 <span class="study-count">({{
												getCategoryCount('학습자별', '취미/자기계발', '취미') }})</span></li>
											<li @click="goToStudyList('취미/자기계발', '자기계발')">자기계발 <span
													class="study-count">({{
														getCategoryCount('학습자별', '취미/자기계발', '자기계발') }})</span></li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							<span>전공별</span>
							<ul class="sub-menu">
								<li class="sub-menu-item region">
									<div class="region-name">인문계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('인문계열', '전체')">전체 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '전체') }})</span></li>
											<li @click="goToStudyList('인문계열', '철학')">철학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '철학') }})</span></li>
											<li @click="goToStudyList('인문계열', '역사학')">역사학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '역사학') }})</span></li>
											<li @click="goToStudyList('인문계열', '문학')">문학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '문학') }})</span></li>
											<li @click="goToStudyList('인문계열', '언어학')">언어학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '언어학') }})</span></li>
											<li @click="goToStudyList('인문계열', '종교학')">종교학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '종교학') }})</span></li>
											<li @click="goToStudyList('인문계열', '고고학')">고고학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '고고학') }})</span></li>
											<li @click="goToStudyList('인문계열', '예술학')">예술학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '예술학') }})</span></li>
											<li @click="goToStudyList('인문계열', '문화학')">문화학 <span class="study-count">({{
												getCategoryCount('전공별', '인문계열', '문화학') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">사회과학계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('사회과학계열', '전체')">전체 <span class="study-count">({{
												getCategoryCount('전공별', '사회과학계열', '전체') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '경제학')">경제학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '경제학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '사회학')">사회학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '사회학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '심리학')">심리학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '심리학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '교육학')">교육학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '교육학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '인류학')">인류학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '인류학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '행정학')">행정학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '행정학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '법학')">법학 <span class="study-count">({{
												getCategoryCount('전공별', '사회과학계열', '법학') }})</span></li>
											<li @click="goToStudyList('사회과학계열', '언론/미디어학')">언론/미디어학 <span
													class="study-count">({{
														getCategoryCount('전공별', '사회과학계열', '언론/미디어학') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">자연과학계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('자연과학계열', '전체')">전체 <span class="study-count">({{
												getCategoryCount('전공별', '자연과학계열', '전체') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '수학')">수학 <span class="study-count">({{
												getCategoryCount('전공별', '자연과학계열', '수학') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '물리학')">물리학 <span
													class="study-count">({{
														getCategoryCount('전공별', '자연과학계열', '물리학') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '화학')">화학 <span class="study-count">({{
												getCategoryCount('전공별', '자연과학계열', '화학') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '생물학')">생물학 <span
													class="study-count">({{
														getCategoryCount('전공별', '자연과학계열', '생물학') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '지구과학')">지구과학 <span
													class="study-count">({{
														getCategoryCount('전공별', '자연과학계열', '지구과학') }})</span></li>
											<li @click="goToStudyList('자연과학계열', '통계학')">통계학 <span
													class="study-count">({{
														getCategoryCount('전공별', '자연과학계열', '통계학') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">공학계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('공학계열', '전체')">전체 <span class="study-count">({{
												getCategoryCount('전공별', '공학계열', '전체') }})</span></li>
											<li @click="goToStudyList('공학계열', '기계공학')">기계공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '기계공학') }})</span></li>
											<li @click="goToStudyList('공학계열', '전기전자공학')">전기전자공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '전기전자공학') }})</span></li>
											<li @click="goToStudyList('공학계열', '컴퓨터공학')">컴퓨터공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '컴퓨터공학') }})</span></li>
											<li @click="goToStudyList('공학계열', '화학공학')">화학공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '화학공학') }})</span></li>
											<li @click="goToStudyList('공학계열', '토목공학')">토목공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '토목공학') }})</span></li>
											<li @click="goToStudyList('공학계열', '건축학')">건축학 <span class="study-count">({{
												getCategoryCount('전공별', '공학계열', '건축학') }})</span></li>
											<li @click="goToStudyList('공학계열', '로봇공학')">로봇공학 <span
													class="study-count">({{
														getCategoryCount('전공별', '공학계열', '로봇공학') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">의학/보건학계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('의학/보건학계열', '전체')">전체 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '전체') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '의학')">의학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '의학') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '치의학')">치의학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '치의학') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '약학')">약학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '약학') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '간호학')">간호학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '간호학') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '수의학')">수의학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '수의학') }})</span></li>
											<li @click="goToStudyList('의학/보건학계열', '보건학')">보건학 <span
													class="study-count">({{
														getCategoryCount('전공별', '의학/보건학계열', '보건학') }})</span></li>
										</ul>
									</div>
								</li>
								<li class="sub-menu-item region">
									<div class="region-name">예체능계열</div>
									<div class="sub-sub-menu">
										<ul class="sub-sub-menu-column">
											<li @click="goToStudyList('예체능계열', '전체')">전체 <span class="study-count">({{
												getCategoryCount('전공별', '예체능계열', '전체') }})</span></li>
											<li @click="goToStudyList('예체능계열', '음악')">음악 <span class="study-count">({{
												getCategoryCount('전공별', '예체능계열', '음악') }})</span></li>
											<li @click="goToStudyList('예체능계열', '미술')">미술 <span class="study-count">({{
												getCategoryCount('전공별', '예체능계열', '미술') }})</span></li>
											<li @click="goToStudyList('예체능계열', '연극/영화')">연극/영화 <span
													class="study-count">({{
														getCategoryCount('전공별', '예체능계열', '연극/영화') }})</span></li>
											<li @click="goToStudyList('예체능계열', '무용')">무용 <span class="study-count">({{
												getCategoryCount('전공별', '예체능계열', '무용') }})</span></li>
											<li @click="goToStudyList('예체능계열', '체육학')">체육학
												<span class="study-count">({{ getCategoryCount('전공별', '예체능계열', '체육학')
													}})</span>
											</li>
										</ul>
									</div>
								</li>
							</ul>
						</li>
						<li class="menu-item">
							<span>커뮤니티</span>
							<ul class="sub-menu">
								<li class="sub-menu-item">
									<router-link :to="{ path: '/posts', query: { category: 'FREE' }}">
										자유게시판
									</router-link>
								</li>
								<li class="sub-menu-item">
									<router-link :to="{ path: '/posts', query: { category: 'QUESTION' }}">
										질문게시판
									</router-link>
								</li>
								<li class="sub-menu-item">
									<router-link :to="{ path: '/posts', query: { category: 'SUGGESTION' }}">
										건의게시판
									</router-link>
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

<script lang="ts">
import mitt from 'mitt';
import { Category } from '../types/category';
export const emitter = mitt();
</script>

<script setup lang="ts">

import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from '../utils/axios';
import { useUserStore } from '../stores/user';
import { storeToRefs } from 'pinia';

// 최상단으로 이동
declare global {
	interface Window {
		readonly innerWidth: number;
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
const isMobile = ref(false);

const updateMobileStatus = () => {
	isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
	await fetchCategories();
	updateMobileStatus();
	window.addEventListener('resize', updateMobileStatus);
	checkLoginStatus();
	fetchStudyGroupCounts();
	// 스터디 그룹 생성/삭제 이벤트 감지
	emitter.on('studyGroupCreated', () => {
		fetchStudyGroupCounts();
	});
	emitter.on('studyGroupDeleted', () => {
		fetchStudyGroupCounts();
	});
	// 주기적으로 카테고리 정보 업데이트 (선택사항)
	const updateInterval = setInterval(fetchCategories, 30000); // 30초마다 업데이트
	onUnmounted(() => clearInterval(updateInterval));
});

const goToStudyList = (mainRegion: string, subRegion: string) => {
	let mainCategory: string;

	// 메인 카테고리 판별 로직 개선
	if (['서울', '부산', '대구', '인천', '광주', '대전', '울산', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주', '세종'].includes(mainRegion)) {
		mainCategory = '지역별';
	} else if (['중등', '고등', '대학/청년', '취업준비/수험', '경력/이직', '취미/자기계발'].includes(mainRegion)) {
		mainCategory = '학습자별';
	} else if (['인문계열', '사회과학계열', '자연과학계열', '공학계열', '의학/보건학계열', '예체능계열'].includes(mainRegion)) {
		mainCategory = '전공별';
	} else {
		console.error('유효하지 않은 메인 카테고리:', mainRegion);
		return;
	}

	// 라우팅 정보 구성
	const routeQuery = {
		mainCategory,
		subCategory: mainRegion,
		detailCategory: subRegion === '전체' ? undefined : subRegion
	};

	console.log('라우팅 정보:', routeQuery);

	// 라우팅 실행
	router.push({
		name: 'StudyGroupList',
		query: routeQuery
	});
};

const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    const nickname = localStorage.getItem('nickname');

    if (token && nickname) {
        isLoggedIn.value = true;
        userNickname.value = nickname;
    } else {
        isLoggedIn.value = false;
        userNickname.value = '';
    }
};

const validateToken = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        const response = await axios.get('http://localhost:3000/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data) {
            isLoggedIn.value = true;
            userNickname.value = response.data.nickname;
            localStorage.setItem('nickname', response.data.nickname);
        }
    } catch (error) {
        console.error('토큰 검증 실패:', error);
        logout();
    }
};

const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('nickname');
    isLoggedIn.value = false;
    userNickname.value = '';
    router.push('/login');
};

// 컴포넌트 마운트 시 로그인 상태 즉시 체크하고, 토큰 유효성은 비동기로 검증
onMounted(() => {
    checkLoginStatus();  // 즉시 로컬 스토리지 기반으로 상태 설정
    validateToken();     // 비동기로 토큰 유효성 검증
});

// 라우트 변경 시 로그인 상태 체크
watch(() => route.path, () => {
    checkLoginStatus();
});

const fetchStudyGroupCounts = async () => {
	try {
		const response = await axios.get('http://localhost:3000/study-groups/categories');
		categories.value = response.data;
	} catch (error) {
		console.error('카테고리 조회 실패:', error);
	}
};

watch([() => route.path], async () => {
	await fetchCategories();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
	emitter.off('studyGroupCreated');
	emitter.off('studyGroupDeleted');
});

// 카테고리 카운트를 위한 상태 추가
const categories = ref<Category[]>([]);
const loading = ref(false);

// 카테고리 정보 가져오기 (프론트엔드 캐싱 적용)
const fetchCategories = async () => {
    try {
        const response = await axios.get('http://localhost:3000/study-groups/categories');
        console.log('카테고리 데이터:', response.data); // 데이터 확인용 로그
        categories.value = response.data;
    } catch (error) {
        console.error('카테고리 조회 실패:', error);
    }
};

// 특정 카테고리의 카운트 계산
const getCategoryCount = (mainCategory: string, subCategory: string, detailCategory?: string) => {
    console.log('getCategoryCount 호출:', { mainCategory, subCategory, detailCategory }); // 파라미터 확인용 로그
    
    const matchingCategories = categories.value.filter(category => {
        const mainMatch = category.mainCategory === mainCategory;
        const subMatch = category.subCategory === subCategory;
        const detailMatch = !detailCategory || category.detailCategory === detailCategory;
        
        return mainMatch && subMatch && detailMatch;
    });

    const count = matchingCategories.reduce((sum, category) => sum + (category.count || 0), 0);
    console.log('매칭된 카테고리:', matchingCategories, '총 개수:', count); // 결과 확인용 로그
    
    return count;
};

// 컴포넌트 마운트 시 카테고리 정보 즉시 가져오기
onMounted(async () => {
    await fetchCategories();
    checkLoginStatus();
});

const categoryUpdateInterval = ref<number>();

const startCategoryUpdateInterval = () => {
    categoryUpdateInterval.value = setInterval(async () => {
        await fetchCategories();
    }, 30000);
};

onMounted(async () => {
    await fetchCategories();
    checkLoginStatus();
    startCategoryUpdateInterval();
});

onUnmounted(() => {
    if (categoryUpdateInterval.value) {
        clearInterval(categoryUpdateInterval.value);
    }
});

// 라우트 변경 시 로그인 상태만 체크
watch(() => route.path, () => {
    checkLoginStatus();
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
    justify-content: center;  /* space-around에서 center로 변경 */
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    gap: 5rem;  /* 대분류 간격 넓히기 */
}

.menu-item {
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;  /* default에서 pointer로 변경 */
    padding: 5px 20px;  /* 좌우 패딩 조정 */
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;  /* 링크 밑줄 제거 */
}

.menu-item > span,
.menu-item > a {
    color: #fff;
    text-decoration: none;
    display: block;
}

.menu-item:hover {
    color: #1a365d;
}

.menu-item:hover > span,
.menu-item:hover > a {
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

.study-count {
	font-size: 12px;
	color: #666;
	background-color: #f3f4f6;
	padding: 2px 6px;
	border-radius: 10px;
	margin-left: 8px;
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
	font-size: 18px;
	/* 폰트 크기 증가 */
	font-weight: 600;
	/* 폰트 굵기 증가 */
	text-decoration: none;
	color: inherit;
}

.nav-link i {
	margin-right: 5px;
}

.sub-menu-item a {
	text-decoration: none;
	color: inherit;
	display: block;
	padding: 8px 16px;
}

.sub-menu-item a:hover {
	background-color: #f3f4f6;
}

.user-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.welcome-text {
    color: #4A90E2;
    font-weight: 600;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    color: #4A90E2;
    text-decoration: none;
    font-weight: 600;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.menu-item:hover {
    background-color: #f0f7ff;
}

.menu-item i {
    font-size: 1.1rem;
}

.login-link {
    color: #4A90E2;
    text-decoration: none;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.login-link:hover {
    background-color: #f0f7ff;
}

.logout-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
}

.logout-button:hover {
    background-color: #357ABD;
}

@media (max-width: 768px) {
    .user-menu {
        flex-direction: column;
        position: absolute;
        top: 100%;
        right: 0;
        background-color: white;
        padding: 0.5rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .menu-item {
        width: 100%;
        justify-content: flex-start;
    }
}

.nav-buttons {
    display: flex;
    gap: 0.5rem;  /* 1rem에서 0.5rem으로 간격 축소 */
    margin: 0 0.5rem;  /* 좌우 마진도 축소 */
}

.nav-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;  /* 아이콘과 텍스트 사이 간격 축소 */
    padding: 0.5rem 1rem;  /* 패딩 축소 */
    color: #4A90E2;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.9rem;  /* 폰트 크기 축소 */
    border-radius: 6px;  /* 모서리 반경 축소 */
    transition: all 0.3s ease;
    background-color: rgba(74, 144, 226, 0.1);
    border: 2px solid transparent;
    width: 100px;  /* 버튼 너비 축소 */
    text-align: center;
}

.nav-button:hover {
    background-color: rgba(74, 144, 226, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.15);
}

.nav-button:active {
    transform: translateY(0);
}

.nav-button i {
    margin: 0;  /* 아이콘 마진 제거 */
    font-size: 1rem;  /* 아이콘 크기 축소 */
    color: #4A90E2;
}

.nav-button span {
    flex: 1;  /* 텍스트가 남은 공간을 차지하도록 설정 */
    text-align: center;  /* 텍스트 중앙 정렬 */
}

.logout-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;  /* 아이콘과 텍스트 사이 간격 축소 */
    padding: 0.5rem 1rem;  /* 패딩 축소 */
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 6px;  /* 모서리 반경 축소 */
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;  /* 폰트 크기 축소 */
    transition: all 0.3s ease;
    width: 100px;  /* 버튼 너비 축소 */
    text-align: center;
}

.logout-button:hover {
    background-color: #357ABD;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
}

.logout-button:active {
    transform: translateY(0);
}

.logout-button i {
    margin: 0;  /* 아이콘 마진 제거 */
}

.logout-button span {
    flex: 1;  /* 텍스트가 남은 공간을 차지하도록 설정 */
    text-align: center;  /* 텍스트 중앙 정렬 */
}

.auth-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.welcome-text {
    color: #4A90E2;
    font-weight: 600;
}

@media (max-width: 768px) {
    .nav-buttons {
        flex-direction: column;
        gap: 0.5rem;
    }

    .nav-button {
        width: 100%;
        justify-content: center;
    }
}

.main-menu {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    gap: 5rem;  /* 메뉴 간격 */
}

.menu-item {
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
    padding: 5px 20px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu-item span {
    display: block;  /* 텍스트가 보이도록 block으로 설정 */
    color: #fff;     /* 텍스트 색상 지정 */
}

.menu-item:hover span {
    color: #1a365d;  /* 호버 시 텍스트 색상 변경 */
}
</style>
