/* eslint-disable react-refresh/only-export-components */
import api from "./api";
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

  if (Array.isArray(Data.images)) {
    for (let img of Data.images) {
      const url = await uploadToCloudinary(img, onUploadProgress);
      if (url) imageUrls.push(url);
    }
  } else if (Data.images) {
    const url = await uploadToCloudinary(Data.images, onUploadProgress);
    if (url) imageUrls.push(url);
  }

  if (Data.gif) {
    imageUrls.push(Data.gif);
  }

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
      if (typeof img === "string") {
        imageUrls.push(img);
      } else {
        const url = await uploadToCloudinary(img, onUploadProgress);
        if (url) imageUrls.push(url);
      }
    }
  } else if (Data.images) {
    if (typeof Data.images === "string") {
      imageUrls.push(Data.images);
    } else {
      const url = await uploadToCloudinary(Data.images, onUploadProgress);
      if (url) imageUrls.push(url);
    }
  }

  const payload = {
    post_id: Post_id,
    user_id: Data.userId,
    content: Data.content,
    privacy: Data.privacy,
    theme: Data.theme,
    images: imageUrls,
  };

  return api.put(`/post/update-content`, payload);
};

export const DeletePostByIdService = (post_id, user_id) => {
  return api.delete(`/post/delete`, {
    data: {
      post_id,
      user_id,
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