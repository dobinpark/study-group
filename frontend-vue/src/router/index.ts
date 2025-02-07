import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../stores/user';
import StudyGroupList from '@/views/study/StudyGroupList.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import Profile from '../views/Profile.vue';
import CreateStudyGroup from '@/views/study/CreateStudyGroup.vue';

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
        meta: { requiresAuth: true } // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
    },
    {
        path: '/create-study',
        name: 'CreateStudyGroup',
        component: CreateStudyGroup,
        meta: { requiresAuth: true } // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
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
        meta: { requiresAuth: true } // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
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
        meta: { requiresAuth: true }, // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
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
        meta: { requiresAuth: true } // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
    },
    {
        path: '/my-studies',
        name: 'MyStudies',
        component: () => import('../views/study/MyStudies.vue'),
        meta: { requiresAuth: true } // meta 필드는 유지, 로직은 세션 기반에 맞춰 조정
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// 네비게이션 가드 설정 (세션 기반 인증)
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();
    // 세션 기반 시스템에서 isAuthenticated는 세션 상태를 반영해야 합니다.
    // userStore가 각 탐색 시 세션 상태를 확실하게 반영하지 않는 경우, 백엔드에서 세션 유효성을 확인해야 할 수 있습니다.

    // userStore.isAuthenticated가 세션 상태에 따라 업데이트된다고 가정합니다.
    // 예를 들어, 로그인 후 userStore.isAuthenticated는 true로 설정되고,
    // 로그아웃 또는 세션 만료 시에는 false로 설정될 수 있습니다.
    const isAuthenticated = userStore.isAuthenticated;

    if (to.meta.requiresAuth && !isAuthenticated) {
        // 라우트가 인증을 요구하고 사용자가 인증되지 않은 경우 (유효한 세션이 없는 경우),
        // 로그인 페이지로 리다이렉트합니다.
        next('/login');
    } else {
        // 그렇지 않으면, 라우트로 진행합니다.
        next();
    }

    // **선택 사항**, 더욱 강력한 세션 관리를 위해, 특히 userStore.isAuthenticated가
    // 항상 세션 상태를 확실하게 업데이트하지 않는 경우, 여기에 세션 체크를 추가할 수 있습니다.
    // 그러나 모든 라우트 변경 시 백엔드 호출을 하는 것은 과도할 수 있습니다.
    // 더 나은 접근 방식은 일반적으로 다음과 같습니다:
    // 1. 앱 로드 시 세션 상태를 확인하고 userStore.isAuthenticated를 업데이트합니다.
    // 2. 401/403 오류를 반환하는 API 호출에서 세션 무효화를 처리하고
    //    userStore.isAuthenticated를 false로 업데이트한 다음, 잠재적으로 로그인으로 리다이렉트합니다.

    // 선택적인 명시적 세션 확인의 예 (성능 저하 가능성 - 매 라우트 변경마다 권장되지 않음):
    // if (to.meta.requiresAuth) {
    //     if (!isAuthenticated) {
    //         try {
    //             // userStore에 백엔드에서 세션을 확인하는 메서드가 있다고 가정합니다.
    //             await userStore.checkSessionStatus();
    //             if (!userStore.isAuthenticated) { // checkSessionStatus는 isAuthenticated를 업데이트해야 함
    //                 next('/login');
    //             } else {
    //                 next();
    //             }
    //         } catch (error) {
    //             console.error("세션 확인 실패", error);
    //             next('/login'); // 세션 확인 API가 실패하면, 로그인으로 리다이렉트
    //         }
    //     } else {
    //         next();
    //     }
    // } else {
    //     next();
    // }
});

export default router;
