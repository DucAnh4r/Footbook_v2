import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Avatar, Input, Button, List, Typography, Space, Tooltip, Spin } from 'antd';
import { SmileOutlined, PhoneOutlined, VideoCameraOutlined, InfoCircleOutlined, SendOutlined, CloseOutlined, StopOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { RiEmojiStickerLine } from "react-icons/ri";
import { PiGifFill } from "react-icons/pi";
import { FaMicrophone } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import GifModal from '../../Modal/GifModal';
import StickerModal from '../../Modal/StickerModal';
import { startRecording, stopRecording } from '../../utils/audioRecorder';
import './Messagepage.scss';
import AudioMessage from "../../Components/AudioMessage";
import { getMessageHistoryService, sendPrivateMessageService } from '../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';

const { Text } = Typography;

// Kết nối WebSocket
const socket = io.connect('http://localhost:5173');

const Messagepage = ({ selectedChat, toggleRightSidebar }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [gifModalVisible, setGifModalVisible] = useState(false);
  const [stickerModalVisible, setStickerModalVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const chatBodyRef = useRef(null);
  const senderId = getUserIdFromLocalStorage();
  const receiverId = selectedChat?.userId || null; 

  useEffect(() => {
    // Nhận tin nhắn từ server WebSocket
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendGif = (gifUrl) => {
    const gifMessage = {
      senderId,
      receiverId,
      content: `<img src="${gifUrl}" alt="GIF" style="max-width: 200px; max-height: 200px;" />`,
      type: 'gif',
      time: new Date().toLocaleTimeString(),
    };
    socket.emit('send_message', gifMessage);
    setMessages((prev) => [...prev, gifMessage]);
    setGifModalVisible(false);
  };

  const handleSendSticker = (stickerUrl) => {
    const stickerMessage = {
      senderId,
      receiverId,
      content: `<img src="${stickerUrl}" alt="Sticker" style="max-width: 200px; max-height: 200px;" />`,
      type: 'sticker',
      time: new Date().toLocaleTimeString(),
    };
    socket.emit('send_message', stickerMessage);
    setMessages((prev) => [...prev, stickerMessage]);
    setStickerModalVisible(false);
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
      const { audioUrl } = await stopRecording();
      setAudioUrl(audioUrl);

      const audioMessage = {
        senderId,
        receiverId,
        content: `<audio controls src="${audioUrl}"></audio>`,
        type: 'audio',
        time: new Date().toLocaleTimeString(),
      };
      socket.emit('send_message', audioMessage);
      setMessages((prev) => [...prev, audioMessage]);
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

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

  const fetchMessageHistory = async () => {
    try {
      setLoading(true);
      const response = await getMessageHistoryService({
        senderId,
        receiverId,
      });
      const data = response?.data?.data || [];
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching message history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receiverId) {
      fetchMessageHistory();
    }
  }, [receiverId]);

  return (
    <div style={styles.chatContainer}>
      {/* Header */}
      <div style={styles.header}>
        <Space>
          <Avatar src={selectedChat?.profilePrictureUrl || "https://via.placeholder.com/40"} />
          <Text strong>{selectedChat?.fullName || "Select a chat"}</Text>
        </Space>
        <Space style={{ paddingRight: '10px', columnGap: '15px' }}>
          <Tooltip title="Call"><PhoneOutlined style={styles.icon} /></Tooltip>
          <Tooltip title="Video"><VideoCameraOutlined style={styles.icon} /></Tooltip>
          <Tooltip title="Info">
            <InfoCircleOutlined onClick={() => toggleRightSidebar((prev) => !prev)} style={styles.icon} />
          </Tooltip>
        </Space>
      </div>

      {/* Messages List */}
      <div className="chat-body" ref={chatBodyRef}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>Loading...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '10px' }}>No messages yet.</div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.messageId || index}
              className={`chat-message ${msg.isSender ? "sender" : "receiver"}`}
            >
              {!msg.isSender && (
                <Avatar
                  src={selectedChat.avatarUrl || "https://via.placeholder.com/40"}
                  style={{ marginRight: '8px' }}
                />
              )}
              <div className="message-content">
                {msg.messageType === "TEXT" && <span>{msg.messageContent}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <Space>
          <Tooltip title="Record">
            <Button
              icon={<FaMicrophone style={{ color: '#0084ff' }} />}
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              type="text"
              style={{ color: isRecording ? 'red' : 'black' }}
            />
          </Tooltip>
          <Tooltip title="GIF">
            <Button icon={<PiGifFill style={{ color: '#0084ff' }} />} onClick={() => setGifModalVisible(true)} />
          </Tooltip>
          <Tooltip title="Sticker">
            <Button icon={<RiEmojiStickerLine style={{ color: '#0084ff' }} />} onClick={() => setStickerModalVisible(true)} />
          </Tooltip>
        </Space>
        <Input
          style={styles.input}
          placeholder="Aa"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSendMessage}
        />
        <Tooltip title="Send">
          <Button icon={<SendOutlined />} onClick={handleSendMessage} />
        </Tooltip>
      </div>

      {/* Modals */}
      <GifModal visible={gifModalVisible} onClose={() => setGifModalVisible(false)} onSendGif={handleSendGif} />
      <StickerModal visible={stickerModalVisible} onClose={() => setStickerModalVisible(false)} onSendSticker={handleSendSticker} />
    </div>
  );
};

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
  },
  header: {
    padding: '10px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #f0f0f0',
  },
  icon: {
    fontSize: '18px',
    cursor: 'pointer',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    marginLeft: '10px',
    borderRadius: '50px',
  },
};

export default Messagepage;
