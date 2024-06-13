<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>요청받은 결재 목록</h2>
    </div>
    <div class="filters">
      <div class="filter-item">
        <label for="type">결재 유형:</label>
        <select id="type" v-model="selectedType" @change="fetchReceivedApprovals" class="filter-select">
          <option value="">전체</option>
          <option value="1">워크스페이스 생성 요청</option>
          <option value="2">스터디 생성 요청</option>
          <option value="3">속하지 않은 워크스페이스 열람 요청</option>
        </select>
      </div>
      <div class="filter-item">
        <label for="period">기간:</label>
        <input type="text" id="period" v-model="period" @click="showDatePicker" class="filter-input period-input" placeholder="시작일 - 종료일" readonly />
        <div v-if="showingDatePicker" class="date-picker">
          <input type="date" v-model="startDate" @change="updatePeriod" />
          <input type="date" v-model="endDate" @change="updatePeriod" />
        </div>
      </div>
      <div class="filter-item">
        <label for="status">상태:</label>
        <select id="status" v-model="selectedStatus" @change="fetchReceivedApprovals" class="filter-select">
          <option value="">전체</option>
          <option value="WAITING">승인 대기 중</option>
          <option value="APPROVED">승인</option>
          <option value="REJECTED">승인 거부</option>
          <option value="CANCELED">취소됨</option>
        </select>
      </div>
      <div class="filter-item">
        <input type="text" id="keyword" v-model="searchKeyword" @keyup.enter="fetchReceivedApprovals" placeholder="내용 검색" class="filter-input" />
        <button @click="fetchReceivedApprovals" class="search-button">검색</button>
      </div>
      <div class="search-result-message" v-if="showSearchResultMessage">{{ searchResultMessage }}</div>
    </div>
    <div class="approval-list">
      <div v-for="approval in paginatedReceivedApprovals" :key="approval.requestApprovalId" class="approval-item" @click="goToApprovalDetail(approval.requestApprovalId)">
        <div class="approval-header">
          <div class="approval-title">
            <span class="approval-type">{{ formatType(approval.typeId) }}</span>
            <span class="approval-content" :title="approval.content">{{ approval.content }}</span>
          </div>
          <div class="approval-info-container">
            <span class="approval-info">{{ approval.approverName }} | {{ formatDate(approval.createdAt) }}</span>
          </div>
        </div>
        <div class="approval-details">
          <div class="approver-container">
            <span class="approver-label">결재 요청자: </span>
            <span class="approver-name">{{ approval.requesterName }}</span>
          </div>
          <div class="approval-status-container">
            <span :class="`approval-status ${getStatusClass(approval.isApproved, approval.canceled)}`">
              {{ formatStatus(approval.isApproved, approval.canceled) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1 || totalCount === 0" class="pagination-button">이전</button>
      <span>{{ currentPage }} / {{ totalPages === 0 ? 1 : totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages || totalCount === 0" class="pagination-button">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const receivedApprovals = ref([]);
const selectedType = ref('');
const startDate = ref('');
const endDate = ref('');
const period = ref('');
const selectedStatus = ref('');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const showingDatePicker = ref(false);
const searchResultCount = ref(0);
const showSearchResultMessage = ref(false);

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const paginatedReceivedApprovals = computed(() => {
  // 받아온 데이터를 최신순으로 정렬하여 반환
  return receivedApprovals.value.slice().sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
});

const searchResultMessage = computed(() => {
  if (searchResultCount.value === 0 && showSearchResultMessage.value) {
    return '반환된 결과가 없습니다.';
  } else if (searchResultCount.value > 0) {
    return `${searchResultCount.value}개의 결과가 반환되었습니다.`;
  }
  return '';
});

onMounted(() => {
  fetchReceivedApprovals();
});

watch([selectedType, selectedStatus, startDate, endDate, searchKeyword], () => {
  fetchReceivedApprovals();
});

async function fetchReceivedApprovals() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const params = {
      typeId: selectedType.value || undefined,
      startDate: startDate.value ? `${startDate.value}T00:00:00` : undefined,
      endDate: endDate.value ? `${endDate.value}T23:59:59` : undefined,
      keyword: searchKeyword.value || undefined,
      page: currentPage.value,
      size: pageSize.value,
    };

    if (selectedStatus.value === 'WAITING') {
    params.isApproved = "WAITING";
    params.isCanceled = false;
    params.status = "WAITING";
    } else if (selectedStatus.value === 'CANCELED') {
        params.isCanceled = true;
        params.isApproved = undefined;
        params.status = undefined;
    } else {
        params.status = selectedStatus.value || undefined;
        params.isCanceled = undefined;
    }

    const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/received/search', {
      headers: {
        Authorization: `${token}`,
      },
      params,
    });

    receivedApprovals.value = response.data;
    totalCount.value = response.data[0]?.totalCount || 0;
    searchResultCount.value = totalCount.value;
    showSearchResultMessage.value = true;
  } catch (error) {
    console.error('Error fetching received approvals:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    } else {
      receivedApprovals.value = [];
      totalCount.value = 0;
      searchResultCount.value = 0;
      showSearchResultMessage.value = true;
    }
  }
}
function goToApprovalDetail(requestApprovalId) {
  router.push(`/approval/received/${requestApprovalId}`);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatStatus(status, canceled) {
  if (canceled) {
    return '취소됨';
  }

  switch (status) {
    case 'WAITING':
      return '승인 대기 중';
    case 'APPROVED':
      return '승인';
    case 'REJECTED':
      return '승인 거부';
    default:
      return status;
  }
}

function getStatusClass(status, canceled) {
  if (canceled) {
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

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchReceivedApprovals();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchReceivedApprovals();
  }
}

function showDatePicker() {
  showingDatePicker.value = true;
}

function updatePeriod() {
  const startDateString = startDate.value ? `${startDate.value} - ` : '';
  const endDateString = endDate.value ? endDate.value : '';
  period.value = `${startDateString}${endDateString}`;
  showingDatePicker.value = false;
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

.create-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #1b2cba;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-item {
  display: flex;
  align-items: center;
}

.filter-item label {
  margin-right: 10px;
}

.filter-select,
.filter-input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 150px;
}

.filter-input {
  width: 200px;
}

.date-picker {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  display: flex;
  gap: 10px;
}

.search-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #0c5195;
}

.approval-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.approval-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.approval-item:hover {
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.approval-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.approval-type {
  font-weight: bold;
  background-color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 5px;
}

.approval-content {
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
}

.approval-info-container {
  display: flex;
  align-items: center;
}

.approval-info {
  font-size: 12px;
  color: #888;
}

.approval-details {
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 배치 */
  align-items: center;
  gap: 20px;
}

.approver-container, .approval-status-container {
  display: flex;
  align-items: center;
}

.approver-label {
  font-weight: bold;
  margin-right: 5px;
}

.approver-name {
  margin-left: 5px;
}

.approval-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

/* 기존 상태 클래스들 */
.status-waiting {
  background-color: #2196f3;
  color: white;
}

.status-approved {
  background-color: #4caf50;
  color: white;
}

.status-rejected {
  background-color: #f44336;
  color: white;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #388e3c;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.period-input {
  width: 250px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-result-message {
  margin-top: 10px;
  font-size: 14px;
  color: #888;
}

.status-canceled {
  background-color: #9e9e9e;
  color: white;
}
</style>