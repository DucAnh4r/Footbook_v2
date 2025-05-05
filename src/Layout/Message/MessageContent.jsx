import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Input, List, Typography, Space, Tooltip, Popover, Spin } from 'antd';
import { EllipsisOutlined, ExpandOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import { getUserMessageListService, getUserGroupChatsService } from '../../services/privateMessageService';
import styles from './MessageContent.module.scss';

const { Text, Title } = Typography;

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const MessageContent = ({ onMessageClick, onClose }) => {
  const navigate = useNavigate();
  const userId = parseInt(getUserIdFromLocalStorage(), 10);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const handleExpandClick = () => {
    navigate('/messages');
    if (typeof onClose === 'function') onClose();
  };

  const fetchCombinedMessages = async () => {
    try {
      setLoading(true);

      const [dmRes, groupRes] = await Promise.all([
        getUserMessageListService(userId.toString()), 
        getUserGroupChatsService(userId.toString())
      ]);

      const directMessages = (dmRes?.data?.conversations || []).map(conversation => ({
        ...conversation,
        type: 'dm' // đánh dấu tin nhắn cá nhân
      }));

      const groupMessages = (groupRes?.data?.group_chats || []).map(group => ({
        ...group,
        type: 'group' // đánh dấu nhóm
      }));

      // Gộp và sắp xếp theo thời gian tin nhắn mới nhất
      const combined = [...directMessages, ...groupMessages].sort((a, b) => {
        const timeA = new Date(a.last_message?.created_at ||  a.created_at).getTime();
        const timeB = new Date(b.last_message?.created_at ||  b.created_at).getTime();
        return timeB - timeA;
      });

      setList(combined);
    } catch (error) {
      console.error("Error fetching combined messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombinedMessages();
  }, []);

  const renderLastMessageContent = (item) => {
    const msg = item.last_message;
    if (!msg) return 'Chưa có tin nhắn';

    const isSelf = msg.sender_id === userId;
    const isText = msg.type === 'text';

    if (item.type === 'dm') {
      if (isSelf) {
        return isText ? `Bạn: ${truncateText(msg.content, 30)}` : 'Bạn đã gửi một ảnh';
      } else {
        return isText ? `${truncateText(msg.content, 30)}` : 'Đã gửi một ảnh';
      }
    } else if (item.type === 'group') {
      if (isSelf) {
        return isText ? `Bạn: ${truncateText(msg.content, 30)}` : 'Bạn đã gửi một ảnh';
      } else {
        return isText ? `${msg.sender?.name}: ${truncateText(msg.content, 30)}` : `${msg.sender?.name} đã gửi một ảnh`;
      }
    }

    return '';
  };

  const MessageItem = ({ item }) => {
    const isGroup = item.type === 'group';
    const avatarSrc = isGroup ? item.avatar_url : item.other_user?.avatar_url;
    const title = isGroup ? item.name : item.other_user?.name;
    const lastMessageTime = item.last_message?.created_at 
      ? new Date(item.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

    return (
      <List.Item
        className={styles.messageItem}
        onClick={() => {
          if (typeof onMessageClick === 'function') {
            if (isGroup) {
              onMessageClick({
                id: item.id,
                type: 'group',
                name: item.name,
                profilePictureUrl: item.avatar_url,
                ...item
              });
            } else {
              onMessageClick({
                userId: item.other_user.id,
                fullName: item.other_user.name,
                profilePictureUrl: item.other_user.avatar_url,
                type: 'dm',
                ...item
              });
            }
          }
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
      >
        <List.Item.Meta
          avatar={
            isGroup ? (
              <Avatar src={avatarSrc} size="large" />
            ) : (
              <Badge dot={item.other_user?.status === 'available'} color="green" offset={[-2, 30]}>
                <Avatar src={avatarSrc} size="large" />
              </Badge>
            )
          }
          title={<Text strong>{truncateText(title, 30)}</Text>}
          description={
            <div className={styles.messageDescription}>
              <Text type="secondary" ellipsis>
                {renderLastMessageContent(item)}
              </Text>
              <Text className={styles.timeText}>
                {lastMessageTime}
              </Text>
            </div>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>Đoạn chat</Title>
        <Space>
          <Tooltip title="Tùy chọn">
            <Popover content={<SettingsMenu />} trigger="click" placement="bottomRight">
              <EllipsisOutlined className={styles.icon} />
            </Popover>
          </Tooltip>
          <Tooltip title="Mở rộng">
            <ExpandOutlined className={styles.icon} onClick={handleExpandClick} />
          </Tooltip>
          <Tooltip title="Tạo bài viết">
            <EditOutlined className={styles.icon} />
          </Tooltip>
        </Space>
      </div>
      <Input placeholder="Tìm kiếm trên Messenger" className={styles.searchInput} />
      <div className={styles.content}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : list.length === 0 ? (
          <Text type="secondary">Không có tin nhắn nào</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={list}
            renderItem={(item) => <MessageItem key={item.id} item={item} />}
          />
        )}
      </div>
      <Button type="text" onClick={handleExpandClick} className={styles.viewAllButton}>
        Xem tất cả trong Messenger
      </Button>
    </div>
  );
};



export default MessageContent;