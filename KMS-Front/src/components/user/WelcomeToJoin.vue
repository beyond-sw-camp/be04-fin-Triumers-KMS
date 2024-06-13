<template>
    <div class="container">
        <div class="congrats-message">
            <img src="@/assets/images/pinkFlowerLeft.gif" alt="Left Flower" class="flower-image left-flower">
            <img src="@/assets/images/pinkFlowerLeft.gif" alt="Left Flower" class="flower-image left-flower">
            <img src="@/assets/images/pinkFlowerRight.gif" alt="Right Flower" class="flower-image right-flower">
            <img src="@/assets/images/pinkFlowerRight.gif" alt="Right Flower" class="flower-image right-flower">
        </div>
        <div class="congrats-message">
            <h2>귀하의 입사를 축하합니다 !</h2>
        </div>
        <div class="congrats-message">
            <img src="@/assets/images/pinkFlowerLeft.gif" alt="Left Flower" class="flower-image left-flower">
            <img src="@/assets/images/pinkFlowerLeft.gif" alt="Left Flower" class="flower-image left-flower">
            <img src="@/assets/images/pinkFlowerRight.gif" alt="Right Flower" class="flower-image right-flower">
            <img src="@/assets/images/pinkFlowerRight.gif" alt="Right Flower" class="flower-image right-flower">
        </div>
    </div>
</template>

<script setup>
  </script>
  
  <style scoped>
    .template {
        background-color: #f0f0f0;
    }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 40px);
    text-align: center;
  }
  
  .congrats-message {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  h2 {
    font-size: 40px;
    font-weight: bold;
    margin: 0 20px;
  }
  
  .left-flower {
    margin-right: 20px;
  }
  
  .right-flower {
    margin-left: 20px;
  }
  </style>
