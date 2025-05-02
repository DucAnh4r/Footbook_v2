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
  Badge,
} from "antd";
import {
  PhoneOutlined,
  VideoCameraOutlined,
  InfoCircleOutlined,
  SendOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getMessageHistoryService,
  sendPrivateMessageService,
  getGroupMessagesService,
  sendGroupMessageService,
  getGroupMembersService,
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
  const [groupMembers, setGroupMembers] = useState([]);
  const chatBodyRef = useRef(null);

  const senderId = getUserIdFromLocalStorage();
  const isGroupChat = selectedChat?.type === 'group';
  
  // ID của người nhận hoặc ID của group chat tùy thuộc vào loại chat
  const receiverId = !isGroupChat ? selectedChat?.other_user?.id : null;
  const groupChatId = isGroupChat ? selectedChat?.id : null;
  
  // ID của cuộc trò chuyện (dùng cho lấy lịch sử tin nhắn cá nhân)
  const conversationId = !isGroupChat ? selectedChat?.id : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100); // delay nhẹ để đảm bảo DOM đã vẽ xong
  
    return () => clearTimeout(timeout);
  }, [messages, groupMembers]);
  

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

  // Fetch tin nhắn - phân biệt giữa chat cá nhân và nhóm
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      let response;
      if (isGroupChat) {
        // Lấy tin nhắn nhóm
        response = await getGroupMessagesService(groupChatId);
        setMessages(response?.data?.messages || []);
        
        // Lấy thêm thông tin thành viên nhóm
        const membersResponse = await getGroupMembersService(groupChatId);
        setGroupMembers(membersResponse?.data?.members || []);
      } else {
        // Lấy tin nhắn cá nhân
        response = await getMessageHistoryService(conversationId);
        setMessages(response?.data?.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((isGroupChat && groupChatId) || (!isGroupChat && receiverId && conversationId)) {
      fetchMessages();
    }
  }, [isGroupChat, receiverId, conversationId, groupChatId]);

  const handleSendMessage = async (type, value) => {
    if (!value) return;

    try {
      setSending(true);

      if (isGroupChat) {
        // Gửi tin nhắn nhóm
        const payload = {
          group_chat_id: groupChatId,
          sender_id: senderId,
          type: type,
          content: value
        };
        
        await sendGroupMessageService(payload);
      } else {
        // Gửi tin nhắn cá nhân
        const payload = {
          sender_id: senderId,
          receiver_id: receiverId,
          type: type,
          content: value
        };
        
        await sendPrivateMessageService(payload);
      }
      
      setInputValue("");
      await fetchMessages();
      
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

      if (isGroupChat) {
        // Gửi hình ảnh trong nhóm
        const payload = {
          group_chat_id: groupChatId,
          sender_id: senderId,
          type: "image",
          image_file: file,
          onUploadProgress: (progressEvent) => {
            // Có thể hiển thị tiến trình upload nếu muốn
          },
        };
        
        await sendGroupMessageService(payload);
      } else {
        // Gửi hình ảnh cho cá nhân
        const payload = {
          sender_id: senderId,
          receiver_id: receiverId,
          type: "image",
          image_file: file,
          onUploadProgress: (progressEvent) => {
            // Có thể hiển thị tiến trình upload nếu muốn
          },
        };
        
        await sendPrivateMessageService(payload);
      }
      
      await fetchMessages();
      
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

  // Lấy avatar của người gửi trong nhóm chat
  const getSenderAvatar = (senderId) => {
    if (Number(senderId) === Number(getUserIdFromLocalStorage())) {
      return getCurrentUserAvatar();
    }
    
    const member = groupMembers.find(member => Number(member.id) === Number(senderId));
    return member?.avatar_url || "https://via.placeholder.com/40";
  };

  // Lấy tên của người gửi trong nhóm chat
  const getSenderName = (senderId) => {
    if (Number(senderId) === Number(getUserIdFromLocalStorage())) {
      return currentUser?.name || "You";
    }
    
    const member = groupMembers.find(member => Number(member.id) === Number(senderId));
    return member?.name || "Unknown user";
  };

  return (
    <div className={styles.chatContainer}>
      {/* Header */}
      <div className={styles.header}>
        {isGroupChat ? (
          <Space>
            <Avatar src={selectedChat?.avatar_url || "https://via.placeholder.com/40"} />
            <div>
              <Text strong>{selectedChat?.name || "Group Chat"}</Text>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {groupMembers.length} members
                </Text>
              </div>
            </div>
          </Space>
        ) : (
          <Space>
            <Badge dot={selectedChat?.other_user?.status === 'available'} color="green" offset={[-2, 30]}>
              <Avatar src={selectedChat?.other_user?.avatar_url || "https://via.placeholder.com/40"} />
            </Badge>
            <Text strong>{selectedChat?.other_user?.name || "Select a chat"}</Text>
          </Space>
        )}
        
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
                      {isGroupChat && <div className={styles.senderName}>You</div>}
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
                      src={isGroupChat 
                        ? getSenderAvatar(msg.sender_id)
                        : (selectedChat?.other_user?.avatar_url || "https://via.placeholder.com/40")
                      }
                      className={styles.messageAvatar}
                    />
                    <div className={styles.messageContent}>
                      {isGroupChat && (
                        <div className={styles.senderName}>
                          {getSenderName(msg.sender_id)}
                        </div>
                      )}
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