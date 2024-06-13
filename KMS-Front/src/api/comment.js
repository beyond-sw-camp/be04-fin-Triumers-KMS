import axios from 'axios';

const API_URL = 'http://triumers-back.ap-northeast-2.elasticbeanstalk.com/comments';

// 댓글 생성
export const addComment = async (comment) => {
  return await axios.post(API_URL, comment);
};

// 댓글 수정
export const updateComment = async (commentId, comment) => {
  return await axios.put(`${API_URL}/${commentId}`, comment);
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  return await axios.delete(`${API_URL}/${commentId}`);
};

// 특정 게시물의 댓글 조회
export const getCommentsByPostId = async (postId) => {
  return await axios.get(`${API_URL}/post/${postId}`);
};
