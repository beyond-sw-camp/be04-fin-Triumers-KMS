<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>내 정보 수정</h2>
      <button type="submit" class="submit-button" @click="updateMyInfo">수정하기</button>
    </div>
    <div class="form-container">
      <form @submit.prevent="updateMyInfo">
        <div class="form-group">
          <label for="name">이름:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">전화번호:</label>
          <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
        </div>
        <div class="form-group">
          <label for="profileImg">프로필 이미지:</label>
          <input type="file" id="profileImg" @change="handleProfileImgChange" />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const name = ref('');
const phoneNumber = ref('');
const selectedProfileImg = ref(null);

onMounted(async () => {
  await fetchMyInfo();
});

async function fetchMyInfo() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('/my-page', {
      headers: {
        Authorization: token,
      },
    });
    const userInfo = response.data.employee[0];
    name.value = userInfo.name;
    phoneNumber.value = userInfo.phoneNumber;
  } catch (error) {
    console.error('Failed to fetch my info:', error);
    // 오류 처리 로직 추가
  }
}

function handleProfileImgChange(event) {
  selectedProfileImg.value = event.target.files[0];
}

async function updateMyInfo() {
  try {
    const token = localStorage.getItem('token');
    let profileImgUrl = null;

    if (selectedProfileImg.value) {
      const formData = new FormData();
      formData.append('image', selectedProfileImg.value);
      
      const uploadResponse = await axios.post('/s3/upload-image', formData, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      profileImgUrl = uploadResponse.data;  // 반환된 URL을 저장
      console.log(profileImgUrl);
    }

    const requestData = {
      name: name.value,
      phoneNumber: phoneNumber.value,
      profileImg: profileImgUrl
    };

    await axios.post('/auth/edit/my-info', requestData, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });
    
    alert('내 정보가 성공적으로 수정되었습니다.');
    router.push('/my-page');
  } catch (error) {
    console.error('Failed to update my info:', error);
    // 오류 처리 로직 추가
    alert('내 정보 수정에 실패했습니다. 다시 시도해주세요.');
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

input[type="text"],
input[type="tel"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[type="file"] {
  margin-top: 5px;
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
