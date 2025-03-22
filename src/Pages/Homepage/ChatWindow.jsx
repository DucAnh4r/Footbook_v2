import React, { useState, useEffect, useRef } from "react";
import { Input, Avatar, Button, Flex, Typography, Tooltip } from "antd";
import {
  ArrowRightOutlined,
  CloseOutlined,
  MinusOutlined,
  PhoneOutlined,
  SmileOutlined,
  StopOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "./ChatWindow.scss";
import { FaChevronDown, FaMicrophone } from "react-icons/fa";
import { RiEmojiStickerLine } from "react-icons/ri";
import { PiGifFill } from "react-icons/pi";
import { io } from "socket.io-client";
import { AiFillLike } from "react-icons/ai";

// Import các hàm từ audioRecorder.js
import {
  startRecording,
  stopRecording,
  playAudio,
  downloadAudio,
} from "../../utils/audioRecorder";
import GifModal from "../../Modal/GifModal";
import StickerModal from "../../Modal/StickerModal";
import FileUploadButton from "../../Components/FileUploadButton";
import ChatSettingsPopup from "../../Components/ChatSettingsPopup";
import {
  getMessageHistoryService,
  sendPrivateMessageService,
} from "../../services/privateMessageService";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";
import WebSocketComponent from "../../utils/WebSocketComponent";

const { TextArea } = Input;

const ChatWindow = ({ message, onClose, onHide, position, receiverId }) => {
  const [socket, setSocket] = useState(null);
  const [chatMessages, setChatMessages] = useState([]); // Lưu trữ tin nhắn
  const [inputValue, setInputValue] = useState(""); // Giá trị input của TextArea
  const [isRecording, setIsRecording] = useState(false); // Trạng thái ghi âm
  const [audioUrl, setAudioUrl] = useState(null); // URL file âm thanh sau khi ghi âm
  const [audioBlob, setAudioBlob] = useState(null); // Blob âm thanh để tải xuống
  const chatBodyRef = useRef(null); // Thêm ref để theo dõi khung chat
  const [isRecordingMode, setIsRecordingMode] = useState(false); // Chế độ ghi âm
  const [gifModalVisible, setGifModalVisible] = useState(false); // Quản lý trạng thái hiển thị modal GIF
  const [stickerModalVisible, setStickerModalVisible] = useState(false);
  const senderId = getUserIdFromLocalStorage();
  const [receiver, setReceiver] = useState({});
  const [sender, setSender] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = 10;
<WebSocketComponent/>
  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);
  
    // Gửi userId lên server để đăng ký socket
    newSocket.emit("register", senderId);
  
    // Lắng nghe tin nhắn mới
    newSocket.on("receiveMessage", (data) => {
      if (
        (data.senderId === senderId && data.receiverId === receiverId) || // Tin nhắn của người gửi
        (data.senderId === receiverId && data.receiverId === senderId)    // Tin nhắn của người nhận
      ) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, [senderId, receiverId]);
  

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    return () => {
      chatMessages.forEach((msg) => {
        if (msg.content.startsWith("<img") || msg.content.startsWith("<a")) {
          const matches = msg.content.match(/src="([^"]+)"/);
          if (matches) URL.revokeObjectURL(matches[1]);
        }
      });
    };
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const newMessage = {
        senderId,
        receiverId,
        messageContent: inputValue.trim(),
        messageType: "TEXT", // Tin nhắn dạng văn bản
    };

    try {
        // Gửi tin nhắn qua API
        await sendPrivateMessageService(newMessage);

        // Phát tin nhắn qua Socket.IO
        socket.emit("sendMessage", {
            senderId,
            receiverId,
            messageContent: inputValue.trim(),
            messageType: "TEXT",
        });

        // Cập nhật giao diện người gửi
        setMessages((prevMessages) => [{ ...newMessage, isSender: true }, ...prevMessages]);

        // Reset input
        setInputValue("");
    } catch (error) {
        console.error("Error sending message:", error);
    }
};


  const handleStartRecording = async () => {
    try {
      await startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const { audioUrl, audioBlob } = await stopRecording();
      setAudioUrl(audioUrl);
      setAudioBlob(audioBlob);

      const audioMessage = {
        user: "You",
        text: `<audio controls src="${audioUrl}"></audio>`,
        type: "audio",
        time: new Date().toLocaleTimeString(),
      };
      socket.emit("send_message", audioMessage);
      setMessages((prev) => [...prev, audioMessage]);
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const handleSendGif = (gifUrl) => {
    const gifMessage = {
      content: `<img src="${gifUrl}" alt="GIF" style="max-width: 200px; max-height: 200px;" />`,
      sender: "You",
      type: "gif",
    };
    setChatMessages((prevMessages) => [gifMessage, ...prevMessages]);
    socket.emit("sendMessage", {
      content: gifMessage.content,
      recipient: message.name,
      type: "gif",
    });
    setGifModalVisible(false);
  };

  const handleSendSticker = (stickerUrl) => {
    const stickerMessage = {
      content: `<img src="${stickerUrl}" alt="Sticker" style="max-width: 200px; max-height: 200px;" />`,
      sender: "You",
      type: "sticker",
    };
    setChatMessages((prevMessages) => [stickerMessage, ...prevMessages]);
    socket.emit("sendMessage", {
      content: stickerMessage.content,
      recipient: message.name,
      type: "sticker",
    });
    setStickerModalVisible(false);
  };

  const handleSendLike = () => {
    const likeMessage = {
      content: `<img src="https://upload.wikimedia.org/wikipedia/commons/1/13/Facebook_like_thumb.png" alt="Like" style="max-width: 50px; max-height: 50px;" />`,
      sender: "You",
      type: "like",
    };
    setChatMessages((prevMessages) => [likeMessage, ...prevMessages]);
    socket.emit("sendMessage", {
      content: likeMessage.content,
      recipient: message.name,
      type: "like",
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };

  // Lấy lịch sử tin nhắn
  const fetchMessageHistory = async () => {
    try {
      setLoading(true);
      const response = await getMessageHistoryService({
        senderId,
        receiverId,
        page,
        size: pageSize,
      });

      const data = response?.data?.data || {};
      setMessages((prev) => [...data.messages, ...prev]);
      setReceiver(data.receiver);
      setSender(data.sender);
    } catch (error) {
      console.error("Error fetching message history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageHistory();
  }, [page]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      className="chat-window"
      style={{
        position: "fixed",
        bottom: position.bottom,
        right: position.right,
        width: "338px",
        height: "455px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="chat-header">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={receiver.avatarUrl || "https://via.placeholder.com/40"}
          />
          <div style={{ marginLeft: "8px" }}>
            <Typography.Text strong>
              {receiver.fullName || "Người dùng"}
            </Typography.Text>
            <Typography.Text type="secondary">Active now</Typography.Text>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Tooltip title="Gọi điện">
            <Button type="text" icon={<PhoneOutlined />} />
          </Tooltip>
          <Tooltip title="Gọi video">
            <Button type="text" icon={<VideoCameraOutlined />} />
          </Tooltip>
          <Tooltip title="Thu nhỏ cửa sổ">
            <Button type="text" icon={<MinusOutlined />} onClick={onHide} />
          </Tooltip>
          <Tooltip title="Đóng cửa sổ">
            <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
          </Tooltip>
        </div>
      </div>

      {/* Body */}
      <div className="chat-body" ref={chatBodyRef}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "10px" }}>Loading...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: "center", padding: "10px" }}>
            No messages yet.
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.messageId || index}
              className={`chat-message ${msg.isSender ? "sender" : "receiver"}`}
            >
              {!msg.isSender && (
                <Avatar
                  src={receiver.avatarUrl || "https://via.placeholder.com/40"}
                  style={{ marginRight: "8px" }}
                />
              )}
              <div className="message-content">
                {msg.messageType === "TEXT" && (
                  <span>{msg.messageContent}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="chat-footer">
        {isRecordingMode ? (
          // Giao diện ghi âm
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px",
              backgroundColor: "#d8b6ff",
              borderRadius: "10px",
            }}
          >
            <Button
              shape="circle"
              icon={<CloseOutlined />}
              style={{ backgroundColor: "white", color: "red" }}
              onClick={handleCancelRecording}
            />
            <Button
              shape="circle"
              icon={<StopOutlined />}
              style={{ backgroundColor: "white", color: "purple" }}
              onClick={handleStopRecording}
            />
            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: "4px 10px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>0:00</span>
            </div>
            <Button
              shape="circle"
              icon={<ArrowRightOutlined />}
              style={{ backgroundColor: "white", color: "blue" }}
              onClick={() => setIsRecordingMode(false)}
            />
          </div>
        ) : (
          <Flex gap={4} align="center" style={{ height: "60px" }}>
            {/* Nút ghi âm */}
            <Tooltip title={isRecording ? "Dừng ghi âm" : "Ghi âm"}>
              <Button
                type="text"
                icon={<FaMicrophone />}
                onClick={
                  isRecording ? handleStopRecording : handleStartRecording
                }
                style={{
                  color: isRecording ? "red" : "#000",
                  fontSize: "20px",
                  width: "36px",
                  paddingLeft: "4px",
                }}
              />
            </Tooltip>

            <FileUploadButton
              onFileChange={(fileMessage) => {
                const formattedMessage = {
                  ...fileMessage,
                  type: "file", // Thêm type để xác định đây là file
                };

                setChatMessages((prevMessages) => [
                  formattedMessage,
                  ...prevMessages,
                ]);
                socket.emit("sendFile", {
                  content: formattedMessage.content,
                  recipient: message.name,
                  type: "file", // Gửi type kèm theo
                });
              }}
            />

            <Tooltip title="Sticker">
              <Button
                type="text"
                icon={<RiEmojiStickerLine />}
                style={{ color: "#000", fontSize: "20px", width: "36px" }}
                onClick={() => setStickerModalVisible(true)}
              />
            </Tooltip>

            <Tooltip title="GIF">
              <Button
                type="text"
                icon={<PiGifFill />}
                style={{ color: "#000", fontSize: "20px", width: "36px" }}
                onClick={() => setGifModalVisible(true)}
              />
            </Tooltip>

            <Tooltip title="Chọn emoji">
              <div className="textarea-container">
                <TextArea
                  placeholder="Aa"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  className="custom-textarea"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onPressEnter={(e) => {
                    e.preventDefault(); // Ngăn xuống dòng
                    handleSendMessage(); // Gửi tin nhắn
                  }}
                />
              </div>
            </Tooltip>

            <Tooltip title="Gửi like">
              <Button
                type="text"
                icon={<AiFillLike />}
                style={{
                  color: "#000",
                  fontSize: "20px",
                  width: "36px",
                  paddingRight: "4px",
                }}
                onClick={handleSendLike} // Gọi hàm gửi like
              />
            </Tooltip>
          </Flex>
        )}
      </div>
      {/* Modal GIF */}
      <GifModal
        visible={gifModalVisible}
        onClose={() => setGifModalVisible(false)}
        onSendGif={handleSendGif}
      />

      <StickerModal
        visible={stickerModalVisible}
        onClose={() => setStickerModalVisible(false)}
        onSendSticker={handleSendSticker}
      />
    </div>
  );
};

export default ChatWindow;
