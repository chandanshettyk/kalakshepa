import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

import './style.css'

import 'vue3-chessboard/style.css'

createApp(App)
    .use(router)
    .mount('#app')