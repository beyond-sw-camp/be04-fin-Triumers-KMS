<template>
    <div id="top">
      <h3 id="tab-name">검색 결과</h3>
    </div>
  
    <hr>
  
    <div v-if="postList && postList.length > 0" class="postList-div">
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
                <div class="content-preview">{{ stripHtmlTags(post.content) }}</div>
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
      <p>검색 결과가 없습니다.</p>
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
  </template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';

import defaultProfileImg from '@/assets/images/profile_image.png';
import defaultPostImg from '@/assets/images/logo_header.png';


const router = useRouter();
const currentRoute = useRoute();

const isLoading = ref(false);
const postList = ref([]);
const search = ref({
    type: currentRoute.query.type,
    keyword: currentRoute.query.keyword,
    title: null,
    content: null,
    tags: [],
    page: 0,
    size: 10
});

onMounted(async () => {
    await searchPost();
    window.addEventListener('scroll', handleScroll);
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


watch(() => currentRoute.query, async () => {
  search.value.type = currentRoute.query.type;
  search.value.keyword = currentRoute.query.keyword;
  await searchPost();
});

const postDetail = (postId) => {
    router.push({
        path: `${currentRoute.path}/detail/${postId}`
    });
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

    if (search.value.type == "tag")
        search.value.tags = currentRoute.query.tags.length > 0 ? currentRoute.query.tags.split(',') : [];

    search.value.page = 0; 
    postList.value = [];

    await getPostList();
}

async function getPostList() {
    if (isLoading.value) return;
        isLoading.value = true;
try {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/tab/all', {
            categoryId: null,
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
} finally{
    isLoading.value = false;
    if(!postList.value || postList.value.length <= 0){
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

</script>

<style>
@import url('@/styles/post/PostList.css');
</style>
