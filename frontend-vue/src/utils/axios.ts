import axios, { type AxiosInstance, isAxiosError } from 'axios'; // isAxiosError 를 임포트에 추가

// Axios 인스턴스 생성
const instance: AxiosInstance = axios.create({ // AxiosInstance 타입 명시
    baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
    timeout: 10000
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config) => {
        // 세션 기반 인증에서는 별도의 토큰을 헤더에 추가하지 않습니다.
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        // 세션 기반 인증에서는 401 에러 처리를 컴포넌트 레벨에서 수행하는 것이 더 유연합니다.
        return Promise.reject(error);
    }
);

export { isAxiosError };
export default instance;
