import api from './api'; // Sử dụng instance axios từ api.jsx
import { uploadToCloudinary } from '../utils/cloudinaryConfig';

export const userRegisterService = (userData) => {
  return api.post('/register', {
    name: userData.fullName, // Backend yêu cầu "name" thay vì "fullName"
    email: userData.email,
    password: userData.password,
    birth_year: userData.date_of_birth ? new Date(userData.date_of_birth).getFullYear() : null,
    profession: userData.profession || null,
    auth_provider: 'local', // Backend yêu cầu auth_provider
    status: 'available', // Backend yêu cầu status
  });
};

export const userLoginService = (Data) => {
  return api.post('/login', {
    email: Data.email, // Backend yêu cầu email thay vì phone_number
    password: Data.password,
  });
};

export const userSearchService = (Data) => {
  const { keyword, limit, offset } = Data;
  return api.get('/users/search', {
    params: {
      keyword,
      limit,
      offset,
    },
  });
};

export const updateProfileService = (data, user_id) => {
  const payload = {
    user_id,
    ...data, // Có thể chứa birth_year, profession, address
  };
  return api.post('/update-profile', payload);
};

export const updateAvatarService = async (Data, user_id, onUploadProgress) => {
  let avatarUrl = '';

  // Nếu có ảnh, upload lên Cloudinary
  if (Data.avatar) {
    avatarUrl = await uploadToCloudinary(Data.avatar, onUploadProgress);
  }

  const payload = {
    user_id,
    avatar_url: avatarUrl || null, // Backend yêu cầu avatar_url
  };

  return api.post('/update-avatar', payload);
};

export const updateCoverService = async (Data, user_id, onUploadProgress) => {
  let coverUrl = '';

  // Nếu có ảnh, upload lên Cloudinary
  if (Data.coverPicture) {
    coverUrl = await uploadToCloudinary(Data.coverPicture, onUploadProgress);
  }

  const payload = {
    user_id,
    cover_photo_url: coverUrl || null, // Backend yêu cầu cover_photo_url
  };

  return api.post('/update-cover', payload);
};

export const userFindByIdService = (user_id) => {
  return api.get(`/user/${user_id}`);
};

export const userListFriendService = (user_id) => {
  return api.get(`/relationships/friends`, {
    params: {
      user_id: user_id
    },
  });
};