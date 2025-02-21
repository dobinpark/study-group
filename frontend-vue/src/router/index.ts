import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import LoginView from '../views/auth/Login.vue';
import SignupView from '../views/auth/Signup.vue';
import FindPasswordView from '../views/auth/FindPassword.vue';
import StudyGroupListView from '../views/study/StudyGroupList.vue';
import StudyGroupCreateView from '../views/study/StudyGroupCreate.vue';
import StudyGroupDetailView from '../views/study/StudyGroupDetail.vue';
import StudyGroupEditView from '../views/study/StudyGroupEdit.vue';
import MyStudyGroupsView from '../views/study/MyStudyGroups.vue';
import ProfileView from '../views/user/Profile.vue';
import PostListView from '../views/community/PostList.vue';
import PostCreateView from '../views/community/PostCreate.vue';
import PostDetailView from '../views/community/PostDetail.vue';
import PostEditView from '../views/community/PostEdit.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/auth/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/auth/signup',
        name: 'signup',
        component: SignupView
    },
    {
        path: '/auth/find-password',
        name: 'findPassword',
        component: FindPasswordView
    },
    {
        path: '/study-groups',
        name: 'studyGroups',
        component: StudyGroupListView
    },
    {
        path: '/study-groups/create',
        name: 'studyGroupCreate',
        component: StudyGroupCreateView,
        meta: { requiresAuth: true }
    },
    {
        path: '/study-groups/:id',
        name: 'studyGroupDetail',
        component: StudyGroupDetailView
    },
    {
        path: '/study-groups/:id/edit',
        name: 'studyGroupEdit',
        component: StudyGroupEditView,
        meta: { requiresAuth: true }
    },
    {
        path: '/my-study-groups',
        name: 'myStudyGroups',
        component: MyStudyGroupsView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },
    {
        path: '/users/:id/profile',
        name: 'userProfile',
        component: ProfileView
    },
    {
        path: '/posts',
        name: 'posts',
        children: [
            {
                path: '',
                name: 'postList',
                component: PostListView,
            },
            {
                path: 'create',
                name: 'postCreate',
                component: PostCreateView,
                meta: { requiresAuth: true }
            },
            {
                path: ':id',
                name: 'postDetail',
                component: PostDetailView
            },
            {
                path: ':id/edit',
                name: 'postEdit',
                component: PostEditView,
                meta: { requiresAuth: true }
            },
            {
                path: 'categories/:category',
                name: 'postsByCategory',
                component: PostListView
            },
            {
                path: 'search',
                name: 'searchPosts',
                component: PostListView
            },
            {
                path: 'my',
                name: 'myPosts',
                component: PostListView,
                meta: { requiresAuth: true }
            },
            {
                path: ':id/comments',
                name: 'postComments',
    component: PostDetailView
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

// 인증이 필요한 라우트에 대한 가드 설정
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('user');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/auth/login');
    } else {
        next();
    }
});

export default router;
