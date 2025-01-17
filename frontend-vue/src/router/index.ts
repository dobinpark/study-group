import PostList from '../views/community/PostList.vue';
import CreatePost from '../views/community/CreatePost.vue';

const routes = [
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
    }
]; 