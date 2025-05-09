import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [hiddenMessages, setHiddenMessages] = useState([]);

  const MAX_CHAT_WINDOWS = 3;

  const addChat = (message) => {
    // Kiểm tra xem đã có cửa sổ chat này chưa
    // Cho nhóm sẽ kiểm tra theo groupId, cho tin nhắn cá nhân sẽ kiểm tra theo userId
    const isAlreadyOpen = selectedMessages.some((m) => {
      if (message.type === 'group' && m.type === 'group') {
        return m.groupId === message.groupId;
      }
      return m.userId === message.userId;
    });

    // Nếu chưa mở, thêm vào danh sách chat đang mở
    if (!isAlreadyOpen) {
      setSelectedMessages((prev) => {
        const newMessages = [...prev, message];
        // Nếu vượt quá số lượng cho phép, ẩn chat cũ nhất
        if (newMessages.length > MAX_CHAT_WINDOWS) {
          const [oldest, ...rest] = newMessages;
          setHiddenMessages((hidden) => [...hidden, oldest]);
          return rest;
        }
        return newMessages;
      });
    }
  };

  const closeChat = (userId) => {
    setSelectedMessages((prev) => prev.filter((message) => message.userId !== userId));
  };

  const hideChat = (userId) => {
    const messageToHide = selectedMessages.find((m) => m.userId === userId);
    if (messageToHide) {
      setHiddenMessages((prev) => [...prev, messageToHide]);
      setSelectedMessages((prev) => prev.filter((m) => m.userId !== userId));
    }
  };

  const showChat = (userId) => {
    const messageToShow = hiddenMessages.find((m) => m.userId === userId);
    if (messageToShow) {
      setHiddenMessages((prev) => prev.filter((m) => m.userId !== userId));
      setSelectedMessages((prev) => {
        const newMessages = [...prev, messageToShow];
        if (newMessages.length > MAX_CHAT_WINDOWS) {
          const [oldest, ...rest] = newMessages;
          setHiddenMessages((hidden) => [...hidden, oldest]);
          return rest;
        }
        return newMessages;
      });
    }
  };

  const handleNewMessage = () => {
    const newMessage = {
      userId: `new-${Date.now()}`, // Tạo ID duy nhất
      name: "Tin nhắn mới",
      message: "Nội dung tin nhắn mới",
      type: 'new'
    };
    addChat(newMessage);
  };

  return (
    <ChatContext.Provider
      value={{
        selectedMessages,
        hiddenMessages,
        addChat,
        closeChat,
        hideChat,
        showChat,
        handleNewMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};