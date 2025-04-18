import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";

export const addCommentService = (Data) => {
  return axiosCreate.post(`${domain}/comments/add`, {
    post_id: Data.postId,
    user_id: Data.userId,
    content: Data.content,
    parentCommentId: Data.parentCommentId,
  });
};

export const getCommentService = (postId) => {
  return axiosCreate.get(`${domain}/comments/post`, {
    params: {
      post_id: postId,
    },
  });
};

export const countCommentService = async (postId) => {
  try {
    const response = await axiosCreate.get(`${domain}/comments/post`, {
      params: { post_id: postId },
    });

    const comments = response?.data?.comments || [];
    return comments.length;
  } catch (error) {
    console.error("Lỗi khi đếm comment:", error);
    return 0;
  }
};


export const eidtCommentService = (Data) => {
  return axiosCreate.put(`${domain}/api/v1/comments/edit`, {
    commentId: Data.commentId,
    userId: Data.userId,
    newContent: Data.newContent,
  });
};

export const deleteCommentService = (Data) => {
  const { commentId, userId } = Data;
  return axiosCreate.delete(`${domain}/api/v1/comments/delete`, {
    params: {
      commentId,
      userId,
    },
  });
};
