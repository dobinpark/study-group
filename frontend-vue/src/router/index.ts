import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import StudyGroupList from '@/views/study/StudyGroupList.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import CreateStudyGroup from '../views/study/CreateStudyGroup.vue';

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
        path: '/posts',
        component: () => import('@/views/community/PostList.vue'),
        props: (route) => ({
            category: route.query.category?.toString()?.toUpperCase() || 'FREE'
        })
    },
    {
        path: '/posts/create',
        component: () => import('@/views/community/CreatePost.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/:id',
        name: 'PostDetail',
        component: () => import('@/views/community/PostDetail.vue')
    },
    {
        path: '/posts/:id/edit',
        name: 'EditPost',
        component: () => import('@/views/community/EditPost.vue'),
        meta: { requiresAuth: true },
        props: true
    },
    {
        path: '/study-groups',
        name: 'StudyGroupList',
        component: StudyGroupList,
        props: (route) => ({
            mainCategory: route.query.mainCategory,
            subCategory: route.query.subCategory,
            detailCategory: route.query.detailCategory
        })
    },
    {
        path: '/study-groups/region/:mainRegion/:subRegion?',
        name: 'StudyGroupListByRegion',
        component: StudyGroupList,
        props: true
    },
    {
        path: '/study-groups/:id',
        name: 'StudyGroupDetail',
        component: () => import('../views/study/StudyGroupDetail.vue')
    },
    {
        path: '/study-groups/:id/edit',
        name: 'EditStudyGroup',
        component: () => import('../views/study/EditStudyGroup.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/my-studies',
        name: 'MyStudies',
        component: () => import('../views/study/MyStudies.vue'),
        meta: { requiresAuth: true }
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
