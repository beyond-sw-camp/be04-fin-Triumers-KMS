<template>
  <div class="container">
    <div>
      <h1>직원 조회</h1>
    </div>
    <div style="height: 20px;"></div>
    <button @click="toggleOrgChart" class="toggle-button">
      조직도
    </button>
    <div v-if="showOrgChart" class="org-chart">
      <OrganizationChart @employee-selected="openEmployeeModal" />
    </div>
    <div style="height: 20px;"></div>
    <div class="search-container">
      <input type="text" v-model="searchKeyword" placeholder="이름 검색" class="search-input" @input="searchEmployees" />
    </div>
    <div v-if="employees.length === 0 && searchKeyword !== ''" class="no-results">
      검색 결과가 없습니다.
    </div>
    <div class="employee-list">
      <div v-for="employee in employees" :key="employee.id" class="employee-item">
        <div class="employee-name">{{ employee.name }}</div>
        <div class="employee-team">{{ employee.team.name }}</div>
        <div class="employee-position">{{ employee.position.name }}</div>
        <div class="employee-rank">{{ employee.rank.name }}</div>
        <div class="employee-phone-number">{{ employee.phoneNumber }}</div>
        <div class="employee-email">{{ employee.email }}</div>
      </div>
    </div>
 
    <!-- Employee Modal -->
    <div v-if="selectedEmployee" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEmployeeModal">&times;</span>
        <h2>직원 정보</h2>
        <div class="employee-info">
          <div class="info-item">
            <strong>이름:</strong> {{ selectedEmployee.name }}
          </div>
          <div class="info-item">
            <strong>팀:</strong> {{ selectedEmployee.team.name }}
          </div>
          <div class="info-item">
            <strong>직책:</strong> {{ selectedEmployee.position.name }}
          </div>
          <div class="info-item">
            <strong>직급:</strong> {{ selectedEmployee.rank.name }}
          </div>
          <div class="info-item">
            <strong>전화번호:</strong> {{ selectedEmployee.phoneNumber }}
          </div>
          <div class="info-item">
            <strong>이메일:</strong> {{ selectedEmployee.email }}
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue';
 import axios from 'axios';
 import OrganizationChart from '@/components/organization/OrganizationChart.vue';
 
 const searchKeyword = ref('');
 const employees = ref([]);
 const showOrgChart = ref(false);
 const selectedEmployee = ref(null);
 
 onMounted(async () => {
  await searchEmployees();
 });
 
 function toggleOrgChart() {
  showOrgChart.value = !showOrgChart.value;
 }
 
 async function searchEmployees() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name', {
      name: searchKeyword.value,
    }, {
      headers: {
        Authorization: token,
      },
    });
    employees.value = response.data.employee;
  } catch (error) {
    console.error('Failed to search employees:', error);
    alert('직원 검색에 실패했습니다. 다시 시도해주세요.');
  }
 }
 
 async function openEmployeeModal(employeeName) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name', {
      name: employeeName,
    }, {
      headers: {
        Authorization: token,
      },
    });
    selectedEmployee.value = response.data.employee[0];
  } catch (error) {
    console.error('Failed to fetch employee details:', error);
    alert('직원 정보를 가져오는데 실패했습니다. 다시 시도해주세요.');
  }
 }
 
 function closeEmployeeModal() {
  selectedEmployee.value = null;
 }
 </script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.toggle-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;
}

.toggle-button:hover {
  background-color: #1b2cba;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button-wrapper {
  margin-left: 10px;
}

.search-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #1b2cba;
}

.no-results {
  text-align: center;
  font-style: italic;
  color: #888;
  margin-bottom: 20px;
}

.employee-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.employee-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
}

.employee-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.employee-email,
.employee-team,
.employee-position,
.employee-rank,
.employee-phone-number {
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 400px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}

.employee-info {
  margin-top: 20px;
}

.info-item {
  margin-bottom: 10px;
}
</style>