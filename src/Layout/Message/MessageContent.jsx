import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Divider, Input, List, Typography, Space, Tooltip, Popover, Spin } from 'antd';
import { EllipsisOutlined, ExpandOutlined, EditOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import { getUserMessageListService } from '../../services/privateMessageService';

const { Text, Title } = Typography;

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const MessageContent = ({ onMessageClick, onClose }) => {
  const navigate = useNavigate();
  const userId = getUserIdFromLocalStorage();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const handleExpandClick = () => {
    navigate('/messages');
    if (typeof onClose === 'function') onClose();
  };

  const fetchUserMessageList = async () => {
    try {
      setLoading(true);
      const response = await getUserMessageListService(userId.toString());
      setList(response?.data?.conversations || []);
    } catch (error) {
      console.error("Error fetching List:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMessageList();
  }, []);

  const MessageItem = ({ conversation }) => {
    const otherUser = conversation.other_user;
    const lastMessage = conversation.last_message;

    const renderLastMessageContent = () => {
      if (!lastMessage) return '';
      if (lastMessage.type === 'image') {
        return (
          <span>
            <PictureOutlined style={{ marginRight: 4 }} />
            Ảnh
          </span>
        );
      }
      if (lastMessage.content) {
        return truncateText(lastMessage.content, 30);
      }
      return '';
    };

    return (
      <List.Item
        style={styles.messageItem}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
        onClick={() => {
          if (typeof onMessageClick === 'function') {
            onMessageClick({
              userId: otherUser.id,
              fullName: otherUser.name,
              profilePictureUrl: otherUser.avatar_url,
            });
          }
          if (typeof onClose === 'function') {
            onClose();
          }
        }}
      >
        <List.Item.Meta
          avatar={<Avatar src={otherUser.avatar_url} size="large" />}
          title={<Text strong>{truncateText(otherUser.name, 30)}</Text>}
          description={
            <Text type="secondary" style={styles.messageDescription}>
              {renderLastMessageContent()}
            </Text>
          }
        />
        {/* Nếu cần badge thông báo tin nhắn chưa đọc, có thể thêm logic */}
      </List.Item>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={4} style={styles.title}>Đoạn chat</Title>
        <Space>
          <Tooltip title="Tùy chọn">
            <Popover content={<SettingsMenu />} trigger="click" placement="bottomRight">
              <EllipsisOutlined style={styles.icon} />
            </Popover>
          </Tooltip>
          <Tooltip title="Mở rộng">
            <ExpandOutlined style={styles.icon} onClick={handleExpandClick} />
          </Tooltip>
          <Tooltip title="Tạo bài viết">
            <EditOutlined style={styles.icon} />
          </Tooltip>
        </Space>
      </div>
      <Input placeholder="Tìm kiếm trên Messenger" style={styles.searchInput} />
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
            renderItem={(conversation) => <MessageItem key={conversation.id} conversation={conversation} />}
          />
        )}
      </div>
      <Button type="text" onClick={handleExpandClick} style={styles.viewAllButton}>
        Xem tất cả trong Messenger
      </Button>
    </div>
  );
};

const styles = {
  container: { minWidth: '400px', padding: '0 8px' },
  header: { display: 'flex', justifyContent: 'space-between', padding: '10px' },
  content: { minHeight: '400px', padding: '8px' },
  title: { margin: 0, fontWeight: 'bold' },
  icon: { fontSize: '18px', color: 'gray', cursor: 'pointer' },
  searchInput: { borderRadius: '20px', marginBottom: '8px' },
  messageItem: { padding: '8px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', borderRadius: '10px' },
  messageDescription: { fontSize: '12px' },
  viewAllButton: { width: '100%', textAlign: 'center', color: '#1877f2' },
};

export default MessageContent;
