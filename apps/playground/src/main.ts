import { createApp } from 'vue'
import KunUI from '@kun/ui-vue'
import '@kun/ui-vue/style.css' // component scoped styles (ripple, icon inherit)
import './style.css' // tailwind + @kun/tokens + @source wiring
import App from './App.vue'

createApp(App).use(KunUI).mount('#app')
