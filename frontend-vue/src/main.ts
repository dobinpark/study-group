import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { BootstrapVue3 } from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import './assets/css/global.css'
import axios from 'axios'
import { createPinia } from 'pinia'

// Axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000', // NestJS API 서버 주소
})

// Vue 애플리케이션 생성
const app = createApp(App)

// Axios를 전역 속성으로 추가
app.config.globalProperties.$http = axiosInstance

// 라우터 및 BootstrapVue3 플러그인 사용
app.use(router)
app.use(BootstrapVue3)
app.use(createPinia())

// 애플리케이션 마운트
app.mount('#app')
