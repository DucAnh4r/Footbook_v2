/* eslint-disable react-refresh/only-export-components */
import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";
import { uploadToCloudinary } from "../utils/cloudinaryConfig";

export const getPostByIdService = (post_id) => {
  return axiosCreate.get(`${domain}/post/${post_id}`, {});
};

export const getSharedPostByIdService = (post_id) => {
  return axiosCreate.get(`${domain}/post/shared/${post_id}`, {});
};

export const getShareCount = (post_id) => {
  return axiosCreate.get(`${domain}/post/${post_id}/shares`, {});
}

export const getPostByUserIdService = (user_id, limit) => {
  return axiosCreate.get(
    `${domain}/post/user/posts?user_id=${user_id}&limit=${limit}`,
    {}
  );
};

export const getPostListFriendService = (user_id) => {
  return axiosCreate.get(
    `http://localhost:8080/api/v1/post/user/${user_id}`,
    {}
  );
};

export const getImageByUserIdService = (user_id, limit, offset) => {
  return axiosCreate.get(`${domain}/post/user/images`, {
    params: {
      user_id: user_id,
      limit: limit,
      offset: offset,
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
    share: Data.share,
    images: imageUrls,
  };

  return axiosCreate.post(`${domain}/post/create`, payload);
};

export const sharePostService = async (data) => {
  const payload = {
    user_id: data.userId,
    post_id: data.postId,
    content: data.content,
    privacy: data.privacy,
  };

  return axiosCreate.post(`${domain}/post/share`, payload);
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
    content: Data.content,
    privacy: Data.privacy,
    theme: Data.theme,
    images: imageUrls,
  };

  return axiosCreate.put(`${domain}/api/v1/post/update/${Post_id}`, payload);
};

export const DeletePostByIdService = (post_id) => {
  return axiosCreate.delete(`${domain}/api/v1/post/delete/${post_id}`, {});
};

export const getFeedPostsService = (user_id, limit = 100, offset = 0) => {
  return axiosCreate.get(`${domain}/post/feed/${user_id}`, {
    params: {
      limit: limit,
      offset: offset,
    },
  });
};
