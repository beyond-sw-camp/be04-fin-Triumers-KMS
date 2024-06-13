<template>
    <div class="quiz-management">
      <h2>퀴즈 관리</h2>
      <ul>
        <li v-for="(quiz, index) in quizzes" :key="index">
          {{ quiz.title }}
          <button @click="editQuiz(index)">수정</button>
          <button @click="deleteQuiz(index)">삭제</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        quizzes: [
          { title: 'Quiz 1', id: 1 },
          { title: 'Quiz 2', id: 2 },
          // ... (더 많은 퀴즈 데이터)
        ]
      };
    },
    methods: {
      editQuiz(index) {
        const quizId = this.quizzes[index].id;
        this.$router.push({ path: `/wiki/1/quiz/edit/${quizId}` });
      },
      deleteQuiz(index) {
        if (confirm('정말로 이 퀴즈를 삭제하시겠습니까?')) {
          this.quizzes.splice(index, 1);
          // 여기에 API 호출을 추가하여 서버에서도 삭제합니다.
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .quiz-management {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  </style>
  