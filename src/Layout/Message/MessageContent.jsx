import React, { useEffect, useState } from 'react';
import { Avatar, Badge, Button, Divider, Input, List, Typography, Space, Tooltip, Popover, Spin } from 'antd';
import { EllipsisOutlined, ExpandOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import SettingsMenu from './SettingsMenu';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import { getUserMessageListService } from '../../services/privateMessageService';

const { Text, Title } = Typography;

const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};

const MessageContent = ({ onMessageClick, onClose }) => {
  const navigate = useNavigate();
  const userId = getUserIdFromLocalStorage();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const handleExpandClick = () => {
    navigate('/messages');
    if (typeof onClose === 'function') {
      onClose(); // Đóng Popover nếu có
    }
  };


  const fetchUserMessageList = async () => {
    try {
      setLoading(true);
      const response = await getUserMessageListService(userId.toString()); // Truyền chuỗi trực tiếp
      setList(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching List:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchUserMessageList();
  }, []);

  const MessageItem = ({ userId, fullName, lastMessageTime, profilePictureUrl, unread }) => (
    <List.Item
      style={styles.messageItem}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
      onClick={() => {
        if (typeof onMessageClick === 'function') {
          onMessageClick({ userId, fullName, profilePictureUrl });
        }
        if (typeof onClose === 'function') {
          onClose(); // Đóng Popover khi chọn tin nhắn
        }
      }}
    >
      <List.Item.Meta
        avatar={<Avatar src={profilePictureUrl} size="large" />}
        title={<Text strong>{truncateText(fullName, 30)}</Text>} // Hiển thị tối đa 20 ký tự
        description={
          <Text type="secondary" style={styles.messageDescription}>
            Tin nhắn mới · {lastMessageTime}
          </Text>
        }
      />
      {unread && <Badge dot color="#1890ff" />}
    </List.Item>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Title level={4} style={styles.title}>Đoạn chat</Title>
        <Space>
          <Tooltip title="Tùy chọn">
            <Popover
              content={<SettingsMenu />}
              trigger="click"
              placement="bottomRight"
            >
              <EllipsisOutlined className={styles.icon} style={{ fontSize: '22px', color: 'gray' }} />
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
            renderItem={(item) => <MessageItem key={item.userId} {...item} />}
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
  container: { minWidth: '400px', padding: '0 8px', },
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
