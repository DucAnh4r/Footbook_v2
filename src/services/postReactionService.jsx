import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";


export const addPostReactionService = (Data) => {
    return axiosCreate.post(`${domain}/reactions/react`, {
        post_id: Data.post_id,
        user_id: Data.user_id,
        type: Data.type
    });
};

export const getPostReactionService = (post_id) => {
    return axiosCreate.get(`${domain}/reactions/post/${post_id}`, {
    });
};

export const countPostReactionService = (post_id) => {
    return axiosCreate.get(`${domain}/api/v1/postReaction/count-reactions/${post_id}`, {
    });
};

export const deletePostReactionService = (Data) => {
    return axiosCreate.delete(`${domain}/reactions/remove`, {
      data: {
        post_id: Data.post_id,
        user_id: Data.user_id
      }
    });
  };
  
