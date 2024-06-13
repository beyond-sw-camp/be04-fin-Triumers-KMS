<template>
    <div class="container">
      <div class="welcome-content" v-if="showContent">
        <h2 class="question">우리 회사를 사랑하십니까?</h2>
        <div class="button-container">
          <button class="yes-button" @click="navigateToJoin">Yes</button>
          <button class="no-button" @mouseover="runAway" v-if="showNoButton">No</button>
        </div>
      </div>
      <div class="yes-buttons-container" v-if="showYesButtons">
        <button class="yes-button" v-for="(button, index) in yesButtons" :key="index" @click="navigateToJoin">Yes</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const router = useRouter();
      const showContent = ref(true);
      const showNoButton = ref(true);
      const showYesButtons = ref(false);
      const runawayCount = ref(0);
      const yesButtons = ref([]);
  
      const navigateToJoin = () => {
        router.push('/welcome-to-join');
      };
  
      const runAway = (event) => {
        if (runawayCount.value < 5) {
          const noButton = event.target;
          const container = noButton.parentElement;
  
          const containerRect = container.getBoundingClientRect();
          const buttonRect = noButton.getBoundingClientRect();
  
          const newX = Math.random() * (containerRect.width - buttonRect.width);
          const newY = Math.random() * (containerRect.height - buttonRect.height);
  
          noButton.style.position = 'absolute';
          noButton.style.left = `${newX}px`;
          noButton.style.top = `${newY}px`;
  
          runawayCount.value++;
        } else {
          showNoButton.value = false;
          showContent.value = false;
          showYesButtons.value = true;
  
          setTimeout(() => {
            yesButtons.value = new Array(100).fill(true);
          }, 0);
        }
      };
  
      return {
        showContent,
        showNoButton,
        showYesButtons,
        runawayCount,
        yesButtons,
        navigateToJoin,
        runAway,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 40px); /* Adjusted height */
    position: relative;
  }
  
  .welcome-content, .yes-buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  
  .question {
    font-size: 72px; /* 세 배로 증가 */
    font-weight: bold; /* 굵은 글씨 */
    margin-bottom: 20px;
  }
  
  .button-container {
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .yes-button, .no-button {
    padding: 25px 30px; /* 다섯 배로 증가 */
    margin: 0 10px;
    font-size: 40px; /* 다섯 배로 증가 */
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .yes-button {
    background-color: #42b72a;
    color: white;
  }
  
  .no-button {
    background-color: #d9534f;
    color: white;
  }
  
  .yes-buttons-container {
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .yes-buttons-container .yes-button {
    margin: 5px;
  }
  </style>
  