<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>비밀번호 변경</h2>
      <button type="submit" class="submit-button" @click="changePassword">변경하기</button>
    </div>
    <div class="form-container">
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="oldPassword">이전 비밀번호:</label>
          <input type="password" id="oldPassword" v-model="oldPassword" required />
        </div>
        <div class="form-group">
          <label for="newPassword">새로운 비밀번호:</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
          대문자, 소문자, 숫자 각각 한 개 이상 포함, 8~12자
        </div>
        <div class="form-group">
          <label for="confirmPassword">비밀번호 확인:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/auth/edit/password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    }, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status === 210) {
      router.push('/welcome');
    } else {
      alert('비밀번호가 성공적으로 변경되었습니다.');
      router.push('/my-page');
    }
  } catch (error) {
    console.error('Failed to change password:', error);
    if (error.response && error.response.data) {
      alert(error.response.data.message);
    } else {
      alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.no-background {
  background-color: transparent;
}

.no-shadow {
  box-shadow: none;
}

.form-container {
  padding: 20px;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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
