<template>
  <div class="container">
    <div>
      <h1>관리자 페이지</h1>
    </div>
    <div style="height: 20px;"></div>
    <div class="header no-background no-shadow">
      <h2>직원 검색</h2>
      <div class="button-container">
        <button class="create-button" @click="goToMemberCreate">회원 생성</button>
        <button class="create-button" @click="goToManagePosition">직책 관리</button>
        <button class="create-button" @click="goToManageRank">직급 관리</button>
        <button class="create-button" @click="showTabModal = true">워크스페이스 및 스터디 추가</button>
        <button class="create-button" @click="showApprovalTypeModal = true">결재 유형 추가</button>
      </div>
    </div>
    <div class="search-container">
      <input
        type="text"
        v-model="searchKeyword"
        placeholder="이름 검색(한 글자 이상)"
        class="search-input"
        @input="searchMembers"
        @keyup.enter="searchMembers"
      />
      <div class="search-button-wrapper">
        <button class="search-button" @click="searchMembers">검색</button>
      </div>
    </div>
    <div v-if="members.length === 0 && searchKeyword !== ''" class="no-results">
      검색 결과가 없습니다.
    </div>
    <div class="member-list">
      <div
        v-for="member in members"
        :key="member.id"
        class="member-item"
        @click="selectMember(member)"
      >
        <div class="member-name">{{ member.name }}</div>
        <div class="member-email">{{ member.email }}</div>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active': showTabModal }">
    <div class="modal-background" @click="closeTabModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">탭 추가하기</h1>
        <button type="button" class="btn-close" @click="closeTabModal"></button>
      </div>
      <div class="modal-body">
        <div id="form-container">
          <div id="tab-select" class="d-flex align-items-center mb-3">
            <select v-model="tabForm.topTab" class="form-select">
              <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
            </select>
            <input v-if="tabForm.topTab === '스터디'" type="text" v-model="tabForm.bottomTab"
                   placeholder="스터디명을 입력하세요." class="form-control ms-2" />
          </div>
          <div class="form-group d-flex flex-column">
            <label class="form-label fw-bold">대표회원 선택</label>
            <p v-if="tabForm.leader"> ○ {{ tabForm.leader.name }} ({{ tabForm.leader.team.name }} {{
                tabForm.leader.position.name }} {{
                tabForm.leader.rank.name }})</p>
            <div class="d-flex mb-2">
              <input v-model="search" type="text" placeholder="직원 이름 검색" class="form-control" @keyup.enter="searchEmployees" />
              <button class="search-button" id="search-post" @click="searchEmployees">
                <img src="@/assets/icons/search_icon.png" alt="Search" />
              </button>
            </div>
            <div v-if="searchEmployeeList && searchEmployeeList.length > 0" class="list-group">
              <button v-for="employee in searchEmployeeList" :key="employee.id"
                      class="list-group-item list-group-item-action"
                      :class="{ 'selected': selected === employee }"
                      @click="selectEmployee(employee)">
                {{ employee.name }} ({{ employee.team.name }} {{ employee.position.name }} {{
                employee.rank.name }})
              </button>
            </div>
            <div v-else-if="searchEmployeeList && search" class="text-danger">
              검색 결과가 없습니다.
            </div>
            <button v-if="searchEmployeeList" class="btn btn-primary mt-2"
                    :class="{ 'selected': tabForm.leader }"
                    @click="selectLeader">선택</button>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeTabModal">취소</button>
        <button type="button" class="btn btn-primary" @click="saveNewTab">저장</button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="closeTabModal"></button>
  </div>
  <div class="modal" :class="{ 'is-active': showApprovalTypeModal }">
    <div class="modal-background" @click="closeApprovalTypeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">결재 유형 추가</h1>
        <button type="button" class="btn-close" @click="closeApprovalTypeModal"></button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="approvalType" class="form-label">결재 유형:</label>
          <input type="text" id="approvalType" v-model="newApprovalType" class="form-control" />
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeApprovalTypeModal">취소</button>
        <button type="button" class="btn btn-primary" @click="saveNewApprovalType">저장</button>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="closeApprovalTypeModal"></button>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const searchKeyword = ref('');
const members = ref([]);
const options = ["워크스페이스", "스터디"];
const search = ref('');
const searchEmployeeList = ref(null);
const selected = ref(null);
const newApprovalType = ref('');
const showTabModal = ref(false);
const showApprovalTypeModal = ref(false);

const tabForm = ref({
  topTab: '워크스페이스',
  bottomTab: null,
  leader: null,
  teamId: null
});

async function searchMembers() {
  if (searchKeyword.value.length === 0) {
    members.value = [];
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name',
      {
        name: searchKeyword.value,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    members.value = response.data.employee;
  } catch (error) {
    console.error('Failed to search members:', error);
    alert('회원 검색에 실패했습니다. 다시 시도해주세요.');
  }
}

function selectMember(member) {
  router.push({ name: 'EditUser', params: { id: member.id } });
}

function goToMemberCreate() {
  router.push({ name: 'CreateUser' });
}

function goToManagePosition() {
  router.push({ name: 'ManagePosition' });
}

function goToManageRank() {
  router.push({ name: 'ManageRank' });
}

function selectEmployee(employee) {
  selected.value = employee;
}

function selectLeader() {
  tabForm.value.leader = selected.value;
}

async function saveNewTab() {
  if (tabForm.value.topTab === "워크스페이스") {
    tabForm.value.teamId = tabForm.value.leader.team.id;
  }

  const requestData = {
    topTab: {
      name: tabForm.value.topTab
    },
    bottomTab: {
      name: tabForm.value.bottomTab
    },
    teamId: tabForm.value.teamId,
    isPublic: false
  };

  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/tab/regist/new/${tabForm.value.leader.id}`, requestData);
      
      alert("탭 저장 완료");
      closeTabModal();
      location.reload(true);
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    console.log("탭 저장에 실패했습니다:", error);
  }
}

async function searchEmployees() {
  if (search.value.trim() === '') {
    searchEmployeeList.value = [];
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestBody = { name: search.value };
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name', requestBody, {
      headers: {
        Authorization: `${token}`,
      },
    });
    searchEmployeeList.value = response.data.employee;
  } catch (error) {
    console.error('Error searching employees:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
}

function closeTabModal() {
  showTabModal.value = false;
  resetTabForm();
}

function resetTabForm() {
  tabForm.value.topTab = '워크스페이스';
  tabForm.value.bottomTab = null;
  tabForm.value.leader = null;
  tabForm.value.teamId = null;
  search.value = '';
  searchEmployeeList.value = null;
  selected.value = null;
}

function closeApprovalTypeModal() {
  showApprovalTypeModal.value = false;
}

async function saveNewApprovalType() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/approval/approval-type', newApprovalType.value, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      alert("결재 유형 추가 완료");
      newApprovalType.value = '';
      closeApprovalTypeModal();
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    console.log("결재 유형 추가에 실패했습니다:", error);
  }
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
  font-size: 14px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
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

.member-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.member-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: #e0e0e0;
}

.member-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-email {
  font-size: 14px;
  color: #888;
}

.button-container {
  display: flex;
  gap: 10px;
}

#tab-select {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

#tab-select .form-control {
  margin-left: 10px;
}

.search-input {
  display: flex;
  margin-bottom: 10px;
}

.tab-select>input {
  width: max-content;
}

.no-results {
  color: #042444;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

#form-container {
  width: 100%;
}

.list-group-item.selected {
  background-color: #e0e0e0;
}

.btn-primary {
  background-color: #042444;
  border-color: #042444;
}

.btn-primary:hover {
  background-color: #1b2cba;
  border-color: #1b2cba;
}

.btn-primary.selected {
  background-color: #1b2cba;
  border-color: #1b2cba;
}

.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
  border-color: #5a6268;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal.is-active {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 500px;
  width: 100%;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #888;
  cursor: pointer;
}
</style>