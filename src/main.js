import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import store from './store'

// CSS
import 'element-plus/dist/index.css'
import 'ol-ext/dist/ol-ext.min.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.mount('#app')
