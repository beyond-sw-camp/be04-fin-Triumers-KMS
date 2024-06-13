<template>

    <form id="docs-container" @submit.prevent="submitPost" @keydown.enter.prevent>
        <div id="top">
            <h3 id="title"><strong>DOCS</strong> </h3>
            <div>
                <button id="save-btn" type="submit" class="btn btn-light" @click="savePost">업로드</button>
            </div>
        </div>
        <hr>

        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="title-input" v-model="docsForm.title" placeholder="제목을 입력해주세요.">
            <label for="title-input">제목</label>
        </div>

        <div class="mb-3">
            <label for="formFile" class="form-label"><strong>파일 업로드</strong></label>
            <input class="form-control" type="file" @change="uploadDocs" id="formFile">
        </div>
    </form>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;

const docsForm = ref({
    title: '',
    content: '',
    tabRelationId: tabId,
    categoryId: 1
})

async function uploadDocs(event) {
    const file = event.target.files[0];

    if (file) {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const fileUrl = response.data;
            docsForm.value.content = `${file.name.trim()} : ${file.type.trim()} : ${fileUrl.trim()}`;
        } catch (error) {
            alert("파일 업로드에 실패했습니다.");
        }
    }
    else {
        alert("잘못된 접근입니다.");
    }
}

async function savePost() {

    const url = `http://triumers-back.ap-northeast-2.elasticbeanstalk.com/post/regist`;
    await saveNewPost(url);

    const segments = currentRoute.path.split('/');
    const newPath = `/${segments[1]}/${segments[2]}/docs`;
    router.push(newPath);
    
}

async function saveNewPost(url) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(url, {
                title: docsForm.value.title,
                content: docsForm.value.content,
                tabRelationId: tabId,
                categoryId: docsForm.value.categoryId,
                tags: []
            });

        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글 저장에 실패했습니다.");
    }
}


onMounted(() => {

});

</script>

<style>
#docs-container {
    margin: 20px;
}

#content {
    margin-top: 15px;
}
</style>