<template>
  <div class="create-quiz-modal" v-if="isCreateQuizModalVisible">
    <div class="create-quiz-modal-content">
      <div class="create-quiz-header">
        <h2>Create Quiz</h2>
        <button @click="$emit('close-create-quiz')" class="close-btn">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="create-quiz-body">
        <form @submit.prevent="submitQuiz">
          <div class="form-group">
            <label for="questions" class="label-bold">퀴즈 문제</label>
            <div v-for="(question, qIndex) in questions" :key="qIndex" class="question">
              <div class="input-group">
                <input
                  type="text"
                  v-model="question.text"
                  placeholder="문제를 입력해주세요"
                  required
                  class="form-control"
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  v-model="question.answer"
                  placeholder="답안을 입력해주세요"
                  required
                  class="form-control"
                />
              </div>
              <div class="input-group">
                <input
                  type="text"
                  v-model="question.commentary"
                  placeholder="해설을 입력해주세요"
                  class="form-control"
                />
              </div>
              <div class="input-group">
                <label class="label-checkbox">
                  <input type="checkbox" v-model="question.active" /> 활성화
                </label>
              </div>
            </div>
          </div>
          <button type="submit" class="submit-btn">퀴즈 생성</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps({
  isCreateQuizModalVisible: {
    type: Boolean,
    required: true,
  },
  postId: {
    type: Number,
    required: true,
  },
  tabId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['close-create-quiz', 'quizCreated']);

const questions = ref([
  {
    text: '',
    answer: '',
    commentary: '',
    active: true,
  },
]);

const submitQuiz = async () => {
  const quizData = {
    content: questions.value[0].text,
    answer: questions.value[0].answer,
    commentary: questions.value[0].commentary,
    status: questions.value[0].active,
    postId: props.postId,
    tapId: props.tabId,
    questionerId: 1, // questionerId를 1로 고정
  };

  try {
    const response = await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/quiz/regist`, quizData);
    console.log('퀴즈 제출 성공:', response.data);
    alert('퀴즈가 성공적으로 생성되었습니다.');
    emit('close-create-quiz');
    emit('quizCreated', response.data.id); 
  } catch (error) {
    console.error('퀴즈 제출 실패:', error);
    alert('퀴즈 생성 중 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.create-quiz-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.create-quiz-modal-content {
  background-color: white;
  width: 600px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.create-quiz-header {
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
  color: #042444;
}

.close-btn:hover {
  color: #021a2f;
}

.create-quiz-body {
  margin-top: 20px;
}

.question {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 10px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.label-bold {
  font-weight: bold;
  margin-bottom: 10px;
}

.label-checkbox {
  display: flex;
  align-items: center;
  margin-left: 5px;
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

.submit-btn:hover {
  background-color: #021a2f;
}
</style>