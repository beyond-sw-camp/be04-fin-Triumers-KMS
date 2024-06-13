<template>

    <div id="top">
        <h3 id="tab-name">Docs</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNew()">업로드</b-button>
        </p>
    </div>

    <hr>

    <p class="input-group mb-3 search">
        <span class="search-type">
            <select v-model="search.type" class="form-select pt-1 search-type"
                style="width:fit-content; vertical-align: middle; margin-right: 10px;">
                <option value="title">제목</option>
            </select>
        </span>

        <b-form-input type="text" id="search-input" placeholder="검색어를 입력하세요" v-model="search.keyword" @keyup.enter="searchPost"></b-form-input>

        <button class="search-button" id="search-post" @click="searchPost">
            <img src="@/assets/icons/search_icon.png" alt="Search" />
        </button>
    </p>

    <div id="docsList">
        <table class="table table-borderless">
            <thead>
                <tr class="table-light">
                    <th scope="col">NAME</th>
                    <th scope="col">FILE</th>
                    <th scope="col">TYPE</th>
                    <th scope="col">UPLOADER</th>
                    <th scope="col">DATE ADDED</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in postList" :key="post.id">
                    <td><strong>{{ post.title }}</strong></td>
                    <td>
                        <a id="attach" :href="post.content.split(' : ')[2]"
                            style="color: black; text-decoration: none;">
                            <span class="material-icons">attach_file</span>
                            {{ post.content.split(' : ')[0] }}
                        </a>
                    </td>
                    <td>{{ post.content.split(' : ')[1] }}</td>
                    <td>{{ post.author.name }}</td>
                    <td>{{ convertToDate(post.createdAt) }}</td>
                    <td>
                        <p @click="deletePost(post.originId ? post.originId : post.id)">
                            <span class="material-icons">delete</span>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
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
        <div class="mt-3">
            <b-pagination v-model="search.page" :total-rows="total" :per-page="10" @click="getPostList"
                align="center"></b-pagination>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const isAuthorized = ref(false);
const tabId = currentRoute.params.id;
const postList = ref([]);
const isLoading = ref(false);

const search = ref({
    tabRelationId: tabId,
    categoryId: 1,
    type: "title",
    keyword: '',
    title: null,
    page: 0,
    size: 10
});

const total = ref(13);

onMounted(async() => {
    await getPostList();
    await getIsAuthorized();
});

const createNew = () => {
    const currentPath = router.currentRoute.value.path;
    const newPath = `${currentPath}/new`;
    router.push(newPath);
};

async function searchPost() {
    search.value.title = search.value.keyword;
    await getPostList();
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
                page: (search.value.page > 0 ? search.value.page - 1 : 0),
                size: search.value.size
            });
            postList.value = response.data.content;
            total.value = response.data.totalElements;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("게시글을 불러올 수 없습니다.");
    } finally {
        isLoading.value = false;
        if (postList.value.length === 0) {
            postList.value = null;
        }
    }
}

const convertToDate = (date) => {
    const dateSplit = date.split("T");
    dateSplit[1] = dateSplit[1].split(".")[0];

    return dateSplit[0] + " " + dateSplit[1];
};

async function getIsAuthorized(){
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      
      const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/isAuthor/${postId}`);
      isAuthorized.value = (response.data == true ? true : false);
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
  } finally {
  }  
}

async function deletePost(postId) {

if (confirm("게시글을 삭제하시겠습니까?")) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.delete(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/delete/${postId}`);

      const segments = currentRoute.path.split('/');
      let detailPath = `${segments[1]}`;

      if (segments[1] != 'wiki') {
        detailPath = `${segments[1]}/${segments[2]}`;
      }

      location.reload(true);
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    alert("게시글을 삭제할 수 없습니다.");
  } finally {
  }
}

}

</script>

<style>
.content-preview {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /* 두 줄을 표시하고 넘어가면 말줄임표 표시 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 50px;
}

#profile-img {
    float: left;
}

.tag {
    margin-left: 5px;
}

#top {
    display: flex;
    justify-content: space-between;
}

#attach{
    display: flex;
      align-items: center;
}
</style>