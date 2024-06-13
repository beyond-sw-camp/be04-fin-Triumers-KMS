<template>
    <div class="container">
      <h2>직책 관리</h2>
      <div class="form-container">
        <h3>직책 생성</h3>
        <input type="text" v-model="newPosition" placeholder="새로운 직책명" />
        <button @click="createPosition">생성</button>
      </div>
      <div class="form-container">
        <h3>직책 수정</h3>
        <select v-model="selectedPositionId">
          <option v-for="position in positions" :key="position.id" :value="position.id">
            {{ position.name }}
          </option>
        </select>
        <input type="text" v-model="editedPosition" placeholder="수정할 직책명" />
        <button @click="updatePosition">수정</button>
      </div>
      <div class="form-container">
        <h3>직책 삭제</h3>
        <select v-model="selectedPositionIdToDelete">
          <option v-for="position in positions" :key="position.id" :value="position.id">
            {{ position.name }}
          </option>
        </select>
        <button @click="deletePosition">삭제</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const positions = ref([]);
  const newPosition = ref('');
  const selectedPositionId = ref('');
  const editedPosition = ref('');
  const selectedPositionIdToDelete = ref('');
  
  onMounted(async () => {
    await fetchPositions();
  });
  
  async function fetchPositions() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/duty/find/position/all', {
        headers: {
          Authorization: token,
        },
      });
      positions.value = response.data.position;
    } catch (error) {
      console.error('Failed to fetch positions:', error);
      alert('직책 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function createPosition() {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/add/position', {
        positionName: newPosition.value,
      }, {
        headers: {
          Authorization: token,
        },
      });
      newPosition.value = '';
      await fetchPositions();
    } catch (error) {
      console.error('Failed to create position:', error);
      alert('직책 생성에 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function updatePosition() {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/edit/position', {
        positionId: selectedPositionId.value,
        positionName: editedPosition.value,
      }, {
        headers: {
          Authorization: token,
        },
      });
      editedPosition.value = '';
      selectedPositionId.value = '';
      await fetchPositions();
    } catch (error) {
      console.error('Failed to update position:', error);
      alert('직책 수정에 실패했습니다. 다시 시도해주세요.');
    }
  }
  
  async function deletePosition() {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/duty/remove/position', {
        data: {
          positionId: selectedPositionIdToDelete.value,
        },
        headers: {
          Authorization: token,
        },
      });
      selectedPositionIdToDelete.value = '';
      await fetchPositions();
    } catch (error) {
      console.error('Failed to delete position:', error);
      alert('직책 삭제에 실패했습니다. 다시 시도해주세요.');
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