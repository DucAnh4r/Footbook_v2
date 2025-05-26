import api from "./api"; // Sử dụng instance axios từ api.jsx
import { uploadMessagesImgToCloudinary } from "../utils/cloudinaryConfig";

export const getConversationBetweenUsers = (user1Id, user2Id) => {
  return api.get(`/chat/conversation/between/${user1Id}/${user2Id}`);
};

// Private Message Services (Các chức năng tin nhắn cá nhân đã có)
export const sendPrivateMessageService = async (data) => {
  const payload = {
    sender_id: data.sender_id,
    receiver_id: data.receiver_id,
    type: data.type,
  };

  if (data.type === "text") {
    payload.content = data.content;
  } else if (data.type === "image") {
    // Nếu là image, phải upload trước
    const imageUrl = await uploadMessagesImgToCloudinary(data.image_file, data.onUploadProgress);
    if (!imageUrl) throw new Error("Failed to upload image to cloud");

    payload.image_url = imageUrl;
  }

  return api.post(`/chat/send`, payload);
};

export const getMessageHistoryService = (chatId) => {
  return api.get(`/chat/conversation/${chatId}`);
};

export const getUserMessageListService = (userId) => {
  return api.get(`/chat/user/${userId}/conversations`);
};

export const deleteMessageService = (data, message_id) => {
  const { userId } = data;
  // Backend không có /api/v1/private-message/delete/{message_id}
  // Hiện tại backend chưa có API xóa tin nhắn, tạm thời để nguyên
  return api.delete(`/api/v1/private-message/delete/${message_id}`, {
    params: {
      userId,
    },
  });
};

// Group Chat Services (Chức năng tin nhắn nhóm mới thêm)

// Tạo nhóm chat mới
export const createGroupChatService = async (data) => {
  const payload = {
    name: data.name,
    creator_id: data.creator_id,
    members: data.members,
  };

  // Nếu có avatar, upload lên Cloudinary trước
  if (data.avatar_file) {
    const avatarUrl = await uploadMessagesImgToCloudinary(data.avatar_file, data.onUploadProgress);
    if (!avatarUrl) throw new Error("Failed to upload group avatar to cloud");
    payload.avatar_url = avatarUrl;
  } else {
    payload.avatar_url = "https://res.cloudinary.com/dzkzebsn7/image/upload/v1746200508/group-chat-icon-for-online-messaging-vector_ovjkhx.jpg";
  }

  return api.post(`/group-chat/create`, payload);
};

// Gửi tin nhắn nhóm
export const sendGroupMessageService = async (data) => {
  const payload = {
    group_chat_id: data.group_chat_id,
    sender_id: data.sender_id,
    type: data.type,
  };

  if (data.type === "text") {
    payload.content = data.content;
  } else if (data.type === "image") {
    // Nếu là image, phải upload trước
    const imageUrl = await uploadMessagesImgToCloudinary(data.image_file, data.onUploadProgress);
    if (!imageUrl) throw new Error("Failed to upload image to cloud");
    payload.image_url = imageUrl;
  }

  return api.post(`/group-chat/send`, payload);
};

// Lấy danh sách tin nhắn của một nhóm chat
export const getGroupMessagesService = (groupId) => {
  return api.get(`/group-chat/${groupId}/messages`);
};

// Lấy danh sách nhóm chat của một user
export const getUserGroupChatsService = (userId) => {
  return api.get(`/group-chat/user/${userId}/groups`);
};

// Thêm thành viên vào nhóm chat
export const addGroupMemberService = (groupChatId, userId) => {
  return api.post(`/group-chat/members/add`, {
    group_chat_id: groupChatId,
    user_id: userId,
  });
};

// Xóa thành viên khỏi nhóm chat
export const removeGroupMemberService = (groupChatId, userId) => {
  return api.post(`/group-chat/members/remove`, {
    group_chat_id: groupChatId,
    user_id: userId,
  });
};

// Lấy danh sách thành viên của nhóm chat
export const getGroupMembersService = (groupId) => {
  return api.get(`/group-chat/${groupId}/members`);
};

// Cập nhật thông tin nhóm chat
export const updateGroupChatService = async (data) => {
  const payload = {
    group_chat_id: data.group_chat_id,
  };

  if (data.name) {
    payload.name = data.name;
  }

  // Nếu có avatar mới, upload lên Cloudinary trước
  if (data.avatar_file) {
    const avatarUrl = await uploadMessagesImgToCloudinary(data.avatar_file, data.onUploadProgress);
    if (!avatarUrl) throw new Error("Failed to upload new group avatar to cloud");
    payload.avatar_url = avatarUrl;
  } else if (data.avatar_url) {
    // Nếu chỉ truyền URL ảnh có sẵn
    payload.avatar_url = data.avatar_url;
  }

  return api.put(`/group-chat/update`, payload);
};