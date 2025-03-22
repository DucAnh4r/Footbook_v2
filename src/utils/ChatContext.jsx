import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [hiddenMessages, setHiddenMessages] = useState([]);

  const MAX_CHAT_WINDOWS = 3;

  const addChat = (message) => {
    const isAlreadyOpen = selectedMessages.some((m) => m.userId === message.userId);
    if (!isAlreadyOpen) {
      setSelectedMessages((prev) => {
        const newMessages = [...prev, message];
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

  const handleMessageClick = (message) => {
    addChat(message);
  };

  const handleNewMessage = () => {
    const newMessage = {
      userId: `new-${Date.now()}`, // Tạo ID duy nhất
      name: "Tin nhắn mới",
      message: "Nội dung tin nhắn mới",
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
        handleMessageClick,
        handleNewMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
