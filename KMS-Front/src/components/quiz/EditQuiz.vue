<template>
  <div class="quiz-modal" v-if="isEditQuizModalVisible">
    <div class="quiz-modal-content">
      <div class="quiz-header">
        <h2>퀴즈 수정</h2>
        <button @click="closeModal" class="close-btn">&times;</button>
      </div>
      <div class="quiz-body">
        <div class="original-quiz" v-if="originalQuizData">
          <h3>원래 퀴즈</h3>
          <p><strong>문제:</strong> {{ originalQuizData.content }}</p>
          <p><strong>답안:</strong> {{ originalQuizData.answer }}</p>
          <p><strong>참조 내용:</strong> {{ originalQuizData.commentary }}</p>
          <p><strong>활성화:</strong> {{ originalQuizData.status ? '예' : '아니오' }}</p>
        </div>
        <hr>
        <form @submit.prevent="submitQuiz">
          <div class="form-group">
            <label for="quizContent">문제</label>
            <input type="text" id="quizContent" v-model="quizData.content" placeholder="문제를 입력하세요" required />
          </div>
          <div class="form-group">
            <label for="quizAnswer">답안</label>
            <input type="text" id="quizAnswer" v-model="quizData.answer" placeholder="답안을 입력하세요" required />
          </div>
          <div class="form-group">
            <label for="quizCommentary">참조 내용</label>
            <input type="text" id="quizCommentary" v-model="quizData.commentary" placeholder="참조 내용을 입력하세요" />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="quizData.status" /> 활성화
            </label>
          </div>
          <button type="submit" class="submit-btn">퀴즈 수정</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  quizId: {
    type: Number,
    required: true,
  },
  isEditQuizModalVisible: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['close-edit-quiz']);

const originalQuizData = ref(null);
const quizData = ref({
  content: '',
  answer: '',
  commentary: '',
  status: true,
});

onMounted(() => {
  fetchQuizData();
});

const closeModal = () => {
  emit('close-edit-quiz');
};

const fetchQuizData = async () => {
  try {
    const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/quiz/contents?id=${props.quizId}`);
    originalQuizData.value = response.data;
    quizData.value = { ...response.data };
  } catch (error) {
    console.error('퀴즈 데이터 가져오기 실패:', error);
  }
};

const submitQuiz = async () => {
  try {
    const response = await axios.put(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/quiz/edit`, quizData.value);
    console.log('퀴즈 수정 완료:', response.data);
    alert('퀴즈가 성공적으로 수정되었습니다.');
    closeModal();
  } catch (error) {
    console.error('퀴즈 수정 실패:', error);
    alert('퀴즈 수정 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.quiz-modal {
  position: fixed;
  top: 15%;
  left: 15%;
  width: 70%;
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.quiz-modal-content {
  background: white;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 20px;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.quiz-body {
  margin-top: 20px;
}

.original-quiz {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>