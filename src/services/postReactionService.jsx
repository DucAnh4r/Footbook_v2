import api from "./api"; // Sử dụng instance axios từ api.jsx

export const addPostReactionService = (Data) => {
  return api.post(`/reactions/react`, {
    post_id: Data.post_id,
    user_id: Data.user_id,
    type: Data.type,
  });
};

export const getPostReactionService = (post_id) => {
  return api.get(`/reactions/post/${post_id}`);
};

export const countPostReactionService = (post_id) => {
  // Backend không có /api/v1/postReaction/count-reactions/{post_id}
  // Dùng /reactions/post/{post_id} và tính số lượng từ response
  return api.get(`/reactions/post/${post_id}`).then((response) => {
    const reactions = response?.data?.reactions || [];
    return { data: { count: reactions.length } };
  });
};

export const deletePostReactionService = (Data) => {
  return api.delete(`/reactions/remove`, {
    data: {
      post_id: Data.post_id,
      user_id: Data.user_id,
    },
  });
};