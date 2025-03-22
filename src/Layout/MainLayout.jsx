import React from "react";
import { Layout, Avatar, Badge, Tooltip, FloatButton, Typography } from "antd";
import { IoPencilSharp } from "react-icons/io5";
import Header from "./Header"; // Custom header component
import "./MainLayout.scss";
import { HeaderProvider } from "../Context/HeaderContext";
import ChatWindow from "../Pages/Homepage/ChatWindow";
import { useChat } from "../utils/ChatContext";

const MainLayout = ({ children }) => {
  const {
    selectedMessages,
    hiddenMessages,
    addChat,
    closeChat,
    hideChat,
    showChat,
    handleNewMessage,
  } = useChat(); // Sử dụng context

  const calculatePosition = (index) => {
    const baseBottom = 0;
    const baseRight = 94;
    const offset = index * 350;
    return { bottom: baseBottom, right: baseRight + offset };
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <HeaderProvider>
        <Header onMessageClick={addChat} />
        <Layout style={{ minHeight: "auto" }}>{children}</Layout>
      </HeaderProvider>
      <FloatButton.Group shape="circle" style={{ bottom: "14px", right: "24px" }}>
        {hiddenMessages.map((message) => (
          <Tooltip
            key={message.userId}
            title={
              <div>
                <Typography.Text strong>{message.name || "Không có tên"}</Typography.Text>
                <Typography.Text type="secondary">
                  {message.message || "Không có nội dung"}
                </Typography.Text>
              </div>
            }
            color="white"
            placement="left"
          >
            <Badge
              count={
                <div
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: "green",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              }
              offset={[-8, 40]}
            >
              <Avatar
                src="https://i.pravatar.cc/300"
                size={48}
                onClick={() => showChat(message.userId)}
                style={{ cursor: "pointer" }}
              />
            </Badge>
          </Tooltip>
        ))}
        <Tooltip title="Tin nhắn mới" placement="left">
          <FloatButton icon={<IoPencilSharp />} onClick={handleNewMessage} />
        </Tooltip>
      </FloatButton.Group>

      {selectedMessages.map((message, index) => {
        const position = calculatePosition(index);
        return (
          <ChatWindow
            key={message.userId}
            receiverId={message.userId}
            message={message}
            onClose={() => closeChat(message.userId)}
            onHide={() => hideChat(message.userId)}
            position={position}
          />
        );
      })}
    </Layout>
  );
};

export default MainLayout;
