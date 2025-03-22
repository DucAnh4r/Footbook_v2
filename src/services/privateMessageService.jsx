import axiosCreate from "../utils/axiosRelease";
import { domain } from "./api";


export const sendPrivateMessageService = (data) => {
    const formData = new FormData();
    formData.append("senderId", data.senderId);
    formData.append("receiverId", data.receiverId);
    formData.append("messageContent", data.messageContent);
    formData.append("messageType", data.messageType);

    if (data.attachments && Array.isArray(data.attachments)) {
        data.attachments.forEach((file) => {
            formData.append("attachments", file);
        });
    }

    return axiosCreate.post(`${domain}/api/v1/private-message/send`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getMessageHistoryService = (Data) => {
    const { senderId, receiverId, page, size } = Data;
    return axiosCreate.get(`${domain}/api/v1/private-message/history`, {
        params: {
            senderId, 
            receiverId,
            page,
            size,
        },
    });
};

export const getUserMessageListService = (userId) => {
    return axiosCreate.get(`${domain}/api/v1/private-message/users/last-messages`, {
      params: {
        userId, // Truyền trực tiếp chuỗi userId
      },
    });
  };
  

export const deleteMessageService = (Data, message_id) => {
    const { userId } = Data;
    return axiosCreate.delete(`${domain}/api/v1/private-message/delete/${message_id}`,{}, {
        params: {
            userId,
        },
    });
};
