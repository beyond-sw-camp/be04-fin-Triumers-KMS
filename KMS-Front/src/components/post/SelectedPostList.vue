<template>
    <div id="postList-container">
      <div id="top">
        <h3 id="tab-name">{{ tabName }}</h3>
        <p id="write-btn" v-if="isAuthorized">
          <b-button variant="light" @click="createNew()">글 작성</b-button>
        </p>
      </div>
      <hr>
      <p class="input-group mb-3 search">
        <span class="search-type">
          <select v-model="search.type" class="form-select pt-1 search-type"
            style="width:fit-content; vertical-align: middle; margin-right: 10px;">
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="tag">태그</option>
          </select>
        </span>
        <b-form-tags v-if="search.type == 'tag'" class="form-select pt-1" input-id="tags-separators"
          v-model="search.tags" separator=" " placeholder="태그 입력 후, 스페이스 바를 눌러주세요." no-add-on-enter
          @keyup.enter="searchPost"></b-form-tags>
        <b-form-input @keyup.enter="searchPost" v-else type="text" id="search-input" placeholder="검색어를 입력하세요"
          v-model="search.keyword"></b-form-input>
        <button class="search-button" id="search-post" @click="searchPost">
          <img src="@/assets/icons/search_icon.png" alt="Search" />
        </button>
      </p>
      <div v-if="postList && postList.length > 0" class="postList-div" id="postList">
        <div class="row row-cols-1 row-cols-1 row-cols-md-2">
          <div class="col" v-for="post in postList" :key="post.id"
            @click="postDetail(post.originId ? post.originId : post.id)">
            <div class="card">
              <div class="card-body">
                <div id="top-info">
                  <div>
                    <b-avatar variant="light" size="3.5rem" id="profile-img"
                      :src="post.author.profileImg ? post.author.profileImg : defaultProfileImg"></b-avatar>
                  </div>
                  <div id="author-date">
                    <h5 class="author"> {{ post.author.name }} </h5>
                    <p class="date"><small class="text-muted"> {{ convertToDate(post.createdAt) }}</small>
                    </p>
                  </div>
                </div>
                <div class="preview-main">
                  <h5 class="card-title"><strong>{{ post.title }}</strong></h5>
                  <div :class="{'no-postImg': !post.postImg, 'content-preview': true}">{{ stripHtmlTags(post.content) }}</div>
                  <b-card-img v-if="post.postImg" :src="post.postImg"
                     class="card-img" alt="Image" bottom></b-card-img>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <p class="like">
                    <span class="material-icons" @click="likePost(post.originId ? post.originId : post.id)"
                      :style="{ color: post.isLike ? '#042444' : '#EFEFEF' }">favorite</span>
                    &nbsp;<span>{{ post.likeList.length }} </span>
                  </p>
                  <p class="tags">
                    <span class="tag" v-for="tag in post.tags" :key="tag.id">
                      <b-badge class="custom-badge" variant="custom-badge">#{{ tag }}</b-badge>
                    </span>&nbsp;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!isLoading && (!postList || postList.length <= 0)" id="no-content">
        <p>게시글이 존재하지 않습니다.</p>
      </div>
  
      <!-- spinner -->
      <div class="text-center" v-if="isLoading" style="margin: 10px;">
        <span class="spinner-grow spinner-grow-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </span>
        &nbsp;
        <span class="spinner-grow spinner-grow-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </span>
        &nbsp;
        <span class="spinner-grow spinner-grow-sm" role="status">
          <span class="visually-hidden">Loading...</span>
        </span>
      </div>
  
      <span class="material-icons" id="top-btn" @click="scrollToTop()">assistant_navigation</span>
    </div>
  </template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

import { marked } from 'marked';

import defaultProfileImg from '@/assets/images/profile_image.png';
import defaultPostImg from '@/assets/images/logo_header.png';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const tabName = ref(null);
const postList = ref([]);
const isLoading = ref(false);

const search = ref({
    tabRelationId: tabId,
    categoryId: null,
    type: 'title',
    keyword: '',
    title: null,
    content: null,
    tags: [],
    page: 0,
    size: 10
});

const isAuthorized = computed(() => {
  if (currentRoute.path.includes('office-life/3')) {
    const userRole = localStorage.getItem('userRole');
    return ['ROLE_ADMIN', 'ROLE_HR_MANAGER'].includes(userRole);
  }
  return true;
});

onMounted(async () => {
    await getTabName(tabId);
    await getPostList();
    window.addEventListener('scroll', handleScroll);

    document.addEventListener('keydown', function (event) {
        if (event.key === 'F4') {
            zergRush(); // F4를 누르면 zergRush 함수 실행
        }
    });

});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

let timerId = null;
async function handleScroll() {
    if (timerId) return; // 이미 타이머가 설정된 경우 함수 종료

    timerId = setTimeout(async () => {
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
            search.value.page += 1;
            await getPostList();
        }
        timerId = null;
    }, 300);
}


const postDetail = (postId) => {
    const segments = currentRoute.path.split('/');
    let detailPath = `${segments[1]}`;
    if (segments.length > 3 && segments[1] === "group") {
        detailPath = `${detailPath}/${segments[2]}`;
    }
    router.push({
        path: `/${detailPath}/detail/${postId}`
    });
};

const createNew = () => {
    const currentPath = router.currentRoute.value.path;
    const newPath = `${currentPath}/new`;
    router.push(newPath);
};

const stripHtmlTags = (html) => {;
    const tempDiv = document.createElement('div');

    tempDiv.innerHTML = html;
    tempDiv.innerHTML = marked(tempDiv.textContent);

    return tempDiv.textContent.trim() || tempDiv.innerText.trim() || "";
};

async function searchPost() {
    search.value.title = null;
    search.value.content = null;
    switch (search.value.type) {
        case 'title':
            search.value.title = search.value.keyword;
            break;
        case 'content':
            search.value.content = search.value.keyword;
            break;
    }
    if (search.value.type != "tag") search.value.tags = [];
    search.value.page = 0;
    postList.value = [];
    await getPostList();
}

async function getTabName(id) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/tab/name/${id}`);
            tabName.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("탭 이름을 불러올 수 없습니다.");
    }
}


async function getPostList() {
    if (isLoading.value) return;
    isLoading.value = true;
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/tab', {
                tabRelationId: tabId,
                categoryId: search.value.categoryId,
                title: search.value.title,
                content: search.value.content,
                tags: search.value.tags,
                page: search.value.page,
                size: search.value.size
            });
            const newPosts = response.data.content;
            postList.value = [...postList.value, ...newPosts];
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("게시글을 불러올 수 없습니다.");
    } finally {
        isLoading.value = false;
        if (!postList.value || postList.value.length <= 0) {
            postList.value = null;
        }
    }
}

const convertToDate = (date) => {
    const dateSplit = date.split("T");
    dateSplit[1] = dateSplit[1].split(".")[0];
    return dateSplit[0] + " " + dateSplit[1];
};

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function zergRush() {
    const searchResults = document.getElementById('postList');

    for (let i = 0; i < 15; i++) {
        const zergUnit = document.createElement('div');
        zergUnit.className = 'zerg-unit';
        zergUnit.style.left = `${10 + Math.random() * 80}%`; // 임의의 가로 위치
        zergUnit.style.top = `${-10 + Math.random() * 10}%`; // 임의의 세로 위치
        searchResults.appendChild(zergUnit);
    }

    setInterval(() => {
        const zergUnits = document.querySelectorAll('.zerg-unit');
        const postListItems = document.querySelectorAll('.postList-div .card');

        zergUnits.forEach(zergUnit => {
            const rect = zergUnit.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.bottom >= windowHeight) {
                zergUnit.remove(); // 바닥에 닿은 저그 유닛 삭제
            }

            postListItems.forEach(postListItem => {
                if (isColliding(zergUnit, postListItem)) {
                    // 충돌한 경우 해당 요소와 하위 요소들을 투명하게 만듦
                    postListItem.style.opacity = '0';
                    postListItem.style.transition = 'opacity 1s'; // 무너지는 애니메이션 효과
                }
            });
        });
    }, 100);

    // 사용자가 저그 유닛을 클릭하여 제거하는 이벤트 처리
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('zerg-unit')) {
            event.target.remove(); // 클릭된 저그 유닛 삭제
        }
    });

    // 충돌 감지 함수
    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        );
    }
}
    
    
</script>

<style>
@import url('@/styles/post/PostList.css');
</style>
