import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import PostList from '../views/community/PostList.vue';
import CreatePost from '../views/community/CreatePost.vue';
import StudyGroupList from '@/views/study/StudyGroupList.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import CreateStudyGroup from '../views/CreateStudyGroup.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/create-study',
        name: 'CreateStudyGroup',
        component: CreateStudyGroup,
        meta: { requiresAuth: true }
    },
    {
        path: '/community/:category',
        name: 'CommunityBoard',
        component: PostList,
        props: true
    },
    {
        path: '/community/:category/create',
        name: 'CreatePost',
        component: CreatePost,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/study-groups',
        name: 'StudyGroupList',
        component: StudyGroupList
    },
    {
        path: '/study-groups/region/:mainRegion/:subRegion?',
        name: 'StudyGroupListByRegion',
        component: StudyGroupList,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('accessToken');
    
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

export default router
