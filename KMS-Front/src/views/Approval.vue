<template>
  <div class="container">
    <div class="button-group">
      <button @click="goToRequestedApprovals" class="button">요청한 결재</button>
      <button @click="goToReceivedApprovals" class="button">요청받은 결재</button>
      <button @click="goToCreateApproval" class="button">결재 요청</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToRequestedApprovals() {
  router.push('/approval/requested');
}

function goToReceivedApprovals() {
  router.push('/approval/received');
}

function goToCreateApproval() {
  router.push('/approval/new');
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.button {
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 16px;
}

.button:hover {
  background-color: #1b2cba;
}
</style>