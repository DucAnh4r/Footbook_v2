/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, List, Typography, Spin, Input } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './RightSidebar.module.scss';
import { getUserMessageListService } from '../../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';
import ChatWindow from "../../../Pages/Homepage/ChatWindow";
import { userListFriendService } from '../../../services/userService';

const { Text } = Typography;

const RightSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  const userId = getUserIdFromLocalStorage();

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await userListFriendService(userId.toString());
      setFriends(response?.data?.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const [selectedMessages, setSelectedMessages] = useState([]);
  const [hiddenMessages, setHiddenMessages] = useState([]);

  const MAX_CHAT_WINDOWS = 3; // Giới hạn số lượng cửa sổ chat

  const handleMessageClick = (message) => {
      const isHidden = hiddenMessages.some((m) => m.userId === message.userId);
      
      if (isHidden) {
          setHiddenMessages((prev) => prev.filter((m) => m.userId !== message.userId));
          setSelectedMessages((prev) => {
              const newMessages = [...prev, message];
              if (newMessages.length > MAX_CHAT_WINDOWS) {
                  // Nếu vượt quá giới hạn, ẩn cái cũ nhất
                  const [oldest, ...rest] = newMessages;
                  setHiddenMessages((hidden) => [...hidden, oldest]);
                  return rest;
              }
              return newMessages;
          });
      } else {
          const isAlreadyOpen = selectedMessages.some((m) => m.userId === message.userId);
      console.log("message",message);
          if (!isAlreadyOpen) {
              setSelectedMessages((prev) => {
                  const newMessages = [...prev, message];
                  if (newMessages.length > MAX_CHAT_WINDOWS) {
                      // Nếu vượt quá giới hạn, ẩn cái cũ nhất
                      const [oldest, ...rest] = newMessages;
                      setHiddenMessages((hidden) => [...hidden, oldest]);
                      return rest;
                  }
                  return newMessages;
              });
          }
      }
  };

  const calculatePosition = (index) => {
    const baseBottom = 0;
    const baseRight = 94;
    const offset = index * 350;
    return { bottom: baseBottom, right: baseRight + offset };
};

  const handleCloseChat = (id) => {
      setSelectedMessages((prev) => prev.filter((message) => message.userId !== id));
  };

  const handleHideChat = (id) => {
      const messageToHide = selectedMessages.find((m) => m.userId === id);
      if (messageToHide) {
          setHiddenMessages((prev) => [...prev, messageToHide]);
          setSelectedMessages((prev) => prev.filter((m) => m.userId !== id));
      }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['friend-list-container']}>
        <div className={styles['flex-between']}>
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#65686c' }}>
            Người liên hệ
          </span>
          <div>
            <SearchOutlined className={styles['icon']} />
            <MoreOutlined style={{ transform: 'rotate(90deg)' }} className={styles['icon']} />
          </div>
        </div>

        <Input
          placeholder="Tìm kiếm..."
          style={{ margin: '10px 0', borderRadius: '20px' }}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : friends.length === 0 ? (
          <Text type="secondary">Không có bạn bè nào</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={friends}
            renderItem={(friend) => (
              <List.Item
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                }}
                onClick={() => handleMessageClick(friend)}
              >
                <List.Item.Meta
                  avatar={<Avatar src={friend.avatar_url || 'https://via.placeholder.com/40'} />}
                  title={<Text strong>{friend.name}</Text>}
                  description={
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {friend.lastMessageTime || 'Không có tin nhắn mới'}
                    </Text>
                  }
                />
                {friend.unread && <Badge dot color="#1890ff" />}
              </List.Item>
            )}
          />
        )}
        {selectedMessages.map((message, index) => {
                const position = calculatePosition(index);
                return (
                    <ChatWindow
                        key={message.userId}
                        receiverId={message.userId}
                        message={message}
                        onClose={() => handleCloseChat(message.userId)}
                        onHide={() => handleHideChat(message.userId)}
                        position={position}
                    />
                );
            })}
      </div>
    </div>
  );
};

export default RightSidebar;
