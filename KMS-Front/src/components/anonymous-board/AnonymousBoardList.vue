<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>익명 게시판</h2>
      <button @click="goToWriteForm" class="write-button">글 쓰기</button>
    </div>
    <div class="search-box">
      <div class="search-type">
        <select v-model="searchType" class="search-type-select">
          <option value="titleAndContent">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
      </div>
      <input
        type="text"
        v-model="keyword"
        placeholder="검색어 입력"
        class="search-input"
        @keyup.enter="searchAnonymousBoards"
      />
      <button @click="searchAnonymousBoards" class="search-button">검색</button>
    </div>
    <div class="search-result-count" v-if="showSearchResultCount">
    검색 결과: {{ searchResultCount }}개
  </div>
    <div class="board-list">
      <div
        v-for="(board, index) in anonymousBoardList"
        :key="board.id"
        class="board-item"
        @click="goToBoardDetail(board.id)"
      >
        <div class="board-header">
          <span class="board-title">{{ board.title }}</span>
          <div class="board-info-container">
            <span class="board-info">{{ formatNickname(board.nickname) }} | {{ formatDate(board.createdDate) }}</span>
          </div>
        </div>
        <p class="board-content">
          {{ board.content.length > 50 ? board.content.slice(0, 50) + '...' : board.content }}
        </p>
        <span class="comment-count">댓글 {{ board.commentCount || 0 }}개</span>
      </div>
    </div>
    <div class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="pagination-button"
      >
        이전
      </button>
      <span>{{ currentPage }} / {{ totalPages > 0 ? totalPages : 1 }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages || totalPages === 0"
        class="pagination-button"
      >
        다음
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const anonymousBoardList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const searchType = ref('titleAndContent');
const keyword = ref('');
const searchResultCount = ref(0);
const showSearchResultCount = ref(false);

const totalPages = computed(() => (totalCount.value === 0 ? 1 : Math.ceil(totalCount.value / pageSize.value)));

onMounted(() => {
  fetchAnonymousBoardList();
});

async function fetchAnonymousBoardList() {
  try {
    const response = await axios.get(
      `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/anonymous-board?page=${currentPage.value}&size=${pageSize.value}`
    );
    anonymousBoardList.value = await Promise.all(
      response.data.content.map(async (board) => {
        const commentCountResponse = await axios.get(
          `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/anonymous-board/${board.id}/comments/count`
        );
        board.commentCount = commentCountResponse.data;
        return board;
      })
    );
    totalCount.value = response.data.totalElements;
    showSearchResultCount.value = false; // 일반 게시물 목록 조회 시 검색 결과 개수 숨김
  } catch (error) {
    console.error('Failed to fetch anonymous board list:', error);
  }
}

async function searchAnonymousBoards() {
  try {
    const encodedKeyword = encodeURIComponent(keyword.value);
    const response = await axios.get(
      `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/anonymous-board/search?keyword=${encodedKeyword}&type=${searchType.value}&page=${currentPage.value}&size=${pageSize.value}`
    );
    anonymousBoardList.value = await Promise.all(
      response.data.content.map(async (board) => {
        const commentCountResponse = await axios.get(
          `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/anonymous-board/${board.id}/comments/count`
        );
        board.commentCount = commentCountResponse.data;
        return board;
      })
    );
    totalCount.value = response.data.totalElements;
    searchResultCount.value = response.data.totalElements;
    showSearchResultCount.value = true;
  } catch (error) {
    console.error('Failed to search anonymous boards:', error);
  }
}

function goToWriteForm() {
  router.push('/office-life/anonymous-board/new');
}

function goToBoardDetail(boardId) {
  router.push(`/office-life/anonymous-board/${boardId}`);
}

function formatNickname(nickname) {
  return nickname;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    if (keyword.value) {
      searchAnonymousBoards();
    } else {
      fetchAnonymousBoardList();
    }
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    if (keyword.value) {
      searchAnonymousBoards();
    } else {
      fetchAnonymousBoardList();
    }
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

.write-button {
  padding: 10px 20px;  
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.write-button:hover {
  background-color: #0c5195;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-type {
  margin-right: 10px;
  flex: 1 1 100px;
}

.search-type-select {
  padding: 10px 16px;  /* Increased padding */
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-type-select:hover {
  border-color: #888;
}

.search-input {
  flex-grow: 1;
  flex: 20 1 300px; 
  padding: 10px;  /* Increased padding */
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:hover {
  border-color: #888;
}

.search-button {
  padding: 10px 16px;  /* Increased padding to match input height */
  border-radius: 4px;
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.2s;
  flex: 1 1 100px; /* Ensure button doesn't shrink too much */
}

.search-button:hover {
  background-color: #0c5195;
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.board-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.board-item:hover {
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.board-title {
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px;
  max-width: 70%; /* Adjust as needed */
}

.board-info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.board-info {
  font-size: 12px;
  color: #888;
}

.comment-count {
  font-size: 12px;
  color: #888;
  padding: 8px;
  margin-top: 5px; /* Added margin to move it down */
}

.board-content {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 5px;
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
  background-color: #042444;
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0c5195;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .search-box {
    flex-direction: column;
    align-items: stretch;
  }

  .search-type-select,
  .search-input,
  .search-button {
    margin-bottom: 10px;
  }

  .board-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .board-title {
    font-size: 16px;
  }

  .board-content {
    padding: 0;
  }
}

.search-result-count {
  margin-bottom: 10px;
  font-size: 14px;
  color: #888;
}
</style>
