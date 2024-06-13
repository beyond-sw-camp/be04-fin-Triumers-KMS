<template>
    <div>
      <div class="input-group mb-3">
        <input 
          type="text" 
          class="form-control" 
          v-model="newComment" 
          placeholder="댓글 추가..." 
          aria-label="댓글 추가"
        />
        <button class="btn btn-outline-secondary" type="button" @click="handleAddComment">추가</button>
      </div>
  
      <!-- 모달 창 -->
      <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="errorModalLabel">오류</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              댓글을 입력해주세요.
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal">확인</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { addComment } from '../../api/comment';
  import { Modal } from 'bootstrap';
  
  export default {
    props: ['postId'],
    data() {
      return {
        newComment: ''
      };
    },
    methods: {
      async handleAddComment() {
        if (!this.newComment.trim()) {
          const errorModal = new Modal(document.getElementById('errorModal'));
          errorModal.show();
          return;
        }
  
        const comment = {
          postId: this.postId,
          content: this.newComment,
          // 필요한 추가 데이터 (authorId 등)
        };
        await addComment(comment);
        this.newComment = '';
        this.$emit('commentAdded');
      }
    }
  };
  </script>
  
  <style scoped>
  .input-group {
    display: flex;
    align-items: stretch; /* 수정: 높이 맞추기 위해 stretch로 설정 */
  }
  
  .form-control {
    background-color: #ffffff;
    color: #000000;
    border: 1px solid #333;
    height: 38px;
  }
  
  .btn-outline-secondary {
    color: #ffffff;
    background-color: #042444; /* 버튼의 배경색을 설정합니다. */
    border-color: #042444;
    height: 38px;
  }
  
  .btn-outline-secondary:hover {
    background-color: #033b59; /* 버튼 호버 시 배경색 변경 */
    color: #ffffff;
  }
  </style>
  