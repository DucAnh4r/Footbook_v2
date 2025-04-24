import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";

export const createFriendshipService = (Data) => {
  // Gửi lời mời
  const { requester_id, addressee_id } = Data;
  return axiosCreate.post(
    `${domain}/relationships/send-request`,
    {
        requester_id,
        addressee_id
    }
    
  );
};

export const acceptFriendshipService = (Data) => {
  const { requester_id, addressee_id } = Data;
  return axiosCreate.put(`${domain}/relationships/accept-request`, {
    requester_id, // no
    addressee_id, // minh
  });
};

export const declineFriendshipService = (Data) => {
    const { requester_id, addressee_id } = Data;
    return axiosCreate.put(`${domain}/relationships/decline-request`, {
      requester_id, // no
      addressee_id, // minh
    });
};

export const deleteFriendshipService = (Data) => {
    const { user_id, friend_id } = Data;
    return axiosCreate.delete(`${domain}/relationships/unfriend`, {
      data: {
        user_id, // mình
        friend_id, // bạn
      },
    });
  };
  

export const getFriendshipStatusService = (Data) => {
  //pending, accept, block
  const { user_id, other_user_id } = Data;
  return axiosCreate.get(`${domain}/relationships/check-status`, {
    params: {
      user_id, //minh
      other_user_id, //no
    },
  });
};

export const getFriendshipRequestService = (Data) => {
  //hien thi danh sach pendin
  const { user_id } = Data;
  return axiosCreate.get(`${domain}/relationships/received-requests`, {
    params: {
      user_id, 
    },
  });
};

export const getSentFriendRequestsService = (Data) => {
  //hien thi danh sach pendin
  const { user_id } = Data;
  return axiosCreate.get(`${domain}/relationships/sent-requests`, {
    params: {
      user_id, 
    },
  });
};

export const countFriendService = (userId) => {
  //dem so ban
  return axiosCreate.get(`${domain}/relationships/count?user_id=${userId}`, {});
};
