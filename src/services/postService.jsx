/* eslint-disable react-refresh/only-export-components */
import api from "./api"; // Sử dụng instance axios từ api.jsx
import { uploadToCloudinary } from "../utils/cloudinaryConfig";

export const getPostByIdService = (post_id) => {
  return api.get(`/post/${post_id}`);
};

export const getSharedPostByIdService = (post_id) => {
  return api.get(`/post/shared/${post_id}`);
};

export const getShareCount = (post_id) => {
  return api.get(`/post/${post_id}/shares`);
};

export const getPostByUserIdService = (user_id, limit) => {
  return api.get(`/post/user/posts`, {
    params: {
      user_id,
      limit,
    },
  });
};

export const getPostListFriendService = (user_id) => {
  return api.get(`/post/feed/${user_id}`);
};

export const getImageByUserIdService = (user_id, limit, offset) => {
  return api.get(`/post/user/images`, {
    params: {
      user_id,
      limit,
      offset,
    },
  });
};

export const createPostService = async (Data, onUploadProgress) => {
  let imageUrls = [];

  // Nếu là ảnh, upload lên Cloudinary như bình thường
  if (Array.isArray(Data.images)) {
    for (let img of Data.images) {
      const url = await uploadToCloudinary(img, onUploadProgress);
      if (url) imageUrls.push(url);
    }
  } else if (Data.images) {
    const url = await uploadToCloudinary(Data.images, onUploadProgress);
    if (url) imageUrls.push(url);
  }

  // Nếu có GIF được chọn (được truyền qua Data.gif), push trực tiếp vào mảng imageUrls
  if (Data.gif) {
    imageUrls.push(Data.gif); // Không cần upload vì GIF đã có URL sẵn
  }

  // Tạo payload để gửi lên server
  const payload = {
    user_id: Data.userId,
    content: Data.content,
    privacy: Data.privacy,
    theme: Data.theme,
    images: imageUrls,
  };

  return api.post(`/post/create`, payload);
};

export const sharePostService = async (data) => {
  const payload = {
    user_id: data.userId,
    post_id: data.postId,
    content: data.content,
    privacy: data.privacy,
  };

  return api.post(`/post/share`, payload);
};

export const updatePostService = async (Data, Post_id, onUploadProgress) => {
  let imageUrls = [];

  if (Array.isArray(Data.images)) {
    for (let img of Data.images) {
      const url = await uploadToCloudinary(img, onUploadProgress);
      if (url) imageUrls.push(url);
    }
  } else if (Data.images) {
    const url = await uploadToCloudinary(Data.images, onUploadProgress);
    if (url) imageUrls.push(url);
  }

  const payload = {
    post_id: Post_id, // Backend yêu cầu post_id trong payload
    content: Data.content,
    privacy: Data.privacy,
    theme: Data.theme,
    images: imageUrls,
  };

  // Backend không có /api/v1/post/update/{Post_id}, dùng /post/update-content
  return api.put(`/post/update-content`, payload);
};

export const DeletePostByIdService = (post_id) => {
  // Backend không có /api/v1/post/delete/{post_id}, dùng /post/delete với body
  return api.delete(`/post/delete`, {
    data: {
      post_id,
    },
  });
};

export const getFeedPostsService = (user_id, limit = 100, offset = 0) => {
  return api.get(`/post/feed/${user_id}`, {
    params: {
      limit,
      offset,
    },
  });
};