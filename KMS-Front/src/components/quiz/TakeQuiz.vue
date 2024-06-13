<template>
  <div class="quiz-modal" v-if="isQuizModalVisible">
    <div class="quiz-modal-content">
      <div class="quiz-header">
        <h2>QUIZ</h2>
        <button @click="$emit('close-quiz')" class="close-btn">&times;</button>
      </div>
      <div class="quiz-body">
        <div class="quiz-question" v-if="quiz">
          <p>{{ quiz.content }}</p>
          <input
            type="text"
            v-model="answer"
            class="answer-input"
            placeholder="문제의 답을 입력해주세요."
            @keyup.enter="submitQuestion"
          />
          <button @click="submitQuestion" class="submit-btn">Submit</button>
          <div v-if="showResult" class="quiz-results">
            <p v-if="isCorrect" class="correct">정답입니다!</p>
            <div v-else class="incorrect">
              <p>틀렸습니다. 정답은 {{ quiz.answer }}입니다.</p>
              <p v-if="quiz.commentary">해설: {{ quiz.commentary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
  isQuizModalVisible: {
    type: Boolean,
    required: true,
  },
  quiz: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close-quiz']);

const answer = ref('');
const showResult = ref(false);
const isCorrect = ref(false);

const submitQuestion = async () => {
  try {
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/answer/submit', {
      quizId: props.quiz.id,
      answer: answer.value,
      employeeId: 1,
    });
    isCorrect.value = answer.value.trim().toLowerCase() === props.quiz.answer.trim().toLowerCase();
    showResult.value = true;
  } catch (error) {
    console.error('답안 제출 실패:', error);
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

.quiz-question {
  margin-bottom: 20px;
}

.quiz-results {
  margin-top: 10px;
  font-size: 18px;
  font-weight: bold;
}

.answer-input {
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.correct {
  color: green;
}

.incorrect {
  color: red;
}

.incorrect p {
  margin-bottom: 5px;
}
</style>