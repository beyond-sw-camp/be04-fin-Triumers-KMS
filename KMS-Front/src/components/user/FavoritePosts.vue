<template>
    <div class="container">
      <div class="header no-background no-shadow">
        <h2>즐겨찾기</h2>
        </div>
        <div>
        <p class="total-count">전체 {{ totalCount }}개</p>
      </div>
      <div class="post-list" ref="postList">
        <div v-for="post in favoritePosts" :key="post.id" class="post-item" @click="goToPostDetail((post.originId != 'null' ? post.originId : post.id))">
          <div class="post-title">{{ post.title }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const favoritePosts = ref([]);
  const currentPage = ref(1);
  const isLoading = ref(false);
  const postList = ref(null);
  
  const totalCount = computed(() => favoritePosts.value.length);
  
  onMounted(async () => {
    await fetchFavoritePosts();
  });
  
  async function fetchFavoritePosts() {
    if (isLoading.value) return;
  
    isLoading.value = true;
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/my-page/favorite-post', {
        headers: {
          Authorization: token,
        },
        params: {
          page: currentPage.value,
          size: 10,
        },
      });
  
      favoritePosts.value = [...favoritePosts.value, ...response.data.docsInfoList];
      currentPage.value++;
    } catch (error) {
      console.error('Failed to fetch favorite posts:', error);
      // 오류 처리 로직 추가
    }
  
    isLoading.value = false;
  }
  
  function goToPostDetail(postId) {
    router.push(`/wiki/detail/${postId}`);
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    margin-bottom: 20px;
  }
  
  .no-background {
    background-color: transparent;
  }
  
  .no-shadow {
    box-shadow: none;
  }
  
  .total-count {
    font-size: 14px;
    color: #888;
    margin-top: 5px;
  }
  
  .post-list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  
  .post-item {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .post-item:hover {
    background-color: #e0e0e0;
  }
  
  .post-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  </style>