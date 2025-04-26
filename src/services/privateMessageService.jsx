import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";

export const sendPrivateMessageService = (data) => {
  const payload = {
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    type: data.type,
  };

  if (data.type === "text") {
    payload.content = data.content;
  } else if (data.type === "image") {
    payload.image_url = data.image_url;
  }

  return axiosCreate.post(`${domain}/chat/send`, payload);
};

export const getMessageHistoryService = (chatId) => {
  return axiosCreate.get(`${domain}/chat/conversation/${chatId}`);
};

export const getUserMessageListService = (userId) => {
  return axiosCreate.get(`${domain}/chat/user/${userId}/conversations`);
};

export const deleteMessageService = (data, message_id) => {
  const { userId } = data;
  return axiosCreate.delete(`${domain}/api/v1/private-message/delete/${message_id}`, {
    params: {
      userId,
    },
  });
};
