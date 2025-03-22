import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";


export const addPostReactionService = (Data) => {
    return axiosCreate.post(`${domain}/api/v1/postReaction/add`, {
        post_id: Data.post_id,
        user_id: Data.user_id,
        reaction_type: Data.reaction_type,
    });
};

export const getPostReactionService = (post_id) => {
    return axiosCreate.get(`${domain}/api/v1/postReaction/reactions/${post_id}`, {
    });
};

export const countPostReactionService = (post_id) => {
    return axiosCreate.get(`${domain}/api/v1/postReaction/count-reactions/${post_id}`, {
    });
};

export const deletePostReactionService = (post_id, user_id) => {
    return axiosCreate.delete(`${domain}/api/v1/postReaction/delete/${post_id}/${user_id}`, {
    });
};
