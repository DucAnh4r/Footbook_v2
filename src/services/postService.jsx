import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";


export const getPostByIdService = (post_id) => {
    return axiosCreate.get(`http://localhost:8080/api/v1/post/${post_id}`, {
    });
};

export const getPostByUserIdService = (user_id) => {
    return axiosCreate.get(`http://localhost:8080/api/v1/post/user/${user_id}/posts`, {
    });
};

export const getPostListFriendService = (user_id) => {
    return axiosCreate.get(`http://localhost:8080/api/v1/post/user/${user_id}`, {
    });
};

export const getImageByUserIdService = (user_id) => {
    return axiosCreate.get(`http://localhost:8080/api/v1/post/ImageUser/${user_id}`, {
    });
};

export const createPostService = (Data) => {
    const formData = new FormData();
    formData.append("userId", Data.userId);
    formData.append("content", Data.content);
    formData.append("privacy", Data.privacy);
    formData.append("theme", Data.theme);
    formData.append("share", Data.share);

    if (Array.isArray(Data.images)) {
        Data.images.forEach((image) => {
            formData.append("images", image);
        });
    } else {
        formData.append("images", Data.images);
    }

    return axiosCreate.post(`${domain}/api/v1/post/create`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};



export const updatePostService = (Data, Post_id) => {
    const formData = new FormData();
    formData.append("content", Data.content);
    formData.append("privacy", Data.privacy);
    formData.append("theme", Data.theme);

    if (Array.isArray(Data.images)) {
        Data.images.forEach((image) => {
            formData.append("images", image);
        });
    } else {
        formData.append("images", Data.images);
    }

    return axiosCreate.put(`${domain}/api/v1/post/update/${Post_id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const DeletePostByIdService = (post_id) => {
    return axiosCreate.delete(`${domain}/api/v1/post/delete/${post_id}`, {
    });
};