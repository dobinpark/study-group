import axios from 'axios';
import router from '../router';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL || '/api',
    withCredentials: true,
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default instance;
