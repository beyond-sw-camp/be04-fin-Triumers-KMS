<template>
    <form id="general-container" @submit.prevent="submitPost" @keydown.enter.prevent>
        <div id="top">
            <h3 id="title"><strong>게시글 작성</strong> </h3>
            <div>
                <button id="save-btn" type="submit" class="btn btn-light" @click="savePost">작성 완료</button>
            </div>
        </div>
        <hr>

        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="title-input" v-model="postForm.title" placeholder="제목을 입력해주세요.">
            <label for="title-input">제목</label>
        </div>

        <div>
            <b-form-select v-model="postForm.tags[0]" :options="options"></b-form-select>
        </div>

        <p id="content-info">
            <small>※ 마우스 오른쪽 버튼 클릭 시, 파일 업로드가 가능합니다.</small>
            <span><b-button variant="outline-secondary" data-bs-toggle="modal"
                    data-bs-target="#preview">미리보기</b-button></span>

            <!-- 미리보기 모달창 -->
            <div class="modal fade" id="preview" data-bs-backdrop="static" data-bs-keyboard="false"
                        tabindex="-1" aria-labelledby="previewLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="previewLabel">미리보기</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <div v-html="marked(postForm.content)">
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
        </p>

        <div id="content" class="form-floating mb-3">
            <b-form-textarea id="content-text" class="form-control" placeholder="내용을 입력해주세요." v-model="postForm.content"
                no-resize @contextmenu.prevent="openFileDialog" @keydown.stop></b-form-textarea>
            <label for="content-text">
                내용 (마크다운 형식으로 작성)
            </label>
            <input type="file" ref="fileInput" @change="uploadFile" style="display: none;" />
        </div>
    </form>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import { marked } from 'marked';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const originId = (currentRoute.query.post || null);

const fileInput = ref(null);

const post = ref({});
const postForm = ref({
    id: null,
    title: '',
    postImg: null,
    content: '',
    tags: ['스터디 모집'],
    tabRelationId: tabId,
    originId: originId
})

const options = ["스터디 모집", "단기 모임"];

const renderer = new marked.Renderer();
renderer.image = (href, title, text) => {
  return `<img src="${href}" alt="${text}" class="img-fluid">`;
};
marked.setOptions({ renderer });

onMounted(() => {
    if (originId) {
        setPost();
    }
});

async function setPost(){

    await getPostById(originId);
    postForm.value = {
        title: post.value.title,
        content: post.value.content,
        tags: post.value.tags,
        tabRelationId: tabId,
        postImg: post.value.postImg,
        id: originId
    };
}

function openFileDialog(event) {
    event.preventDefault();
    fileInput.value.click();
}

async function uploadFile(event) {
    const file = event.target.files[0];

    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const token = localStorage.getItem('token');
            if (token) {
                axios.defaults.headers.common['Authorization'] = token;
                const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

    const fileUrl = response.data;
    const isImage = file.type.startsWith('image/');
    const urlToInsert = isImage ? `![${file.name}](${fileUrl})` : `[${file.name}](${fileUrl})`;
    if(isImage && postForm.value.postImg == null) {
        postForm.value.postImg = fileUrl;
    }
                insertAtCursor(urlToInsert);
            } else {
                alert("잘못된 접근입니다.");
            }
        } catch (error) {
            alert("파일 업로드에 실패했습니다.");
        }
    }
}

function insertAtCursor(text) {
    const textarea = document.getElementById('content-text');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const beforeValue = textarea.value.substring(0, startPos);
    const afterValue = textarea.value.substring(endPos, textarea.value.length);

    postForm.value.content = beforeValue + text + afterValue;
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.focus();
}

async function savePost() {

let url = `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/regist`;
if (originId != null) {
    url = `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/modify`;
}
await saveNewPost(url);

}

async function goDetail(id) {
const segments = currentRoute.path.split('/');

let detailPath = segments[1];
if (segments[1] == "group") {
    detailPath = `${segments[1]}/${segments[2]}`
}

if (originId != null) {
    id = originId;
}
const newPath = `/${detailPath}/detail/${id}`;
router.push(newPath);
}

async function saveNewPost(url) {
try {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post(url, {
            title: postForm.value.title,
            postImg: postForm.value.postImg,
            content: postForm.value.content,
            tags: postForm.value.tags,
            tabRelationId: tabId,
            originId: originId
        });
        await goDetail(response.data.id);
    } else {
        alert("잘못된 접근입니다.");
    }
} catch (error) {
    alert("게시글 저장에 실패했습니다.");
}
}

async function getPostById(originId) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/find/${originId}`);
            post.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("게시글을 불러올 수 없습니다.");
    } finally {
    }
}

</script>

<style>
#general-container {
    margin: 20px;
}

#content {
    margin-top: 15px;
}
</style>