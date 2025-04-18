import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";


export const userRegisterService = (userData) => {
  return axiosCreate.post(`${domain}/api/v1/users/register`, {
    fullName: userData.fullName,
    gender: userData.gender,
    date_of_birth: userData.date_of_birth,
    password: userData.password,
    email: userData.email,
    username: userData.username,
  });
};


export const userLoginService = (Data) => {
  return axiosCreate.post(`${domain}/api/v1/users/login`, {
    phone_number: Data.phone_number,
    password: Data.password
  });
};


export const userSearchService = (Data) => {
  const { keyword, page, size } = Data;
  return axiosCreate.get(`${domain}/api/v1/users/search`, {
    params: {
      keyword,
      page,
      size,
    },
  });
};

export const updateBioService = (Data, user_id) => {
  return axiosCreate.patch(`${domain}/api/v1/users/${user_id}/update-bio`, {
    bio: Data.bio,
  });
};

export const updateProfileService = (data, user_id) => {
  const payload = {
    user_id,
    ...data, // có thể chứa birth_year, profession, address
  };

  return axiosCreate.post(`${domain}/update-profile`, payload);
};


export const updateCoverService = (Data, user_id) => {
  const formData = new FormData();
  formData.append("coverPicture", Data.coverPicture);
  return axiosCreate.patch(`${domain}/api/v1/users/${user_id}/update-cover-picture`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
};

export const userFindByIdService = (user_id) => {
  return axiosCreate.get(`${domain}/user/${user_id}`, {
  });
};

export const userListFriendService = (user_id) => {
  return axiosCreate.get(`${domain}/relationships/friends`, {
    params: {
      user_id: user_id
    },
  });
};