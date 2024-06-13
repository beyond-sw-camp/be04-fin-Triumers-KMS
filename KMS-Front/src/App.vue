<template>
  <div id="app">
    <header>
      <Header />
    </header>
    <div class="main-container">
      <Navbar />
      <main>
        <router-view />
      </main>
    </div>
  </div>

  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import Navbar from './components/common/Navbar.vue';
import Header from '@/views/Header.vue';

const store = useStore();

onMounted(() => {
  store.dispatch('checkUserInfo');
});
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  flex: 0 0 auto;
  /* 필요에 따라 헤더의 높이를 조정하세요 */
}

.main-container {
  display: flex;
  flex: 1;
}

main {
  flex: 1;
  padding: 20px;
  /* 필요에 따라 추가 스타일을 정의하세요 */
}

/* 필요한 추가 스타일 */
</style>
