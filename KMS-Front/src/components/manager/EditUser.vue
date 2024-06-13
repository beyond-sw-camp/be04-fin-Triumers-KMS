<template>
    <div class="container">
      <div class="header no-background no-shadow">
        <h2>회원 정보 수정</h2>
        <div class="button-group">
          <button class="permission-button" @click="goToMemberPermission">권한 수정</button>
          <button class="reset-password-button" @click="goToMemberResetPassword">비밀번호 초기화</button>
        </div>
      </div>
      <form @submit.prevent="updateMember">
        <div class="form-group">
          <label for="email">이메일:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="name">이름:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
        <label for="profileImg">프로필 이미지:</label>
        <input type="file" id="profileImg" @change="handleProfileImgChange" accept="image/jpeg" />
        </div>
        <div class="form-group">
          <label for="startDate">입사일:</label>
          <input type="date" id="startDate" v-model="startDate" />
        </div>
        <div class="form-group">
          <label for="endDate">퇴사일:</label>
          <input type="date" id="endDate" v-model="endDate" />
        </div>
        <div class="form-group">
          <label for="phoneNumber">전화번호:</label>
          <input type="tel" id="phoneNumber" v-model="phoneNumber" />
        </div>
        <div class="form-group">
          <label for="team" class="label-bold">팀:</label>
          <div class="search-input">
            <input
              v-model="teamSearch"
              type="text"
              placeholder="팀 이름 검색"
              @input="searchTeams"
              class="form-control"
            />
            <button @click="searchTeams" class="btn search-button">검색</button>
          </div>
          <div v-if="showTeamResults" class="search-results">
            <div
              v-for="team in filteredTeams"
              :key="team.id"
              class="search-result"
              :class="{ 'selected': selectedTeam && selectedTeam.id === team.id }"
              @click="selectTeam(team)"
            >
              {{ team.name }}
            </div>
            <div v-if="filteredTeams.length === 0 && teamSearch !== ''" class="no-results">
              검색 결과가 없습니다.
            </div>
          </div>
          <div v-if="selectedTeam" class="selected-item">
            {{ selectedTeam.name }}
          </div>
        </div>
        <div class="form-group">
          <label for="position" class="label-bold">직책:</label>
          <div class="search-input">
            <input
              v-model="positionSearch"
              type="text"
              placeholder="직책 이름 검색"
              @input="searchPositions"
              class="form-control"
            />
            <button @click="searchPositions" class="btn search-button">검색</button>
          </div>
          <div v-if="showPositionResults" class="search-results">
            <div
              v-for="position in filteredPositions"
              :key="position.id"
              class="search-result"
              :class="{ 'selected': selectedPosition && selectedPosition.id === position.id }"
              @click="selectPosition(position)"
            >
              {{ position.name }}
            </div>
            <div v-if="filteredPositions.length === 0 && positionSearch !== ''" class="no-results">
              검색 결과가 없습니다.
            </div>
          </div>
          <div v-if="selectedPosition" class="selected-item">
            {{ selectedPosition.name }}
          </div>
        </div>
        <div class="form-group">
          <label for="rank" class="label-bold">직급:</label>
          <div class="search-input">
            <input
              v-model="rankSearch"
              type="text"
              placeholder="직급 이름 검색"
              @input="searchRanks"
              class="form-control"
            />
            <button @click="searchRanks" class="btn search-button">검색</button>
          </div>
          <div v-if="showRankResults" class="search-results">
            <div
              v-for="rank in filteredRanks"
              :key="rank.id"
              class="search-result"
              :class="{ 'selected': selectedRank && selectedRank.id === rank.id }"
              @click="selectRank(rank)"
            >
              {{ rank.name }}
            </div>
            <div v-if="filteredRanks.length === 0 && rankSearch !== ''" class="no-results">
              검색 결과가 없습니다.
            </div>
          </div>
          <div v-if="selectedRank" class="selected-item">
            {{ selectedRank.name }}
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="!isFormValid">수정</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const memberId = route.params.id;

const email = ref('');
const name = ref('');
const profileImg = ref(null);
const startDate = ref('');
const endDate = ref('');
const phoneNumber = ref('');
const teamSearch = ref('');
const positionSearch = ref('');
const rankSearch = ref('');
const selectedTeam = ref(null);
const selectedPosition = ref(null);
const selectedRank = ref(null);
const teams = ref([]);
const positions = ref([]);
const ranks = ref([]);
const showTeamResults = ref(false);
const showPositionResults = ref(false);
const showRankResults = ref(false);

const filteredTeams = computed(() => {
  if (!teamSearch.value) {
    return teams.value;
  }
  return teams.value.filter(team =>
    team.name.toLowerCase().includes(teamSearch.value.toLowerCase())
  );
});

const filteredPositions = computed(() => {
  if (!positionSearch.value) {
    return positions.value;
  }
  return positions.value.filter(position =>
    position.name.toLowerCase().includes(positionSearch.value.toLowerCase())
  );
});

const filteredRanks = computed(() => {
  if (!rankSearch.value) {
    return ranks.value;
  }
  return ranks.value.filter(rank =>
    rank.name.toLowerCase().includes(rankSearch.value.toLowerCase())
  );
});

const isFormValid = computed(() => {
  return selectedTeam.value && selectedPosition.value && selectedRank.value;
});

onMounted(async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/id/${memberId}`, {
      headers: {
        Authorization: token,
      },
    });

    const memberData = response.data.employee[0];
    email.value = memberData.email;
    name.value = memberData.name;
    profileImg.value = memberData.profileImg;
    startDate.value = memberData.startDate;
    endDate.value = memberData.endDate;
    phoneNumber.value = memberData.phoneNumber;
    selectedTeam.value = memberData.team;
    selectedPosition.value = memberData.position;
    selectedRank.value = memberData.rank;

    await fetchTeams();
    await fetchPositions();
    await fetchRanks();
  } catch (error) {
    console.error('Failed to fetch member data:', error);
    alert('회원 정보를 불러오는데 실패했습니다.');
  }
});

async function fetchTeams() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/organization/find/team/all', {
      headers: {
        Authorization: token,
      },
    });
    teams.value = response.data;
  } catch (error) {
    console.error('Failed to fetch teams:', error);
    // 팀 정보를 불러오는 데 실패해도 경고 메시지를 표시하지 않습니다.
  }
}

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
    alert('직책 정보를 불러오는데 실패했습니다.');
  }
}

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
    alert('직급 정보를 불러오는데 실패했습니다.');
  }
}

async function searchTeams() {
  if (teamSearch.value === '') {
    await fetchTeams();
    showTeamResults.value = false;
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/organization/find/team/name', {
      name: teamSearch.value,
    }, {
      headers: {
        Authorization: token,
      },
    });
    teams.value = response.data;
    showTeamResults.value = true;
  } catch (error) {
    console.error('Failed to search teams:', error);
  }
}

async function searchPositions() {
  if (positionSearch.value === '') {
    await fetchPositions();
    showPositionResults.value = false;
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/duty/find/position/${positionSearch.value}`, {
      headers: {
        Authorization: token,
      },
    });
    positions.value = response.data.position;
    showPositionResults.value = true;
  } catch (error) {
    console.error('Failed to search positions:', error);
  }
}

async function searchRanks() {
  if (rankSearch.value === '') {
    await fetchRanks();
    showRankResults.value = false;
    return;
  }
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/duty/find/rank/${rankSearch.value}`, {
      headers: {
        Authorization: token,
      },
    });
    ranks.value = response.data.rank;
    showRankResults.value = true;
  } catch (error) {
    console.error('Failed to search ranks:', error);
  }
}

function selectTeam(team) {
  selectedTeam.value = team;
  teamSearch.value = team.name;
  showTeamResults.value = false;
}

function selectPosition(position) {
  selectedPosition.value = position;
  positionSearch.value = position.name;
  showPositionResults.value = false;
}

function selectRank(rank) {
  selectedRank.value = rank;
  rankSearch.value = rank.name;
  showRankResults.value = false;
}

function handleProfileImgChange(event) {
  profileImg.value = event.target.files[0];
}

async function updateMember() {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('email', email.value);
    formData.append('name', name.value);
    if (profileImg.value) {
      formData.append('profileImg', profileImg.value);
    }
    formData.append('startDate', startDate.value);
    formData.append('endDate', endDate.value);
    formData.append('phoneNumber', phoneNumber.value);
    formData.append('teamId', selectedTeam.value.id);
    formData.append('positionId', selectedPosition.value.id);
    formData.append('rankId', selectedRank.value.id);

    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/edit/info', formData, {
      headers: {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status === 200) {
      alert('회원 정보가 성공적으로 수정되었습니다.');
      router.push({ name: 'SearchUser' });
    } else {
      alert('회원 정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error) {
    console.error('Failed to update member:', error);
    alert('회원 정보 수정에 실패했습니다. 다시 시도해주세요.');
  }
}

function goToMemberPermission() {
  router.push({ name: 'EditUserRole', params: { id: memberId } });
}

function goToMemberResetPassword() {
  router.push({ name: 'ResetUserPassword', params: { id: memberId } });
}
</script>
  
  
  <style scoped>
  .container {
    max-width: 500px;
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
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="email"],
  input[type="text"],
  input[type="date"],
  input[type="tel"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
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
.selected-item {
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
.form-actions {
display: flex;
justify-content: flex-end;
}
.submit-button {
padding: 10px 20px;
background-color: #042444;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.2s;
}
.submit-button:hover {
background-color: #1b2cba;
}
.button-group {
display: flex;
gap: 10px;
}
.permission-button,
.reset-password-button {
padding: 10px 20px;
background-color: #042444;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
transition: background-color 0.2s;
}
.permission-button:hover,
.reset-password-button:hover {
background-color: #1b2cba;
}
</style>