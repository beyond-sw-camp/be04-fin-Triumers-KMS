<template>
  <header class="header">
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/images/logo_header.png" alt="Logo" @click="navigateTo('/wiki/1')" />
      </div>
    </div>
    <div class="header-center">
      <span class="search-type">
        <select v-model="search.type" class="form-select pt-1 search-type"
                style="width:fit-content; vertical-align: middle; margin-right: 10px;">
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="tag">태그</option>
        </select>
      </span>
      <b-form-tags v-if="search.type == 'tag'" class="form-select pt-1 search-input" input-id="tags-separators"
                   v-model="search.tags" separator=" " placeholder="태그 입력 후, 스페이스 바를 눌러주세요." no-add-on-enter></b-form-tags>
      <input v-else type="text" v-model="search.keyword" placeholder="검색어를 입력하세요" class="search-input" @keyup.enter="searchPost" />
      <button class="search-button" @click="searchPost">
        <img src="@/assets/icons/search_icon.png" alt="Search" />
      </button>
    </div>
    <div class="header-right">
      <button v-if="isLoggedIn" class="approval-button" @click="navigateToApproval">
        결재
      </button>
      <button v-if="isAdmin" class="admin-button" @click="navigateToManager">
        관리자
      </button>
      <button v-if="isLoggedIn" class="logout-button" @click="logout">
        로그아웃
      </button>
      <button class="profile-button" @click="navigateToProfile">
        <img src="@/assets/images/profile_image.png" alt="Profile" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const search = ref({
  type: 'title',
  keyword: '',
  title: null,
  content: null,
  tags: []
});

const isLoggedIn = computed(() => store.state.isLoggedIn);
const isAdmin = computed(() => ['ROLE_ADMIN', 'ROLE_HR_MANAGER'].includes(store.state.userRole));

const navigateTo = (path) => {
  router.push({ path });
};

const navigateToProfile = () => {
  router.push({ path: '/my-page' });
};

const searchPost = () => {
  const query = {
    type: search.value.type,
    keyword: search.value.keyword,
    tags: search.value.type === 'tag' ? search.value.tags.join(',') : null
  };
  router.push({ path: '/search', query });
};

const navigateToApproval = () => {
  router.push({ path: '/approval' });
};

const navigateToManager = () => {
  router.push({ path: '/manager' });
};

const logout = () => {
  store.dispatch('logout');
  alert('로그아웃되었습니다.');
  router.push('/login');
};

onMounted(() => {
  store.dispatch('checkUserInfo');
});
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #f9f9f9;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo > img {
  width: 200px;
}

.search-input {
  width: 100%;
  max-width: 800px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 4px 4px 4px 4px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  outline: none;
}

.search-button {
  background-color: #042444;
  border: none;
  border-radius: 4px 4px 4px 4px;
  padding: 5px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button > img {
  width: 25px;
  height: 25px;
  filter: invert(100%);
}

.profile-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-right: 20px;
}

.profile-button > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.approval-button,
.admin-button,
.logout-button {
  background-color: transparent;
  color: #042444;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s;
}

.approval-button:hover,
.admin-button:hover,
.logout-button:hover {
  color: #0c5195;
}
</style>