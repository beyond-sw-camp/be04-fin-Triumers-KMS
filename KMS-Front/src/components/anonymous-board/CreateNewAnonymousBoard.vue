<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2 class="form-title">글 작성</h2>
      <button type="submit" class="submit-button" @click="saveAnonymousBoard">작성</button>
    </div>
    <div class="form">
      <div class="form-group">
        <input type="text" id="title" v-model="title" required class="form-input" placeholder="제목을 입력하세요" />
      </div>
      <div class="form-group">
        <textarea id="content" v-model="content" required class="form-textarea" placeholder="내용을 입력하세요"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const title = ref('');
const content = ref('');

async function saveAnonymousBoard() {
  try {
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/anonymous-board', {
      title: title.value,
      content: content.value,
      nickname: '익명', // 고정된 '익명' 값 전송
    });
    router.push(`/office-life/anonymous-board/${response.data.id}`);
  } catch (error) {
    console.error('Failed to save anonymous board:', error);
    // 에러 처리 로직 추가
    if (error.response) {
      if (error.response.status === 400) {
        alert('제목과 내용을 입력해주세요.');
      } else {
        alert('게시글 작성에 실패했습니다.');
      }
    } else {
      alert('네트워크 오류가 발생했습니다.');
    }
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
 
 .form-title {
  font-size: 35px;
  font-weight: bold;
 }
 
 .submit-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
 }

 .submit-button:hover {
  background-color: #0c5195;
}
 
 .form-group {
  margin-bottom: 20px;
 }

 .form-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 30px;
 }

 .form-input::placeholder {
  font-size: 30px;
}

 .form-input:hover {
  border-color: #888;
}
 
 .form-textarea {
  width: 100%;
  height: 300px;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  resize: vertical;
 }

 .form-textarea:hover {
  border-color: #888;
}
 </style>