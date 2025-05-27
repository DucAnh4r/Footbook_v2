/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { Avatar, Input, Button, Space, Tooltip, Typography, Upload, message as AntdMessage, Badge } from 'antd';
import { PhoneOutlined, VideoCameraOutlined, InfoCircleOutlined, SendOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { getMessageHistoryService, sendPrivateMessageService, getGroupMessagesService, sendGroupMessageService, getGroupMembersService } from '../../services/privateMessageService';
import { userFindByIdService } from '../../services/userService';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import styles from './Messagepage.module.scss';

const { Text } = Typography;

const Messagepage = ({ selectedChat, toggleRightSidebar, onSentMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const chatBodyRef = useRef(null);

  const senderId = getUserIdFromLocalStorage();
  const isGroupChat = selectedChat?.type === 'group';
  const receiverId = !isGroupChat ? selectedChat?.other_user?.id : null;
  const groupChatId = isGroupChat ? selectedChat?.id : null;
  const conversationId = !isGroupChat ? selectedChat?.id : null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages, groupMembers]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!senderId) return;
      try {
        const response = await userFindByIdService(senderId);
        setCurrentUser(response?.data?.user || null);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, [senderId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      let response;
      if (isGroupChat) {
        response = await getGroupMessagesService(groupChatId);
        setMessages(response?.data?.messages || []);
        const membersResponse = await getGroupMembersService(groupChatId);
        setGroupMembers(membersResponse?.data?.members || []);
      } else {
        response = await getMessageHistoryService(conversationId);
        setMessages(response?.data?.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      AntdMessage.error('Failed to fetch messages.');
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
        const payload = {
          group_chat_id: groupChatId,
          sender_id: senderId,
          type: type,
          content: value
        };
        await sendGroupMessageService(payload);
      } else {
        const payload = {
          sender_id: senderId,
          receiver_id: receiverId,
          type: type,
          content: value
        };
        await sendPrivateMessageService(payload);
      }
      setInputValue('');
      await fetchMessages();
      if (typeof onSentMessage === 'function') {
        onSentMessage();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      AntdMessage.error('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleUpload = async file => {
    try {
      setSending(true);
      if (isGroupChat) {
        const payload = {
          group_chat_id: groupChatId,
          sender_id: senderId,
          type: 'image',
          image_file: file,
          onUploadProgress: progressEvent => {}
        };
        await sendGroupMessageService(payload);
      } else {
        const payload = {
          sender_id: senderId,
          receiver_id: receiverId,
          type: 'image',
          image_file: file,
          onUploadProgress: progressEvent => {}
        };
        await sendPrivateMessageService(payload);
      }
      await fetchMessages();
      if (typeof onSentMessage === 'function') {
        onSentMessage();
      }
    } catch (error) {
      console.error('Error sending image message:', error);
      AntdMessage.error('Failed to send image.');
    } finally {
      setSending(false);
    }
    return false;
  };

  const isSameUser = msgSenderId => {
    return Number(msgSenderId) === Number(senderId);
  };

  const getCurrentUserAvatar = () => {
    return currentUser?.avatar_url || 'https://via.placeholder.com/40';
  };

  const getSenderAvatar = senderId => {
    if (Number(senderId) === Number(getUserIdFromLocalStorage())) {
      return getCurrentUserAvatar();
    }
    const member = groupMembers.find(member => Number(member.id) === Number(senderId));
    return member?.avatar_url || 'https://via.placeholder.com/40';
  };

  const getSenderName = senderId => {
    if (Number(senderId) === Number(getUserIdFromLocalStorage())) {
      return currentUser?.name || 'You';
    }
    const member = groupMembers.find(member => Number(member.id) === Number(senderId));
    return member?.name || 'Unknown user';
  };

  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    if (messageDate.toDateString() === today.toDateString()) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }) + ' ' + messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const groupMessagesByDate = () => {
    let currentDate = null;
    let result = [];
    messages.forEach((msg, index) => {
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
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        {isGroupChat ? (
          <Space>
            <Avatar src={selectedChat?.avatar_url || 'https://via.placeholder.com/40'} />
            <div>
              <Text strong>{selectedChat?.name || 'Group Chat'}</Text>
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
              <Avatar src={selectedChat?.other_user?.avatar_url || 'https://via.placeholder.com/40'} />
            </Badge>
            <Text strong>{selectedChat?.other_user?.name || 'Select a chat'}</Text>
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
            <InfoCircleOutlined onClick={() => toggleRightSidebar(prev => !prev)} className={styles.icon} />
          </Tooltip>
        </Space>
      </div>

      <div className={styles.chatBody} ref={chatBodyRef}>
        {loading ? (
          <div className={styles.centerText}>Loading...</div>
        ) : messages.length === 0 ? (
          <div className={styles.centerText}>No messages yet.</div>
        ) : (
          groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={item.id} className={styles.dateSeparator}>
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
              );
            }
            const isMyMessage = isSameUser(item.sender_id);
            return (
              <div key={item.id} className={`${styles.chatMessage} ${isMyMessage ? styles.sender : styles.receiver}`}>
                {isMyMessage ? (
                  <>
                    <div className={styles.messageWrapper}>
                      {isGroupChat && <div className={styles.senderName}>You</div>}
                      <div className={styles.messageContent}>
                        {item.type === 'text' && <span>{item.content}</span>}
                        {item.type === 'image' && item.image && <img src={item.image.image_url} alt="sent-img" className={styles.sentImage} />}
                      </div>
                      <div className={styles.messageTime}>{formatMessageDate(item.created_at)}</div>
                    </div>
                    <Avatar src={getCurrentUserAvatar()} className={styles.messageAvatar} />
                  </>
                ) : (
                  <>
                    <Avatar src={isGroupChat ? getSenderAvatar(item.sender_id) : selectedChat?.other_user?.avatar_url || 'https://via.placeholder.com/40'} className={styles.messageAvatar} />
                    <div className={styles.messageWrapper}>
                      {isGroupChat && <div className={styles.senderName}>{getSenderName(item.sender_id)}</div>}
                      <div className={styles.messageContent}>
                        {item.type === 'text' && <span>{item.content}</span>}
                        {item.type === 'image' && item.image && <img src={item.image.image_url} alt="sent-img" className={styles.sentImage} />}
                      </div>
                      <div className={styles.messageTime}>{formatMessageDate(item.created_at)}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className={styles.footer}>
        <Input className={styles.input} placeholder="Aa" value={inputValue} onChange={e => setInputValue(e.target.value)} onPressEnter={() => handleSendMessage('text', inputValue)} disabled={sending} />
        <Space>
          <Upload showUploadList={false} beforeUpload={handleUpload}>
            <Tooltip title="Send Image">
              <Button icon={<UploadOutlined />} type="text" />
            </Tooltip>
          </Upload>
          <Tooltip title="Send">
            <Button icon={<SendOutlined />} type="text" onClick={() => handleSendMessage('text', inputValue)} disabled={!inputValue.trim() || sending} />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

export default Messagepage;