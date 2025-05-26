import api from "./api"; // Sử dụng instance axios từ api.jsx

export const createFriendshipService = (Data) => {
  // Gửi lời mời
  const { requester_id, addressee_id } = Data;
  return api.post(`/relationships/send-request`, {
    requester_id,
    addressee_id,
  });
};

export const acceptFriendshipService = (Data) => {
  const { requester_id, addressee_id } = Data;
  return api.put(`/relationships/accept-request`, {
    requester_id,
    addressee_id,
  });
};

export const declineFriendshipService = (Data) => {
  const { requester_id, addressee_id } = Data;
  return api.put(`/relationships/decline-request`, {
    requester_id,
    addressee_id,
  });
};

export const deleteFriendshipService = (Data) => {
  const { user_id, friend_id } = Data;
  return api.delete(`/relationships/unfriend`, {
    data: {
      user_id,
      friend_id,
    },
  });
};

export const getFriendshipStatusService = (Data) => {
  const { user_id, other_user_id } = Data;
  return api.get(`/relationships/check-status`, {
    params: {
      user_id,
      other_user_id,
    },
  });
};

export const getFriendshipRequestService = (Data) => {
  const { user_id } = Data;
  return api.get(`/relationships/received-requests`, {
    params: {
      user_id,
    },
  });
};

export const getSentFriendRequestsService = (Data) => {
  const { user_id } = Data;
  return api.get(`/relationships/sent-requests`, {
    params: {
      user_id,
    },
  });
};

export const countFriendService = (userId) => {
  return api.get(`/relationships/count`, {
    params: {
      user_id: userId,
    },
  });
};

export const getSuggestedFriendsService = (Data) => {
  const { user_id, limit } = Data;
  return api.get(`/relationships/suggested`, {
    params: {
      user_id,
      limit,
    },
  });
};