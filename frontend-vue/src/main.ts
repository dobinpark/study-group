import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/common.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persist'

// 환경 변수 디버깅 정보 출력
console.log('=== 환경 설정 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('VUE_APP_API_URL:', process.env.VUE_APP_API_URL);
console.log('VUE_APP_TITLE:', process.env.VUE_APP_TITLE);
console.log('=================');

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

// 전역 에러 핸들러 추가
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Info:', info)
  }
}

app.use(pinia)
app.use(router)

app.mount('#app')
