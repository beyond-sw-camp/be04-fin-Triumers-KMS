<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>마이페이지</h2>
    </div>
    <div class="button-group" style="justify-content: center; margin-bottom: 20px;">
      <button @click="goToChangePassword" class="button">비밀번호 변경</button>
      <button @click="goToEditInfo" class="button">내 정보 수정</button>
    </div>
    <div class="user-info" v-if="userInfo" style="text-align: center;">
      <img :src="profileImg" alt="프로필 이미지" class="profile-img" />
      <div class="info-row">
        <span class="value" style="font-weight: bold;">{{ userInfo.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">전화번호:</span>
        <span class="value">{{ userInfo.phoneNumber }}</span>
      </div>
      <div class="info-row">
        <span class="label">이메일:</span>
        <span class="value">{{ userInfo.email }}</span>
      </div>
      <div class="info-row">
        <span class="label">입사일:</span>
        <span class="value">{{ userInfo.startDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">퇴사일:</span>
        <span class="value">{{ userInfo.endDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">팀:</span>
        <span class="value">{{ userInfo.team.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">직책:</span>
        <span class="value">{{ userInfo.position.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">직급:</span>
        <span class="value">{{ userInfo.rank.name }}</span>
      </div>
    </div>
    <div class="section">
      <h3 class="section-title">내 활동</h3>
      <div class="activity-container">
        <div class="activity-card" @click="goToMyPosts">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>내 게시물</span>
        </div>
        <div class="activity-card" @click="goToMyComments">
          <i class="fa-solid fa-comment"></i>
          <span>내 댓글</span>
        </div>
        <div class="activity-card" @click="goToFavoritePosts">
          <i class="fa-solid fa-bookmark"></i>
          <span>즐겨찾기</span>
        </div>
        <div class="activity-card" @click="goToLikedPosts">
          <i class="fa-solid fa-heart"></i>
          <span>좋아요 한 게시물</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import defaultProfileImage from '@/assets/images/profile_image.png'; // 기본 이미지 경로를 import

const router = useRouter();
const store = useStore();
const userInfo = ref(null);

onMounted(async () => {
  if (!store.state.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  try {
    store.dispatch('checkUserInfo');
    const token = localStorage.getItem('token');
    const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/my-page', {
      headers: {
        Authorization: token,
      },
    });
    userInfo.value = response.data.employee[0];
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    // 오류 처리 로직 추가
  }
});

function goToChangePassword() {
  router.push('/my-page/edit-password');
}

function goToEditInfo() {
  router.push('/my-page/edit');
}

function goToMyPosts() {
  router.push('/my-page/posts');
}

function goToLikedPosts() {
  router.push('/my-page/liked-posts');
}

function goToFavoritePosts() {
  router.push('/my-page/favorite-posts');
}

function goToMyComments() {
  router.push('/my-page/comments');
}

// 프로필 이미지 URL이 존재하지 않으면 기본 이미지를 반환하는 computed 속성
const profileImg = computed(() => {
  return userInfo.value && userInfo.value.profileImg ? userInfo.value.profileImg : defaultProfileImage;
});
</script>
  
<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .no-background {
    background-color: transparent;
  }
  
  .no-shadow {
    box-shadow: none;
  }
  
  .user-info {
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .info-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .label {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .value {
    margin-left: 10px;
  }
  
  .profile-img {
    max-width: 150px;
    max-height: 150px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .button {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #042444;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .button:hover {
    background-color: #042444c5;
  }
  
  .section {
    margin-top: 40px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .activity-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .activity-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .activity-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .activity-card i {
    font-size: 24px;
    color: #555;
  }
  
  .activity-card span {
    color: #333;
  }
</style>