import './assets/main.css'

import Notifications from '@kyvg/vue3-notification'
import axios from 'axios';
import { createApp } from 'vue'
import VueAxios from 'vue-axios';

import App from './App.vue'

const app = createApp(App);

app.use(VueAxios, axios);
app.use(Notifications);
app.mount('#app');
