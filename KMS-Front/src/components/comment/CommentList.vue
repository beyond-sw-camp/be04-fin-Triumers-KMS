   <!-- <template>
    <div>
      <AddComment :postId="postId" @commentAdded="fetchComments" />
      <ul class="list-group">
        <li v-for="comment in comments" :key="comment.id" class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">{{ comment.author }}</div>
            <div v-if="editingCommentId === comment.id">
              <input v-model="editedCommentContent" class="form-control mb-2" />
              <button class="btn btn-primary btn-sm me-2" @click="saveEditComment(comment.id)">저장</button>
              <button class="btn btn-secondary btn-sm" @click="cancelEditComment">취소</button>
            </div>
            <div v-else>
              {{ comment.content }}
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-link text-secondary" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="material-icons">more_vert</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item" href="#" @click="startEditComment(comment.id, comment.content)">수정</a></li>
              <li><a class="dropdown-item" href="#" @click="deleteComment(comment.id)">삭제</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getCommentsByPostId, updateComment, deleteComment } from '../../api/comment';
  import AddComment from './AddComment.vue';
  
  export default {
    props: ['postId'],
    components: {
      AddComment
    },
    data() {
      return {
        comments: [],
        editingCommentId: null,
        editedCommentContent: ''
      };
    },
    created() {
      this.fetchComments();
    },
    methods: {
      async fetchComments() {
        const response = await getCommentsByPostId(this.postId);
        this.comments = response.data;
      },
      startEditComment(commentId, content) {
        this.editingCommentId = commentId;
        this.editedCommentContent = content;
      },
      async saveEditComment(commentId) {
        if (this.editedCommentContent.trim() !== '') {
          const updatedComment = { content: this.editedCommentContent };
          await updateComment(commentId, updatedComment);
          this.editingCommentId = null;
          this.editedCommentContent = '';
          this.fetchComments();
        }
      },
      cancelEditComment() {
        this.editingCommentId = null;
        this.editedCommentContent = '';
      },
      async deleteComment(commentId) {
        await deleteComment(commentId);
        this.fetchComments();
      }
    }
  };
  </script>
  
  <style scoped>
  .list-group-item {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #ffffff;
  }
  
  .fw-bold {
    color: #000000;
  }
  
  .btn-link {
    color: #ffffff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  
  .dropdown-menu {
    background-color: #333;
    color: #FFFFFF;
  }
  
  .dropdown-item {
    color: #FFFFFF;
  }
  
  .dropdown-item:hover {
    background-color: #444444;
  }
  
  .form-control {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #333;
  }
  </style>
   -->

   <template>
    <div>
      <AddComment :postId="postId" @commentAdded="fetchComments" />
      <ul class="list-group">
        <li v-for="comment in comments" :key="comment.id" class="list-group-item d-flex justify-content-between align-items-start">
          <div class="ms-2 me-auto">
            <div class="fw-bold">{{ comment.author }}</div>
            <div v-if="editingCommentId === comment.id">
              <input v-model="editedCommentContent" class="form-control mb-2" />
              <button class="btn btn-primary btn-sm me-2" @click="saveEditComment(comment.id)">저장</button>
              <button class="btn btn-secondary btn-sm" @click="cancelEditComment">취소</button>
            </div>
            <div v-else>
              {{ comment.content }}
            </div>
          </div>
          <div class="dropdown">
            <button class="btn btn-link text-secondary" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              <span class="material-icons">more_vert</span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a class="dropdown-item" href="#" @click="handleEditClick($event, comment.id, comment.content)">수정</a></li>
              <li><a class="dropdown-item" href="#" @click="handleDeleteClick($event, comment.id)">삭제</a></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { getCommentsByPostId, updateComment, deleteComment } from '../../api/comment';
  import AddComment from './AddComment.vue';
  
  export default {
    props: ['postId'],
    components: {
      AddComment
    },
    data() {
      return {
        comments: [],
        editingCommentId: null,
        editedCommentContent: ''
      };
    },
    created() {
      this.fetchComments();
    },
    methods: {
      async fetchComments() {
        const response = await getCommentsByPostId(this.postId);
        this.comments = response.data;
      },
      startEditComment(commentId, content) {
        this.editingCommentId = commentId;
        this.editedCommentContent = content;
      },
      async saveEditComment(commentId) {
        if (this.editedCommentContent.trim() !== '') {
          const updatedComment = { content: this.editedCommentContent };
          await updateComment(commentId, updatedComment);
          this.editingCommentId = null;
          this.editedCommentContent = '';
          this.fetchComments();
        }
      },
      cancelEditComment() {
        this.editingCommentId = null;
        this.editedCommentContent = '';
      },
      async deleteComment(commentId) {
        await deleteComment(commentId);
        this.fetchComments();
      },
      handleEditClick(event, commentId, content) {
        event.preventDefault();
        event.stopPropagation();
        this.startEditComment(commentId, content);
      },
      handleDeleteClick(event, commentId) {
        event.preventDefault();
        event.stopPropagation();
        this.deleteComment(commentId);
      }
    }
  };
  </script>
  
  <style scoped>
  .list-group-item {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #ffffff;
  }
  
  .fw-bold {
    color: #000000;
  }
  
  .btn-link {
    color: #ffffff;
    text-decoration: none;
  }
  
  .btn-link:hover {
    text-decoration: underline;
  }
  
  .dropdown-menu {
    background-color: #333;
    color: #FFFFFF;
  }
  
  .dropdown-item {
    color: #FFFFFF;
  }
  
  .dropdown-item:hover {
    background-color: #444444;
  }
  
  .form-control {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #333;
  }
  </style>
  