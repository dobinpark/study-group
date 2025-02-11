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
import { useUserStore } from '../store/index';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: { public: true }, // public route 설정 (인증 불필요)
        },
        {
            path: '/signup',
            name: 'signup',
            component: Signup,
            meta: { public: true }, // public route 설정 (인증 불필요)
        },
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/post-list',
            name: 'post-list',
            component: PostList,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/create-post',
            name: 'create-post',
            component: CreatePost,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/edit-post',
            name: 'edit-post',
            component: EditPost,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/post-detail',
            name: 'post-detail',
            component: PostDetail,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/study-group-list',
            name: 'study-group-list',
            component: StudyGroupList,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/study-group-detail',
            name: 'study-group-detail',
            component: StudyGroupDetail,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/study-group-create',
            name: 'study-group-create',
            component: CreateStudyGroup,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/study-group-edit',
            name: 'study-group-edit',
            component: EditStudyGroup,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
        {
            path: '/my-studies',
            name: 'my-studies',
            component: MyStudies,
            meta: { requiresAuth: true }, // 인증 필요 route 설정
        },
    ],
});

router.beforeEach(async (to) => {
    const userStore = useUserStore();

    // public route 이거나 이미 인증된 경우 proceed
    if (to.meta.public || userStore.authChecked) {
        return true;
    }

    // 인증이 필요한 페이지에 접근 시 인증 상태 확인
    if (to.meta.requiresAuth && !userStore.authChecked) {
        // 로그인 페이지로 리다이렉트
        return {
            path: '/login',
            query: { redirect: to.path }, // 로그인 후 원래 페이지로 redirect 하기 위해 fullPath query parameter 추가
        };
    }

    return true;
});


export default router;
