<template>
    <div class="container">
      <h2>회원 비밀번호 초기화</h2>
      <p>회원의 비밀번호를 초기화하시겠습니까?</p>
      <button class="submit-button" @click="resetMemberPassword">초기화</button>
    </div>
  </template>
  
  <script setup>
  import { useRouter, useRoute } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const route = useRoute();
  const memberId = route.params.id;
  
  async function resetMemberPassword() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/edit/password', {
        email: memberId,
      }, {
        headers: {
          Authorization: token,
        },
      });
  
      const newPassword = response.data.password;
      alert(`회원의 비밀번호가 초기화되었습니다. 새로운 비밀번호: ${newPassword}`);
      router.push({ name: 'EditUser', params: { id: memberId } });
    } catch (error) {
      console.error('Failed to reset member password:', error);
      // 오류 처리 로직 추가
      alert('회원 비밀번호 초기화에 실패했습니다. 다시 시도해주세요.');
    }
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .submit-button {
    padding: 10px 20px;
    background-color: #042444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-button:hover {
    background-color: #1b2cba;
  }
  </style>