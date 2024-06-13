<template>
  <div class="org-chart">
    <ul class="org-unit" v-for="unit in orgUnits" :key="unit.id">
      <li>
        <div class="unit-name">{{ unit.name }}</div>
        <ul class="departments">
          <li v-for="department in unit.belongDepartments" :key="department.id">
            <div class="department-name">{{ department.name }}</div>
            <ul class="teams">
              <li v-for="team in department.belongTeams" :key="team.id">
                <div class="team-name">{{ team.name }}</div>
                <ul class="members">
                  <li v-for="member in team.members" :key="member.id">
                    <div class="member" @click="$emit('employee-selected', member.name)">
                      <img :src="getProfileImage(member.profileImg)" alt="Profile Image" class="profile-img">
                      <p>{{ member.name }}</p>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
 </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import defaultProfileImg from '@/assets/images/profile_image.png'; // 기본 이미지 경로를 여기서 임포트
  
  const orgUnits = ref([]);

  defineEmits(['employee-selected']);
  
  onMounted(async () => {
    try {
      const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/organization/find/center/detail/all');
      orgUnits.value = response.data;
    } catch (error) {
      console.error('Error fetching organization data:', error);
    }
  });
  
  function getProfileImage(profileImg) {
    if (profileImg) {
      return profileImg.startsWith('http') ? profileImg : `http://your-s3-bucket-url/${profileImg}`;
    } else {
      return defaultProfileImg;
    }
  }
  </script>
  
  <style scoped>
  .org-chart {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
  }
  
  .org-unit,
  .departments,
  .teams,
  .members {
    list-style: none;
    padding-left: 20px;
    border-left: 2px solid #ccc;
    margin-left: 20px;
  }
  
  .unit-name,
  .department-name,
  .team-name {
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .member {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .profile-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #ddd;
  }

  .member {
 cursor: pointer;
}
  </style>
  