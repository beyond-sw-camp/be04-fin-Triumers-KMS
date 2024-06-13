<template>
    <div>
      <router-view></router-view> <!-- 하위 라우트를 표시 -->
    </div>
  </template>
  
  <script>
  import { RouterView } from "vue-router";
  export default {
    name: 'Group'
  }
  </script>  