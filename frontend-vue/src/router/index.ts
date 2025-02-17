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

router.beforeEach(async (to) => {
    const userStore = useUserStore();

    if (to.meta.auth === 'requiresAuth') { // 인증이 필요한 페이지 접근 시
        await userStore.checkAuth(); // checkAuth 액션 호출하여 인증 확인 (비동기)

        if (!userStore.isLoggedIn) { // 로그인되지 않은 경우
            return {
                path: '/login',
                query: { redirect: to.fullPath },
            };
        }
    }
    // public 페이지는 항상 접근 허용
    return true; // Ensure a return value for all paths
});

export default router;
