<template>
    <div class="container">
      <h2>회원 생성</h2>
      <form @submit.prevent="createMember">
        <div class="form-group">
          <label for="email">이메일:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">비밀번호:</label>
          <input type="password" id="password" v-model="password" />
          <p class="initial-password-info">비밀번호를 따로 입력하지 않을 시 초기 비밀번호는 "welcome"으로 설정됩니다.</p>
        </div>
        <div class="form-group">
          <label for="name">이름:</label>
          <input type="text" id="name" v-model="name" required />
        </div>
        <div class="form-group">
        <label for="role">권한:</label>
        <select id="role" v-model="role" required>
            <option value="ROLE_ADMIN">관리자</option>
            <option value="ROLE_HR_MANAGER">인사 매니저</option>
            <option value="ROLE_LEADER">리더</option>
            <option value="ROLE_NORMAL">일반 사용자</option>
        </select>
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
        <button type="submit" class="submit-button" :disabled="!isFormValid">생성</button>
      </form>
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const name = ref('');
const role = ref('ROLE_NORMAL');
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

async function createMember() {
  try {
    const token = localStorage.getItem('token');
    const memberData = {
      email: email.value,
      name: name.value,
      role: role.value,
      teamId: selectedTeam.value.id,
      positionId: selectedPosition.value.id,
      rankId: selectedRank.value.id,
    };
    
    if (password.value) {
      memberData.password = password.value;
    } else {
      memberData.password = "welcome";
    }
    
    await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/signup', memberData, {
      headers: {
        Authorization: token,
      },
    });

    alert('회원이 성공적으로 생성되었습니다.');
    router.push('/manager'); 
  } catch (error) {
    console.error('Failed to create member:', error);
    if (error.response && error.response.status === 400) {
      alert('회원 생성 요청이 잘못되었습니다. 입력 데이터를 확인하세요.');
    } else if (error.response && error.response.status === 500) {
      alert('서버 오류로 인해 회원 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } else {
      alert('회원 생성에 실패했습니다. 다시 시도해주세요.');
    }
  }
}
</script>
  
  
  <style scoped>
  .container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
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
  input[type="password"],
  input[type="text"],
  input[type="number"],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
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

.initial-password-info {
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}
  </style>