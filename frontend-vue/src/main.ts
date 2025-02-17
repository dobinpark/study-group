import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/global.css'
import './assets/styles/common.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist)

app.use(pinia)
app.use(router)

app.mount('#app')
