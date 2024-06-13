<template>
    <div>
      <p>{{ comment.content }}</p>
      <button @click="editComment">Edit</button>
      <button @click="deleteComment">Delete</button>
    </div>
  </template>
  
  <script>
  import { updateComment, deleteComment } from '../../api/comment';
  
  export default {
    props: ['comment'],
    methods: {
      async editComment() {
        const newContent = prompt('Update comment:', this.comment.content);
        if (newContent) {
          const updatedComment = { content: newContent };
          await updateComment(this.comment.id, updatedComment);
          this.$emit('commentUpdated');
        }
      },
      async deleteComment() {
        await deleteComment(this.comment.id);
        this.$emit('commentDeleted');
      }
    }
  };
  </script>
  