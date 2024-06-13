import { createStore } from 'vuex';
import router from '../router/mainRouter.js';

const store = createStore({
  state: {
    isLoggedIn: false,
    userRole: '',
  },
  mutations: {
    setLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    setUserRole(state, userRole) {
      state.userRole = userRole;
    },
  },
  actions: {
    login({ commit }, { token, userRole }) {
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', userRole);
      commit('setLoggedIn', true);
      commit('setUserRole', userRole);
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      commit('setLoggedIn', false);
      commit('setUserRole', '');
      commit('setRole', '');
      router.push('/login'); // 로그아웃 시 로그인 페이지로 리다이렉트
    },
    checkUserInfo({ commit }) {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      if (token && userRole) {
        commit('setLoggedIn', true);
        commit('setUserRole', userRole);
        if (router.currentRoute.value.path === '/login') {
          router.push('/wiki/1');
        }
      } else {
        commit('setLoggedIn', false);
        commit('setUserRole', '');
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
        }
      }
    },
  },
});

export default store;