<template>
    <div class="container">
      <h2>직급 관리</h2>
      <div class="form-container">
        <h3>직급 생성</h3>
        <input type="text" v-model="newRank" placeholder="새로운 직급명" />
        <button @click="createRank">생성</button>
      </div>
      <div class="form-container">
        <h3>직급 수정</h3>
        <select v-model="selectedRankId">
          <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
            {{ rank.name }}
          </option>
        </select>
        <input type="text" v-model="editedRank" placeholder="수정할 직급명" />
        <button @click="updateRank">수정</button>
      </div>
      <div class="form-container">
        <h3>직급 삭제</h3>
        <select v-model="selectedRankIdToDelete">
          <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
            {{ rank.name }}
          </option>
        </select>
        <button @click="deleteRank">삭제</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const ranks = ref([]);
  const newRank = ref('');
  const selectedRankId = ref('');
  const editedRank = ref('');
  const selectedRankIdToDelete = ref('');
  
  onMounted(async () => {
    await fetchRanks();
  });
  
  async function fetchRanks() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/duty/find/rank/all', {
        headers: {
          Authorization: token,
        },
      });
      ranks.value = response.data.rank;
    } catch (error) {
      console.error('Failed to fetch ranks:', error);
      alert('직급 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function createRank() {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/add/rank', {
        rankName: newRank.value,
      }, {
        headers: {
          Authorization: token,
        },
      });
      newRank.value = '';
      await fetchRanks();
    } catch (error) {
      console.error('Failed to create rank:', error);
      alert('직급 생성에 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function updateRank() {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/edit/rank', {
        rankId: selectedRankId.value,
        rankName: editedRank.value,
      }, {
        headers: {
          Authorization: token,
        },
      });
      editedRank.value = '';
      selectedRankId.value = '';
      await fetchRanks();
    } catch (error) {
      console.error('Failed to update rank:', error);
      alert('직급 수정에 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function deleteRank() {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/remove/rank', {
        data: {
          rankId: selectedRankIdToDelete.value,
        },
        headers: {
          Authorization: token,
        },
      });
      selectedRankIdToDelete.value = '';
      await fetchRanks();
    } catch (error) {
      console.error('Failed to delete rank:', error);
      alert('직급 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }
  </script>
  
  <style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.form-container {
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

input[type="text"] {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

select {
  width: 300px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1b2cba;
}
</style>