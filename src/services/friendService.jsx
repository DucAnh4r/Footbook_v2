import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";

export const createFriendshipService = (Data) => { // Gửi lời mời
    const { userId1, userId2 } = Data;
    return axiosCreate.post(
         `${domain}/api/v1/friendship/create`,
        {}, // Body để trống vì bạn không cần gửi dữ liệu body
        {
            params: {
                userId1, // minh
                userId2, // no
            },
        }
    );
};


export const acceptFriendshipService = (Data) => {//chap nhan ban
    const { userId1, userId2 } = Data;
    return axiosCreate.put(`${domain}/api/v1/friendship/accept`, {}, {
        params: {
            userId1, //no
            userId2, //minh
        },
    });
};

export const deleteFriendshipService = (Data) => { // Xóa bạn
    const { userId1, userId2 } = Data;
    return axiosCreate.delete(`${domain}/api/v1/friendship/delete`, {
        params: {
            userId1, // mình
            userId2, // bạn
        },
    });
};


export const getFriendshipStatusService = (Data) => {//pending, accept, block
    const { userId1, userId2 } = Data;
    return axiosCreate.get(`${domain}/api/v1/friendship/status`, {
        params: {
            userId1, //minh
            userId2, //no
        },
    });
};

export const getFriendshipRequestService = (Data) => {//hien thi danh sach pendin
    const { userId2 } = Data;
    return axiosCreate.get(`${domain}/api/v1/friendship/received-requests`, {
        params: {
            userId2, //là mình
        },
    });
};
//sender

export const countFriendService = (userId) => {//dem so ban
    return axiosCreate.get(`${domain}/relationships/count?user_id=${userId}`, {
    });
};
