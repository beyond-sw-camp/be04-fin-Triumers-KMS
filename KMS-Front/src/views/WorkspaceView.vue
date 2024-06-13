<template>
    <div id="workspace-tab">
        <router-link class="w-tab" active-class="active" :to="`/workspace/${route.params.id}/wiki`">WIKI</router-link>
        &nbsp;
        <router-link class="w-tab" active-class="active" :to="`/workspace/${route.params.id}/docs`">DOCS</router-link>
        &nbsp;&nbsp;<span data-bs-toggle="modal" data-bs-target="#addTab"><small>+ 팀원 추가</small></span>


        <div class="addEmployee-modal">
            <div class="modal fade" id="addTab" tabindex="-1" aria-labelledby="addTabLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="addTabLabel">회원 추가하기</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div id="form-container">
                                <div class="form-group d-flex flex-column">
                                    <label class="form-label fw-bold">회원 선택</label>
                                    <p v-if="addEmployee"> ○ {{ addEmployee.name }} ({{ addEmployee.team.name }} {{
                                        addEmployee.position.name }} {{
                                            addEmployee.rank.name }})</p>
                                    <div class="d-flex mb-2">
                                        <input v-model="search" type="text" placeholder="직원 이름 검색" class="form-control"
                                            @keyup.enter="searchEmployees" />

                                        <button class="search-button" id="search-post" @click="searchEmployees">
                                            <img src="@/assets/icons/search_icon.png" alt="Search" />
                                        </button>
                                    </div>
                                    <div v-if="searchEmployeeList && searchEmployeeList.length > 0" class="list-group">
                                        <button v-for="employee in searchEmployeeList" :key="employee.id"
                                            class="list-group-item list-group-item-action"
                                            @click="selectEmployee(employee)">
                                            {{ employee.name }} ({{ employee.team.name }} {{ employee.position.name }}
                                            {{
                                                employee.rank.name }})
                                        </button>
                                    </div>
                                    <div v-else-if="searchEmployeeList && search" class="text-danger">
                                        검색 결과가 없습니다.
                                    </div>
                                    <button v-if="searchEmployeeList" class="btn btn-secondary mt-2"
                                        @click="selectAddEmployee">선택</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
                            <button type="button" class="btn btn-primary" @click="saveNewTab">저장</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <RouterView />


</template>

<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from "vue-router";
import axios from 'axios';

const route = useRoute();
const selected = ref(null);
const addEmployee = ref(null);
const search = ref('');
const searchEmployeeList = ref(null);


async function saveNewTab() {
  const requestData = {
    tabId: route.params.id,
    employeeId: addEmployee.value.id,
    isLeader: false
  };

  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/tab/regist/employee`, requestData);
      
      alert("회원 추가 완료");
      closeTabModal();
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

function selectEmployee(employee) {
  selected.value = employee;
}

function selectAddEmployee() {
    addEmployee.value = selected.value;
}

</script>

<style>
.w-tab{
    padding: 5px 10px;
    color: #042444;
    border: 1px solid #042444;
    text-decoration: none;
    border-radius: 30px;
}

#workspace-tab{
    margin-bottom: 10px;
}

.active{
    transition: all 0.3s;
    background-color: rgba(166, 175, 210, 0.496);
}


</style>