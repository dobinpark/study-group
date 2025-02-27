import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/common.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persist'

console.log('환경 변수 - API URL:', process.env.VUE_APP_API_URL);

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)

app.mount('#app')
