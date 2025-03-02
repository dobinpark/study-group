import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/auth';

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
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 전역 네비게이션 가드
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // 이미 세션을 체크했는지 확인
  if (!authStore.sessionChecked) {
    await authStore.checkSession();
  }
  
  // 인증이 필요한 라우트에 대한 접근 제어
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
