<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="home-container">
        <div class="home">
            <h1 class="main-title">함공과 함께라면<br>공부도 즐거움이 됩니다.</h1>
            <h2 class="sub-title">함께 공부하는 공간, 함공</h2>
        </div>
    </div>
</template>

<style scoped>
.home-container {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: calc(100vh - 200px);
}

.home {
    width: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
    border-radius: 8px;
}

.main-title {
    font-size: 3.5rem;
    font-weight: 800;
    color: #2d3748;
    text-align: center;
    margin-bottom: 2rem;
    line-height: 1.4;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    animation: fadeInDown 1s ease-out;
    font-family: 'Pretendard', 'Arial', sans-serif;
}

.sub-title {
    font-size: 2rem;
    color: #4A90E2;
    text-align: center;
    margin-top: 1rem;
    font-weight: 600;
    opacity: 0;
    animation: fadeInUp 1s ease-out forwards;
    animation-delay: 0.5s;
    font-family: 'Pretendard', 'Arial', sans-serif;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 768px) {
    .home {
        width: 90%;
    }
    
    .main-title {
        font-size: 2.5rem;
    }
    
    .sub-title {
        font-size: 1.5rem;
    }
}
</style>
