/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import {
  Avatar,
  Input,
  Button,
  Space,
  Tooltip,
  Typography,
  Upload,
  message as AntdMessage,
} from "antd";
import {
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  getMessageHistoryService,
  sendPrivateMessageService,
} from "../../services/privateMessageService";
import { userFindByIdService } from "../../services/userService";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";
import styles from "./Messagepage.module.scss";

const { Text } = Typography;

const Messagepage = ({ selectedChat, toggleRightSidebar, onSentMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const chatBodyRef = useRef(null);

  const senderId = getUserIdFromLocalStorage();
  const receiverId = selectedChat?.other_user?.id || null;
  const conversationId = selectedChat?.id || null;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!senderId) return;

      try {
        const response = await userFindByIdService(senderId);
        setCurrentUser(response?.data?.user || null);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [senderId]);

  const fetchMessageHistory = async () => {
    try {
      setLoading(true);
      const response = await getMessageHistoryService(conversationId);
      const data = response?.data || {};
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching message history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receiverId && conversationId) {
      fetchMessageHistory();
    }
  }, [receiverId, conversationId]);

  const handleSendMessage = async (type, value) => {
    if (!value) return;

    const payload = {
      sender_id: senderId,
      receiver_id: receiverId,
      type: type,
    };

    if (type === "text") {
      payload.content = value;
    }

    try {
      setSending(true);
      await sendPrivateMessageService(payload);
      setInputValue("");
      await fetchMessageHistory();
      
      // Gọi callback để thông báo tin nhắn đã được gửi
      if (typeof onSentMessage === 'function') {
        onSentMessage();
      }
    } catch (error) {
      console.error("Error sending message:", error);
      AntdMessage.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      setSending(true);

      const payload = {
        sender_id: senderId,
        receiver_id: receiverId,
        type: "image",
        image_file: file, // truyền file thẳng vào, để sendPrivateMessageService tự upload
        onUploadProgress: (progressEvent) => {
          // bạn có thể console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        },
      };

      await sendPrivateMessageService(payload);
      await fetchMessageHistory();
      
      // Gọi callback để thông báo tin nhắn đã được gửi
      if (typeof onSentMessage === 'function') {
        onSentMessage();
      }
    } catch (error) {
      console.error("Error sending image message:", error);
      AntdMessage.error("Failed to send image.");
    } finally {
      setSending(false);
    }

    return false; // chặn upload mặc định của antd
  };

  // Chuyển đổi sang kiểu số để so sánh
  const isSameUser = (msgSenderId) => {
    return Number(msgSenderId) === Number(senderId);
  };

  // Lấy avatar của người dùng hiện tại từ state
  const getCurrentUserAvatar = () => {
    return currentUser?.avatar_url || "https://via.placeholder.com/40";
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        <Space>
          <Avatar
            src={
              selectedChat?.other_user?.avatar_url ||
              "https://via.placeholder.com/40"
            }
          />
          <Text strong>
            {selectedChat?.other_user?.name || "Select a chat"}
          </Text>
        </Space>
        <Space className={styles.headerIcons}>
          <Tooltip title="Call">
            <PhoneOutlined className={styles.icon} />
          </Tooltip>
          <Tooltip title="Video">
            <VideoCameraOutlined className={styles.icon} />
          </Tooltip>
          <Tooltip title="Info">
            <InfoCircleOutlined
              onClick={() => toggleRightSidebar((prev) => !prev)}
              className={styles.icon}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Messages */}
      <div className={styles.chatBody} ref={chatBodyRef}>
        {loading ? (
          <div className={styles.centerText}>Loading...</div>
        ) : messages.length === 0 ? (
          <div className={styles.centerText}>No messages yet.</div>
        ) : (
          messages.map((msg) => {
            const isMyMessage = isSameUser(msg.sender_id);

            return (
              <div
                key={msg.id}
                className={`${styles.chatMessage} ${
                  isMyMessage ? styles.sender : styles.receiver
                }`}
              >
                {isMyMessage ? (
                  // Tin nhắn của mình (sender)
                  <>
                    <div className={styles.messageContent}>
                      {msg.type === "text" && <span>{msg.content}</span>}
                      {msg.type === "image" && msg.image && (
                        <img
                          src={msg.image.image_url}
                          alt="sent-img"
                          className={styles.sentImage}
                        />
                      )}
                    </div>
                    <Avatar
                      src={getCurrentUserAvatar()}
                      className={styles.messageAvatar}
                    />
                  </>
                ) : (
                  // Tin nhắn của người khác (receiver)
                  <>
                    <Avatar
                      src={
                        selectedChat?.other_user?.avatar_url ||
                        "https://via.placeholder.com/40"
                      }
                      className={styles.messageAvatar}
                    />
                    <div className={styles.messageContent}>
                      {msg.type === "text" && <span>{msg.content}</span>}
                      {msg.type === "image" && msg.image && (
                        <img
                          src={msg.image.image_url}
                          alt="sent-img"
                          className={styles.sentImage}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Input
          className={styles.input}
          placeholder="Aa"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={() => handleSendMessage("text", inputValue)}
          disabled={sending}
        />
        <Space>
          <Upload showUploadList={false} beforeUpload={handleUpload}>
            <Tooltip title="Send Image">
              <Button icon={<UploadOutlined />} type="text" />
            </Tooltip>
          </Upload>
          <Tooltip title="Send">
            <Button
              icon={<SendOutlined />}
              type="text"
              onClick={() => handleSendMessage("text", inputValue)}
              disabled={!inputValue.trim() || sending}
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default Messagepage;