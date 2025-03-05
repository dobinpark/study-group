import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../store/auth';
import FindPasswordModal from '../components/FindPasswordModal.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Profile from '../views/Profile.vue';
import Signup from '../views/Signup.vue';
import MyStudies from '../views/study/MyStudies.vue';
import StudyGroupList from '../views/study/StudyGroupList.vue';
import CreateStudyGroup from '../views/study/CreateStudyGroup.vue';
import StudyGroupDetail from '../views/study/StudyGroupDetail.vue';
import EditStudyGroup from '../views/study/EditStudyGroup.vue';
import PostCreate from '../views/community/CreatePost.vue';
import PostDetail from '../views/community/PostDetail.vue';
import PostEdit from '../views/community/EditPost.vue';
import PostList from '../views/community/PostList.vue';
import SupportCreate from '../views/support/CreateSupport.vue';
import SupportDetail from '../views/support/SupportDetail.vue';
import EditSupport from '../views/support/EditSupport.vue';
import SupportList from '../views/support/SupportList.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/find-password',
    name: 'findPassword',
    component: FindPasswordModal,
  },
  {
    path: '/my-studies',
    name: 'myStudyGroups',
    component: MyStudies,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-groups',
    name: 'study-groups',
    component: StudyGroupList,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-groups/create',
    name: 'study-groups-create',
    component: CreateStudyGroup,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-groups/:id',
    name: 'study-group-detail',
    component: StudyGroupDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-groups/:id/edit',
    name: 'studyGroupEdit',
    component: EditStudyGroup,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts',
    name: 'post-list',
    component: PostList,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/create',
    component: PostCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id',
    component: PostDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id/edit',
    component: PostEdit,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/categories/:category',
    component: PostList,
  },
  {
    path: '/posts/search',
    component: PostList,
  },
  {
    path: '/posts/my',
    component: PostList,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id/comments',
    component: PostDetail,
  },
  {
    path: '/supports',
    name: 'supports',
    component: SupportList,
    meta: { requiresAuth: true }
  },
  {
    path: '/supports/create',
    name: 'supports-create',
    component: SupportCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/supports/:id',
    name: 'supportDetail',
    component: SupportDetail,
  },
  {
    path: '/supports/:id/edit',
    name: 'supportEdit',
    component: EditSupport,
    meta: { requiresAuth: true }
  },
  {
    path: '/supports/categories/:category',
    name: 'supportsByCategory',
    component: SupportList,
  },
  {
    path: '/supports/search',
    name: 'searchSupports',
    component: SupportList,
  },
  {
    path: '/supports/my',
    name: 'mySupports',
    component: SupportList,
    meta: { requiresAuth: true }
  },
  {
    path: '/supports/:id/comments',
    name: 'supportComments',
    component: SupportDetail,
  },
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

  // 세션 체크가 완료되지 않았으면 대기 (초기 로딩 시 불필요한 리다이렉트 방지)
  if (!authStore.sessionChecked) {
    console.log('Router Guard: 세션 체크 대기 중...'); // 로깅 추가
    await authStore.checkSession();
    console.log('Router Guard: 세션 체크 완료'); // 로깅 추가
  }

  const requiresAuth = to.meta.requiresAuth;
  const isAuth = authStore.isAuthenticated;

  console.log(`Router Guard: to.path: ${to.path}, requiresAuth: ${requiresAuth}, isAuthenticated: ${isAuth}`); // 로깅 추가

  if (requiresAuth) {
    if (!isAuth) {
      console.log('Router Guard: 인증 필요, 로그인 페이지로 리다이렉트 - to.path:', to.path); // 로깅 메시지 개선
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      console.log('Router Guard: 인증 완료, 라우트 진행 - to.path:', to.path); // 로깅 메시지 개선
      next();
    }
  } else if (to.name === 'login' && isAuth) {
    console.log('Router Guard: 로그인 페이지 접근, 이미 로그인 상태, 홈으로 리다이렉트 - to.path:', to.path); // 로깅 메시지 개선
    next({ path: '/' });
  }
  else {
    console.log('Router Guard: public 라우트, 라우트 진행 - to.path:', to.path); // 로깅 메시지 개선
    next();
  }
});

export default router;
