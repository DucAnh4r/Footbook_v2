/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button, Input, Space, Dropdown, Badge, Tooltip, message, Modal, Spin } from "antd";
import { 
  SmileOutlined, 
  PictureOutlined, 
  SendOutlined, 
  MoreOutlined,
  CloseOutlined,
  MinusOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { 
  getMessageHistoryService, 
  sendPrivateMessageService, 
  getGroupMessagesService, 
  sendGroupMessageService 
} from "../../services/privateMessageService";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";
import "./ChatWindow.scss";

const ChatWindow = ({ message, onClose, onHide, position }) => {
  const [messageText, setMessageText] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState({});
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUserId = getUserIdFromLocalStorage();

  // Xác định loại chat (nhóm hay cá nhân)
  const isGroupChat = message.type === 'group';
  
  useEffect(() => {
    fetchChatHistory();
  }, [message]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const fetchChatHistory = async () => {
    try {
      setLoading(true);
      let response;
      
      // Lấy lịch sử chat dựa vào loại chat
      if (isGroupChat) {
        response = await getGroupMessagesService(message.groupId);
      } else {
        response = await getMessageHistoryService(message.conversationId || message.userId);
      }
      
      const history = response?.data?.messages || [];
      
      // Log để debug
      console.log("Chat history:", history);
      
      setChatHistory(history);
      
      // Khởi tạo lại trạng thái loading cho ảnh
      initializeImageLoadingState(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      message.error("Không thể tải tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Khởi tạo trạng thái loading cho ảnh
  const initializeImageLoadingState = (messages) => {
    const newImageLoading = {};
    messages.forEach((msg, index) => {
      if (msg.type === "image" && msg.image && msg.image.image_url) {
        newImageLoading[index] = true;
      }
    });
    setImageLoading(newImageLoading);
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !imageFile) || loading) return;

    try {
      setLoading(true);
      const data = {
        sender_id: parseInt(currentUserId, 10),
        type: imageFile ? "image" : "text",
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100));
        },
      };

      if (imageFile) {
        data.image_file = imageFile;
      } else {
        data.content = messageText;
      }

      // Gửi tin nhắn dựa vào loại chat
      if (isGroupChat) {
        data.group_chat_id = message.groupId;
        await sendGroupMessageService(data);
      } else {
        data.receiver_id = message.userId;
        await sendPrivateMessageService(data);
      }

      // Làm mới lịch sử chat
      await fetchChatHistory();
      
      // Xóa dữ liệu đã gửi
      setMessageText("");
      setImageFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Không thể gửi tin nhắn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const cancelImageUpload = () => {
    setImageFile(null);
    setUploadProgress(0);
  };

  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    // Check if message is from today
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Show date and time for older messages
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }) + ' ' + messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const dropdownItems = [
    {
      key: "1",
      label: "Xóa cuộc trò chuyện",
    },
    {
      key: "2",
      label: "Chặn người dùng",
    },
    {
      key: "3",
      label: "Tắt thông báo",
    },
  ];

  // Mở hình ảnh xem trước
  const handlePreviewImage = (imageUrl) => {
    setPreviewImage(imageUrl);
    setPreviewVisible(true);
  };

  // Đóng hình ảnh xem trước
  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  // Xử lý khi ảnh được tải xong
  const handleImageLoaded = (index) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
  };

  // Xử lý khi ảnh không tải được
  const handleImageError = (index) => {
    setImageLoading(prev => ({
      ...prev,
      [index]: false
    }));
  };

  // Group messages by date for better visualization
  const groupMessagesByDate = () => {
    let currentDate = null;
    let result = [];
    
    chatHistory.forEach((msg, index) => {
      const messageDate = new Date(msg.created_at).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        result.push({
          type: 'date',
          date: messageDate,
          id: `date-${index}`
        });
      }
      
      result.push(msg);
    });
    
    return result;
  };

  const groupedMessages = groupMessagesByDate();

  return (
    <div
      className="chat-window"
      style={{
        position: "fixed",
        bottom: `${position.bottom}px`,
        right: `${position.right}px`,
        zIndex: 1000,
        width: "320px",
        height: "450px",
      }}
    >
      <div className="chat-header">
        <div className="user-info">
          <Badge dot={message.status === "available"} color="green" offset={[-2, 28]}>
            <Avatar src={message.profilePictureUrl || message.avatar_url || "https://i.pravatar.cc/150"} size={36} />
          </Badge>
          <div className="user-details">
            <div className="user-name">{message.name}</div>
            <div className="user-status">
              {message.status === "available" ? "Đang hoạt động" : "Ngoại tuyến"}
            </div>
          </div>
        </div>
        <div className="chat-actions">
          <Space>
            <Tooltip title="Ẩn">
              <Button 
                type="text" 
                icon={<MinusOutlined />} 
                onClick={onHide}
                className="action-button" 
              />
            </Tooltip>
            <Tooltip title="Tùy chọn">
              <Dropdown menu={{ items: dropdownItems }} placement="bottomRight" trigger={['click']}>
                <Button 
                  type="text" 
                  icon={<MoreOutlined />} 
                  className="action-button"
                />
              </Dropdown>
            </Tooltip>
            <Tooltip title="Đóng">
              <Button 
                type="text" 
                icon={<CloseOutlined />} 
                onClick={onClose}
                className="action-button" 
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      <div className="chat-body" ref={chatBodyRef}>
        {groupedMessages.map((item, index) => {
          if (item.type === 'date') {
            return (
              <div key={item.id} className="date-separator">
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            );
          }
          
          const isSelf = item.sender_id.toString() === currentUserId.toString();
          const showAvatar = !isSelf && isGroupChat;
          
          // Xác định đường dẫn ảnh đúng dựa vào dữ liệu trả về
          let imageUrl = null;
          if (item.type === "image") {
            if (item.image) {
              imageUrl = item.image.image_url;
            }
          }
          
          return (
            <div
              key={`msg-${index}`}
              className={`message-container ${isSelf ? "self" : "other"}`}
            >
              {showAvatar && (
                <div className="message-avatar">
                  <Avatar 
                    size={24} 
                    src={(item.sender?.avatar_url || item.sender?.profilePictureUrl || "https://i.pravatar.cc/150")} 
                  />
                </div>
              )}
              
              <div className="message-wrapper">
                {showAvatar && (
                  <div className="sender-name">{item.sender?.name}</div>
                )}
                
                <div className={`message-bubble ${isSelf ? "self" : "other"}`}>
                  {item.type === "text" ? (
                    <div className="message-content">{item.content}</div>
                  ) : (
                    <div className="message-image">
                      {imageUrl ? (
                        <>
                          {imageLoading[index] && (
                            <div className="image-loading">
                              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                            </div>
                          )}
                          <img 
                            src={imageUrl} 
                            alt="Shared" 
                            onClick={() => handlePreviewImage(imageUrl)}
                            onLoad={() => handleImageLoaded(index)}
                            onError={() => handleImageError(index)}
                            style={{ display: imageLoading[index] ? 'none' : 'block' }}
                          />
                        </>
                      ) : (
                        <div className="image-error">Ảnh không khả dụng</div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="message-time">
                  {formatMessageDate(item.created_at)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handlePreviewCancel}
        centered
        width="auto"
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
        style={{ top: 20 }}
      >
        <img alt="Preview" style={{ maxWidth: '100%', maxHeight: '90vh' }} src={previewImage} />
      </Modal>

      <div className="chat-footer">
        {imageFile && (
          <div className="image-preview">
            <div className="preview-container">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Upload Preview"
              />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={cancelImageUpload}
                className="cancel-upload"
              />
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
        
        <div className="input-container">
          <Button
            className="action-icon"
            icon={<SmileOutlined />}
            type="text"
          />
          <Button 
            className="action-icon"
            icon={<PictureOutlined />}
            onClick={triggerImageUpload}
            type="text"
          />
          <Input
            className="message-input"
            placeholder="Nhập tin nhắn..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!!imageFile || loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            loading={loading}
            disabled={(!messageText.trim() && !imageFile) || loading}
            className="send-button"
          />
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  );
};

export default ChatWindow;