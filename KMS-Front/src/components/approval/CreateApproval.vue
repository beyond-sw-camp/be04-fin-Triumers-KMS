<template>
  <div class="container">
    <h2>결재 요청</h2>
    <div class="spacer"></div>
    <div class="form-group">
      <label for="typeId" class="label-bold">결재 유형</label>
      <select v-model="approvalRequest.typeId" id="typeId" class="form-control">
        <option value="1">워크스페이스 생성 요청</option>
        <option value="2">스터디 생성 요청</option>
        <option value="3">속하지 않은 워크스페이스 열람 요청</option>
        <option value="4">기타</option>
      </select>
    </div>
    <div class="spacer"></div>
    <div class="form-group">
      <label class="label-bold">결재자 선택</label>
      <div class="search-input">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="직원 이름 검색"
          @input="searchEmployees"
          @keyup.enter="searchEmployees"
          class="form-control"
        />
        <button @click="searchEmployees" class="btn search-button">검색</button>
      </div>
      <div v-if="showSearchResults && !selectedEmployee" class="search-results">
        <div v-if="searchResults.length > 0">
          <div
            v-for="employee in searchResults"
            :key="employee.id"
            class="search-result"
            :class="{ 'selected': selectedEmployee && selectedEmployee.id === employee.id }"
            @click="selectEmployee(employee)"
          >
            {{ employee.name }} ({{ employee.team.name }} {{ employee.position.name }} {{ employee.rank.name }})
          </div>
        </div>
        <div v-else class="no-results">
          검색 결과가 없습니다.
        </div>
      </div>
      <div v-if="selectedEmployee" class="selected-employee">
        {{ selectedEmployee.name }} ({{ selectedEmployee.team.name }} {{ selectedEmployee.position.name }} {{ selectedEmployee.rank.name }})
        <button @click="clearSelectedEmployee" class="btn clear-button">X</button>
      </div>
    </div>
    <div class="form-group">
      <label for="content" class="label-bold">결재 내용</label>
      <textarea v-model="approvalRequest.content" id="content" rows="5" class="form-control"></textarea>
    </div>
    <div class="form-group">
      <button @click="createApproval" class="btn create-button" :disabled="!isFormValid">결재 요청</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const approvalRequest = ref({
  content: '',
  typeId: 1,
  requesterId: null,
  approverId: null,
});
const searchQuery = ref('');
const searchResults = ref([]);
const selectedEmployee = ref(null);
const showSearchResults = ref(false);

const isFormValid = computed(() => {
  return approvalRequest.value.content && approvalRequest.value.approverId;
});

async function searchEmployees() {
  // 검색어가 빈 문자열이면 아무 작업도 하지 않음
  if (searchQuery.value.trim() === '') {
    searchResults.value = [];
    showSearchResults.value = false;
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestBody = { name: searchQuery.value };
    const response = await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name`, requestBody, {
      headers: {
        Authorization: `${token}`,
      },
    });

    searchResults.value = response.data.employee;
    showSearchResults.value = true;
  } catch (error) {
    console.error('Error searching employees:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
}

function selectEmployee(employee) {
  selectedEmployee.value = employee;
  approvalRequest.value.approverId = employee.id;
  showSearchResults.value = false;
  searchQuery.value = '';
}

function clearSelectedEmployee() {
  selectedEmployee.value = null;
  approvalRequest.value.approverId = null;
  searchQuery.value = '';
  searchResults.value = [];
  showSearchResults.value = false;
}

async function createApproval() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestData = {
      content: approvalRequest.value.content,
      typeId: approvalRequest.value.typeId,
      requesterId: null,
      approverId: approvalRequest.value.approverId,
    };

    await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval`, requestData, {
      headers: {
        Authorization: `${token}`,
      },
    });

    alert('결재 요청이 생성되었습니다.');
    router.push('/approval/requested');
  } catch (error) {
    console.error('Error creating approval request:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      alert('결재 요청에 실패했습니다.');
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.label-bold {
  font-size: 20px;
}

.spacer {
  height: 10px;
}

.search-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.search-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
}

.search-button {
  margin-left: 10px;
  background-color: #042444;
  color: white;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #1b2cba;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
}

.search-result {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result:hover {
  background-color: #f5f5f5;
}

.search-result.selected {
  background-color: #e0e0e0;
}

.no-results {
  margin-bottom: 10px;
  color: #888;
}

.selected-employee {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.clear-button {
  margin-left: 10px;
  background-color: #042444;
  color: white;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #1b2cba;
}

.create-button {
  background-color: #042444;
  color: white;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #1b2cba;
}

.create-button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}
</style>