import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '../store/user';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/find-password',
    name: 'findPassword',
    component: () => import('../components/FindPasswordModal.vue')
  },
  {
    path: '/my-studies',
    name: 'myStudyGroups',
    component: () => import('../views/study/MyStudies.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/study-groups',
    children: [
      {
        path: '',
        name: 'studyGroups',
        component: () => import('../views/study/StudyGroupList.vue')
      },
      {
        path: 'create',
        name: 'studyGroupCreate',
        component: () => import('../views/study/CreateStudyGroup.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'studyGroupDetail',
        component: () => import('../views/study/StudyGroupDetail.vue')
      },
      {
        path: ':id/edit',
        name: 'studyGroupEdit',
        component: () => import('../views/study/EditStudyGroup.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/posts',
    name: 'posts',
    children: [
      {
        path: '',
        name: 'postList',
        component: () => import('../views/community/PostList.vue'),
      },
      {
        path: 'create',
        name: 'postCreate',
        component: () => import('../views/community/CreatePost.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'postDetail',
        component: () => import('../views/community/PostDetail.vue')
      },
      {
        path: ':id/edit',
        name: 'postEdit',
        component: () => import('../views/community/EditPost.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/:category',
        name: 'postsByCategory',
        component: () => import('../views/community/PostList.vue')
      },
      {
        path: 'search',
        name: 'searchPosts',
        component: () => import('../views/community/PostList.vue')
      },
      {
        path: 'my',
        name: 'myPosts',
        component: () => import('../views/community/PostList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id/comments',
        name: 'postComments',
        component: () => import('../views/community/PostDetail.vue')
      }
    ]
  },
  {
    path: '/supports',
    name: 'supports',
    children: [
      {
        path: '',
        name: 'supportList',
        component: () => import('../views/support/SupportList.vue'),
      },
      {
        path: 'create',
        name: 'supportCreate',
        component: () => import('../views/support/CreateSupport.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id',
        name: 'supportDetail',
        component: () => import('../views/support/SupportDetail.vue')
      },
      {
        path: ':id/edit',
        name: 'supportEdit',
        component: () => import('../views/support/EditSupport.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'categories/:category',
        name: 'supportsByCategory',
        component: () => import('../views/support/SupportList.vue')
      },
      {
        path: 'search',
        name: 'searchSupports',
        component: () => import('../views/support/SupportList.vue')
      },
      {
        path: 'my',
        name: 'mySupports',
        component: () => import('../views/support/SupportList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: ':id/comments',
        name: 'supportComments',
        component: () => import('../views/support/SupportDetail.vue')
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 라우터 가드 설정
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  
  // 페이지 방문시 인증 상태 확인
  if (!to.meta.skipAuthCheck) {
    try {
      await userStore.checkAuth();
    } catch (error) {
      console.error('인증 상태 확인 중 오류:', error);
    }
  }
  
  const isLoggedIn = userStore.isAuthenticated;
  
  // 인증이 필요한 페이지 (meta.requiresAuth가 true인 경우)
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      console.log('인증 필요한 페이지 접근, 로그인으로 리다이렉트');
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  }
  
  // 게스트만 접근 가능한 페이지 (주로 로그인, 회원가입 페이지)
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isLoggedIn) {
      console.log('이미 로그인된 상태에서 게스트 페이지 접근, 홈으로 리다이렉트');
      return next({ path: '/' });
    }
  }
  
  next();
});

export default router;
