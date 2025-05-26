import api from "./api";

export const addCommentService = (Data) => {
  return api.post(`/comments/add`, {
    post_id: Data.postId,
    user_id: Data.userId,
    content: Data.content,
    parent_id: Data.parentCommentId,
  });
};

export const getCommentService = (postId) => {
  console.log("Calling getCommentService for postId:", postId);
  return api.get(`/comments/post`, {
    params: {
      post_id: postId,
    },
  });
};

export const countCommentService = async (postId) => {
  try {
    const response = await api.get(`/comments/count`, {
      params: { post_id: postId },
    });
    return response?.data || 0;
  } catch (error) {
    console.error("Lỗi khi đếm comment:", error);
    return 0;
  }
};

export const editCommentService = (Data) => {
  return api.put(`/comments/update`, {
    comment_id: Data.commentId,
    user_id: Data.userId,
    content: Data.newContent,
  });
};

export const deleteCommentService = (Data) => {
  const { commentId, userId } = Data;
  return api.delete(`/comments/delete`, {
    data: {
      comment_id: commentId,
      user_id: userId,
    },
  });
};

export const replyToCommentService = (data) => {
  console.log("Calling replyToCommentService for commentId:", data.parentCommentId);
  return api.post(`/comments/add`, {
    post_id: data.postId,
    user_id: data.userId,
    content: data.content,
    parent_id: data.parentCommentId,
  });
};

export const getCommentRepliesService = (commentId) => {
  console.log("Calling getCommentRepliesService for commentId:", commentId);
  return api.get(`/comments/replies`, {
    params: {
      comment_id: commentId,
    },
  });
};

export const countCommentRepliesService = async (commentId) => {
  try {
    console.log("Calling countCommentRepliesService for commentId:", commentId);
    const response = await api.get(`/comments/replies/count`, {
      params: { comment_id: commentId },
    });
    console.log("countCommentRepliesService response:", response?.data?.count);
    return response?.data?.count || 0;
  } catch (error) {
    console.error("Lỗi khi đếm reply:", error);
    return 0;
  }
};