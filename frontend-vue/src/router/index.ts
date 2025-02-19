import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import PostList from '../views/community/PostList.vue';
import CreatePost from '../views/community/CreatePost.vue';
import EditPost from '../views/community/EditPost.vue';
import PostDetail from '../views/community/PostDetail.vue';
import StudyGroupList from '../views/study/StudyGroupList.vue';
import StudyGroupDetail from '../views/study/StudyGroupDetail.vue';
import CreateStudyGroup from '../views/study/CreateStudyGroup.vue';
import EditStudyGroup from '../views/study/EditStudyGroup.vue';
import MyStudies from '../views/study/MyStudies.vue';
import { useUserStore } from '@/store';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: { auth: 'public' },
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { auth: 'public' },
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
            meta: { auth: 'public' },
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/post-list',
            name: 'post-list',
            component: PostList,
            meta: { auth: 'public' },
        },
        {
            path: '/create-post',
            name: 'create-post',
            component: CreatePost,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/edit-post',
            name: 'edit-post',
            component: EditPost,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/post-detail',
            name: 'post-detail',
            component: PostDetail,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/study-group-list',
            name: 'study-group-list',
            component: StudyGroupList,
            meta: { auth: 'public' },
        },
        {
            path: '/study-group-detail',
            name: 'study-group-detail',
            component: StudyGroupDetail,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/study-group-create',
            name: 'study-group-create',
            component: CreateStudyGroup,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/study-group-edit',
            name: 'study-group-edit',
            component: EditStudyGroup,
            meta: { auth: 'requiresAuth' },
        },
        {
            path: '/my-studies',
            name: 'my-studies',
            component: MyStudies,
            meta: { auth: 'requiresAuth' },
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    // authChecked가 false일 때만 세션 상태 확인 (최초 로딩 시 한 번만 호출)
    if (!userStore.authChecked) {
        await userStore.fetchSessionStatus(); // 세션 상태 확인 액션 호출 (await 추가)
    }

    const isLoggedIn = userStore.isLoggedIn; // Pinia 스토어에서 로그인 상태 가져옴

    if (to.meta.auth === 'requiresAuth' && !isLoggedIn) {
        console.log('Authentication required. Redirecting to login...');
        next('/login');
    } else if (to.path === '/login' && isLoggedIn) {
        next('/');
    } else {
        next();
    }
});

export default router;
