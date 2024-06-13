<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>결재 상세 정보</h2>
      <div class="button-group">
        <button @click="goToApprovalList" class="list-button">목록으로</button>
        <button
          @click="approveApproval"
          class="approve-button"
          :disabled="!isButtonEnabled"
        >
          결재 승인
        </button>
        <button
          @click="rejectApproval"
          class="reject-button"
          :disabled="!isButtonEnabled"
        >
          결재 거부
        </button>
        <button
          class="add-approver-button"
          :disabled="!isButtonEnabled"
          data-bs-toggle="collapse"
          data-bs-target="#addApproverCollapse"
        >
          다음 결재자 추가
        </button>
      </div>
    </div>
    <div class="approval-detail">
      <div class="section">
        <h3 class="section-title">{{ approvalDetail.approvalInfo?.type }}</h3>
        <div class="detail-item">
          <span class="label">요청일:</span>
          <span class="value">{{ formatDate(approvalDetail.approvalInfo?.createdAt) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">요청자:</span>
          <span class="value">{{ approvalDetail.requester?.team?.name }} {{ approvalDetail.requester?.position?.name }} {{ approvalDetail.requester?.rank?.name }} {{ approvalDetail.requester?.name }} ({{ approvalDetail.requester?.phoneNumber }})</span>
        </div>
        <div class="detail-item">
          <span class="label">결재자:</span>
          <span class="value">{{ approvalDetail.approver?.team?.name }} {{ approvalDetail.approver?.position?.name }} {{ approvalDetail.approver?.rank?.name }} {{ approvalDetail.approver?.name }} ({{ approvalDetail.approver?.phoneNumber }})</span>
        </div>
        <div class="detail-item">
          <span class="label">결재 상태:</span>
          <span :class="['value', getStatusClass(approvalDetail.approvalInfo?.isApproved, approvalDetail.approvalInfo?.canceled)]">
            {{ formatStatus(approvalDetail.approvalInfo?.isApproved, approvalDetail.approvalInfo?.canceled) }}
          </span>
        </div>
      </div>
      <div class="section">
        <h3 class="section-title">결재 내용</h3>
        <div class="content-box">
          {{ approvalDetail.approvalInfo?.content }}
        </div>
      </div>
    </div>
 
    <div class="collapse" id="addApproverCollapse">
    <div class="card card-body">
      <h3>다음 결재자 추가</h3>
      <div class="search-input">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="직원 이름 검색"
          id="search-input"
          @input="searchEmployees"
          @keyup.enter="searchEmployees"
        />
        <button @click="searchEmployees">검색</button>
      </div>
      <div v-if="searchResults.length > 0" class="search-results">
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
      <div v-else-if="searchQuery" class="no-results">
        검색 결과가 없습니다.
      </div>
      <div class="buttons">
        <button @click="addApprover" class="confirm-button" :disabled="!selectedEmployee">추가</button>
        <button
          class="cancel-button"
          data-bs-toggle="collapse"
          data-bs-target="#addApproverCollapse"
        >
          취소
        </button>
      </div>
    </div>
  </div>
  </div>
 </template>
 
 <script setup>
 import { ref, onMounted, computed } from 'vue';
 import { useRoute, useRouter } from 'vue-router';
 import axios from 'axios';
 
 const route = useRoute();
 const router = useRouter();
 const approvalDetail = ref({});
 const searchQuery = ref('');
 const searchResults = ref([]);
 const selectedEmployee = ref(null);
 
 onMounted(async () => {
  const requestApprovalId = route.params.requestApprovalId;
  await fetchApprovalDetail(requestApprovalId);
 });
 
 async function fetchApprovalDetail(requestApprovalId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
 
    const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/received/${requestApprovalId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
 
    approvalDetail.value = response.data;
  } catch (error) {
    console.error('Error fetching approval detail:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
 }
 
 const isButtonEnabled = computed(() => {
  return (
    approvalDetail.value.approvalInfo?.isApproved === 'WAITING' &&
    !approvalDetail.value.approvalInfo?.canceled
  );
 });
 
 async function approveApproval() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
 
    const requestApprovalId = route.params.requestApprovalId;
    await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/received/${requestApprovalId}/approve`, null, {
      headers: {
        Authorization: `${token}`,
      },
    });
 
    alert('결재가 승인되었습니다.');
    await fetchApprovalDetail(requestApprovalId);
  } catch (error) {
    console.error('Error approving approval:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      alert('결재 승인에 실패했습니다.');
    }
  }
 }
 
 async function rejectApproval() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
 
    const requestApprovalId = route.params.requestApprovalId;
    await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/received/${requestApprovalId}/reject`, null, {
      headers: {
        Authorization: `${token}`,
      },
    });
 
    alert('결재가 거부되었습니다.');
    await fetchApprovalDetail(requestApprovalId);
  } catch (error) {
    console.error('Error rejecting approval:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      alert('결재 거부에 실패했습니다.');
    }
  }
 }
 
 async function searchEmployees() {
  if (searchQuery.value.trim() === '') {
    searchResults.value = [];
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
  } catch (error) {
    console.error('Error searching employees:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
 }
 
 function selectEmployee(employee) {
  selectedEmployee.value = employee;
 }
 
 async function addApprover() {
  if (!selectedEmployee.value) {
    alert('다음 결재자를 선택해주세요.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestApprovalId = route.params.requestApprovalId;
    await axios.post(
      `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/received/${requestApprovalId}/addApprover`,
      {
        newApproverId: selectedEmployee.value.id,
      },
      {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    alert('다음 결재자가 추가되었습니다.');
    await fetchApprovalDetail(requestApprovalId);
    searchQuery.value = '';
    searchResults.value = [];
    selectedEmployee.value = null;
    document.getElementById('addApproverCollapse').classList.remove('show');
  } catch (error) {
    console.error('Error adding approver:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      alert('다음 결재자 추가에 실패했습니다.');
    }
  }
}
 
 function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
 }
 
 function formatStatus(status, isCanceled) {
  if (isCanceled) {
    return '취소됨';
  }
 
  switch (status) {
    case 'WAITING':
      return '승인 대기 중';
    case 'APPROVED':
      return '승인 완료';
    case 'REJECTED':
      return '승인 거부';
    default:
      return status;
  }
 }
 
 function getStatusClass(status, isCanceled) {
  if (isCanceled) {
    return 'status-canceled';
  }
 
  switch (status) {
    case 'WAITING':
      return 'status-waiting';
    case 'APPROVED':
      return 'status-approved';
    case 'REJECTED':
      return 'status-rejected';
    default:
      return '';
  }
 }
 
 function formatType(typeId) {
  switch (typeId) {
    case 1:
      return '워크스페이스 생성 요청';
    case 2:
      return '스터디 생성 요청';
    case 3:
      return '속하지 않은 워크스페이스 열람 요청';
    default:
      return '기타';
  }
 }
 
 function goToApprovalList() {
  router.push('/approval/received');
 }
 </script>
 
 <style scoped>
 .container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
 }
 
 .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
 }
 
 .no-background {
  background-color: transparent;
 }
 
 .no-shadow {
  box-shadow: none;
 }
 
 .list-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
 }
 
 .list-button:hover {
  background-color: #1b2cba;
 }
 
 .approval-detail {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
 }
 
 .section {
  margin-bottom: 30px;
 }
 
 .section-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
 }
 
 .detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
 }
 
 .label {
  font-weight: bold;
  width: 120px;
  margin-right: 10px;
 }
 
 .value {
  flex-grow: 1;
 }
 
 .status-waiting {
  color: #2196f3;
 }
 
 .status-approved {
  color: #4caf50;
 }
 
 .status-rejected {
  color: #f44336;
 }
 
 .content-box {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-top: 10px;
  white-space: pre-wrap;
 }
 
 .button-group {
  display: flex;
  gap: 10px;
 }
 
 .approve-button,
 .reject-button,
 .add-approver-button {
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
 }
 
 .approve-button {
  background-color: #4caf50;
 }
 
 .approve-button:hover {
  background-color: #388e3c;
 }
 
 .reject-button {
  background-color: #f44336;
 }
 
 .reject-button:hover {
  background-color: #d32f2f;
 }
 
 .add-approver-button {
  background-color: #042444;
 }
 
 .add-approver-button:hover {
  background-color: #1b2cba;
 }
 
 .approve-button:disabled,
 .reject-button:disabled,
 .add-approver-button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
 }
 
 .status-canceled {
  color: #9e9e9e;
 }

 .collapse {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
 }

 .card {
  background-color: #ffffff;
  border-radius: 4px;
  border: none;
  outline: none;
}

 .search-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: none;
  box-shadow: none;
  outline: none;
}

.search-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-input button {
  margin-left: 10px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-input button:hover {
  background-color: #1b2cba;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
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

.confirm-button:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}
 
 .buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
 }
 
 .confirm-button,
 .cancel-button {
  padding: 8px 16px;
  border-radius: 4px;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
 }
 
 .confirm-button {
  background-color: #4caf50;
}
.confirm-button:hover {
background-color: #388e3c;
}
.cancel-button {
background-color: #f44336;
}
.cancel-button:hover {
background-color: #d32f2f;
}
</style>