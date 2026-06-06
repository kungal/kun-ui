import { createApp } from 'vue'
import KunUI from '@kungal/ui-vue'
import '@kungal/ui-vue/style.css' // component scoped styles (ripple, icon inherit)
import './style.css' // tailwind + @kungal/tokens + @source wiring
import App from './App.vue'

createApp(App).use(KunUI).mount('#app')
