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
import CreateSupport from '../views/support/CreateSupport.vue';
import SupportDetail from '../views/support/SupportDetail.vue';
import EditSupport from '../views/support/EditSupport.vue';
import SupportList from '../views/support/SupportList.vue';
import MessageList from '../views/messages/MessageList.vue';
import MessageDetail from '../views/messages/MessageDetail.vue';
import MyPage from '../views/MyPage.vue';
import StudyRequests from '../views/study/StudyRequests.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { public: true },
  },
  {
    path: '/home',
    name: 'home-alias',
    component: Home,
    meta: { public: true },
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
    meta: { public: true },
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
  },
  {
    path: '/posts/create',
    component: PostCreate,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id',
    component: PostDetail,
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
  },
  {
    path: '/supports/create',
    name: 'supports-create',
    component: CreateSupport,
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
  {
    path: '/messages',
    name: 'messages',
    component: MessageList,
    meta: { requiresAuth: true }
  },
  {
    path: '/messages/:id',
    name: 'message-detail',
    component: MessageDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: MyPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/study-requests',
    name: 'study-requests',
    component: StudyRequests,
    meta: { requiresAuth: true }
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

  console.log(`Router Guard: beforeEach 시작 - to.path: ${to.path}, from.path: ${from.path}`); // ✅ beforeEach 시작 로그

  // public 라우트 또는 메인 페이지는 인증 상태에 관계없이 항상 접근 가능
  if (to.meta.public || to.path === '/' || to.path === '/home') {
    console.log('Router Guard: public 라우트 또는 메인 페이지 접근, 인증 확인 없이 허용');
    return next();
  }

  // 로그인 페이지로 이동하는 경우 특별 처리
  if (to.name === 'login') {
    console.log('Router Guard: 로그인 페이지 접근');
    
    // 명시적인 로그아웃 요청이 아닌데 이미 로그인된 상태인 경우 홈으로 리다이렉트
    if (authStore.isAuthenticated && !from.query.loggedOut) {
      console.log('Router Guard: 이미 로그인된 상태로 로그인 페이지 접근, 홈으로 리다이렉트');
      return next({ path: '/' });
    }
    
    // 로그인 페이지 접근은 세션 체크 없이 허용 (쿠키 충돌 방지)
    console.log('Router Guard: 로그인 페이지 접근 허용');
    return next();
  }

  // 세션 체크가 완료되지 않았으면 대기 (초기 로딩 시 불필요한 리다이렉트 방지)
  if (!authStore.sessionChecked) {
    console.log('Router Guard: 세션 체크 대기 중... - to.path:', to.path); // ✅ 세션 체크 대기 로그
    try {
      await authStore.checkSession();
      console.log('Router Guard: 세션 체크 완료 - isAuthenticated:', authStore.isAuthenticated); // ✅ 세션 체크 완료 로그
    } catch (error) {
      console.log('Router Guard: 세션 체크 중 오류 발생, 인증 상태 초기화', error);
      authStore.clearUser();
    } finally {
      console.log('Router Guard: 세션 체크 프로세스 완료 - sessionChecked:', authStore.sessionChecked);
    }
  }

  const requiresAuth = to.meta.requiresAuth;
  const isAuth = authStore.isAuthenticated;

  console.log(`Router Guard: 라우트 가드 검사 - to.path: ${to.path}, requiresAuth: ${requiresAuth}, isAuthenticated: ${isAuth}`); // ✅ 라우트 가드 검사 로그

  if (requiresAuth) {
    if (!isAuth) {
      console.log('Router Guard: 인증 필요, 로그인 페이지로 리다이렉트 - to.path:', to.path); // ✅ 인증 필요, 리다이렉트 로그
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    } else {
      console.log('Router Guard: 인증 완료, 라우트 진행 - to.path:', to.path); // ✅ 인증 완료, 진행 로그
      next();
    }
  } else {
    console.log('Router Guard: 인증 불필요, 라우트 진행 - to.path:', to.path); // ✅ 인증 불필요, 진행 로그
    next();
  }
  console.log('Router Guard: beforeEach 완료 - to.path:', to.path); // ✅ beforeEach 완료 로그
});

export default router;
