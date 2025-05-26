/* eslint-disable no-unused-vars */
import api from './api'; // Sử dụng instance axios từ api.jsx

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

export const updateBioService = (Data, user_id) => {
  // Backend không có endpoint /api/v1/users/{user_id}/update-bio
  // Sử dụng /update-profile để cập nhật bio (giả sử bio nằm trong profile)
  return api.post('/update-profile', {
    user_id,
    bio: Data.bio,
  });
};

export const updateProfileService = (data, user_id) => {
  const payload = {
    user_id,
    ...data, // Có thể chứa birth_year, profession, address
  };
  return api.post('/update-profile', payload);
};

export const updateCoverService = (Data, user_id) => {
  const formData = new FormData();
  formData.append('cover_photo_url', Data.coverPicture); // Backend yêu cầu cover_photo_url
  return api.post('/update-profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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