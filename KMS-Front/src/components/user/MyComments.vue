<template>
    <div class="container">
      <div class="header no-background no-shadow">
        <h2>내 댓글</h2>
        </div>
        <div>
        <p class="total-count">전체 {{ totalCount }}개</p>
      </div>
      <div class="comment-list" ref="commentList">
        <div v-for="comment in myComments" :key="comment.id" class="comment-item" @click="goToPost(comment.postId)">
          <div class="comment-content">{{ comment.content }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const myComments = ref([]);
  const currentPage = ref(1);
  const isLoading = ref(false);
  const commentList = ref(null);
  
  const totalCount = computed(() => myComments.value.length);
  
  onMounted(async () => {
    await fetchMyComments();
  });
  
  async function fetchMyComments() {
    if (isLoading.value) return;
  
    isLoading.value = true;
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/my-page/my-comment', {
        headers: {
          Authorization: token,
        },
        params: {
          page: currentPage.value,
          size: 10,
        },
      });
  
      myComments.value = [...myComments.value, ...response.data.docsInfoList];
      currentPage.value++;
    } catch (error) {
      console.error('Failed to fetch my comments:', error);
      // 오류 처리 로직 추가
    }
  
    isLoading.value = false;
  }
  
  function goToPost(postId) {
    if (postId) {
      router.push(`/wiki/detail/${postId}`);
    }
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
  
  .comment-list {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
  
  .comment-item {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .comment-item:hover {
    background-color: #e0e0e0;
  }
  
  .comment-content {
    font-size: 16px;
    margin-bottom: 10px;
  }
  </style>