import './assets/main.css';

// npm install vue bootstrap bootstrap-vue-3
// npm install axios
// npm install vue-router@next
// npm install html2pdf.js
// npm install vuex
// npm install marked
// npm install jwt-decode

import { createApp } from 'vue';
import { createStore } from 'vuex'
import router from './router/mainRouter.js';
import App from './App.vue';
import axios from 'axios';
import store from './store/index.js';

axios.defaults.baseURL = 'http://triumers-back.ap-northeast-2.elasticbeanstalk.com'; // 백엔드 서버의 주소와 포트를 지정합니다.
axios.defaults.withCredentials = true; // 쿠키를 포함하여 요청을 보내도록 설정합니다.

// Axios 인터셉터 설정
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            alert('로그인 이후 이용해주세요.');
            store.dispatch('logout'); // Vuex 스토어에서 로그아웃 액션을 호출합니다.
            router.push('/login'); // 로그인 페이지로 리다이렉트합니다.
        }
        return Promise.reject();
    }
);

import BootstrapVue3 from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';

const app = createApp(App);

app.use(router);
app.use(createStore(store));
app.use(store);
app.use(BootstrapVue3);
app.mount('#app');