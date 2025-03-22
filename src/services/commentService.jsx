import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";

export const addCommentService = (Data) => {
  return axiosCreate.post(`${domain}/api/v1/comments/add`, {
    postId: Data.postId,
    userId: Data.userId,
    content: Data.content,
    parentCommentId: Data.parentCommentId,
  });
};

export const getCommentService = (postId) => {
    return axiosCreate.get(`${domain}/api/v1/comments/post/${postId}`, {
    });
};

export const countCommentService = (postId) => {
    return axiosCreate.get(`${domain}/api/v1/comments/count/${postId}`, {
    });
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
  