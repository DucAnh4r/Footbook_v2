/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Avatar, Badge, List, Typography, Spin, Input } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import styles from './RightSidebar.module.scss';
import { getUserMessageListService, getUserGroupChatsService } from '../../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';
import { useChat } from '../../../utils/ChatContext'; // Import useChat hook

const { Text } = Typography;

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

const RightSidebar = () => {
  const [loading, setLoading] = useState(true);
  const [directMessages, setDirectMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [filteredDirectMessages, setFilteredDirectMessages] = useState([]);
  const [filteredGroupMessages, setFilteredGroupMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userId = parseInt(getUserIdFromLocalStorage(), 10);

  // Sử dụng ChatContext thay vì state nội bộ
  const { addChat } = useChat();

  const fetchCombinedMessages = async () => {
    try {
      setLoading(true);

      const [dmRes, groupRes] = await Promise.all([getUserMessageListService(userId.toString()), getUserGroupChatsService(userId.toString())]);

      const directMessages = (dmRes?.data?.conversations || []).map(conversation => ({
        ...conversation,
        type: 'dm' // đánh dấu tin nhắn cá nhân
      }));

      const groupMessages = (groupRes?.data?.group_chats || []).map(group => ({
        ...group,
        type: 'group' // đánh dấu nhóm
      }));

      // Sắp xếp theo thời gian tin nhắn mới nhất
      const sortedDirectMessages = directMessages.sort((a, b) => {
        const timeA = new Date(a.last_message?.created_at || a.created_at).getTime();
        const timeB = new Date(b.last_message?.created_at || b.created_at).getTime();
        return timeB - timeA;
      });

      const sortedGroupMessages = groupMessages.sort((a, b) => {
        const timeA = new Date(a.last_message?.created_at || a.created_at).getTime();
        const timeB = new Date(b.last_message?.created_at || b.created_at).getTime();
        return timeB - timeA;
      });

      setDirectMessages(sortedDirectMessages);
      setFilteredDirectMessages(sortedDirectMessages);
      setGroupMessages(sortedGroupMessages);
      setFilteredGroupMessages(sortedGroupMessages);
    } catch (error) {
      console.error('Error fetching combined messages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = e => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      setFilteredDirectMessages(directMessages);
      setFilteredGroupMessages(groupMessages);
      return;
    }

    // Lọc tin nhắn cá nhân
    const filteredDMs = directMessages.filter(item => {
      const name = item.other_user?.name?.toLowerCase();
      return name && name.includes(query);
    });

    // Lọc nhóm chat
    const filteredGroups = groupMessages.filter(item => {
      const name = item.name?.toLowerCase();
      return name && name.includes(query);
    });

    setFilteredDirectMessages(filteredDMs);
    setFilteredGroupMessages(filteredGroups);
  };

  useEffect(() => {
    fetchCombinedMessages();
  }, []);

  // Chỉ trả về trạng thái online thay vì nội dung tin nhắn
  const getUserStatus = item => {
    if (item.type === 'dm') {
      return item.other_user?.status === 'available' ? 'Đang hoạt động' : 'Ngoại tuyến';
    } else {
      return '';
    }
  };

  const handleMessageClick = item => {
    const isGroup = item.type === 'group';

    // Cấu trúc dữ liệu chuẩn cho cả hai loại chat
    const chatData = isGroup
      ? {
          userId: `group-${item.id}`, // Tạo định danh duy nhất cho nhóm
          name: item.name,
          profilePictureUrl: item.avatar_url,
          message: item.last_message?.content || 'Nhóm chat',
          type: 'group',
          groupId: item.id,
          id: item.id,
          status: 'available' // Để duy trì nhất quán
        }
      : {
          userId: item.other_user.id,
          name: item.other_user.name,
          profilePictureUrl: item.other_user.avatar_url,
          message: item.last_message?.content || 'Tin nhắn',
          type: 'dm',
          conversationId: item.id,
          status: item.other_user?.status || 'offline'
        };

    // Sử dụng addChat từ ChatContext để thêm chat
    addChat(chatData);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['friend-list-container']}>
        <div className={styles['flex-between']}>
          <span style={{ fontSize: '16px', fontWeight: 500, color: '#65686c' }}>Người liên hệ</span>
          <div>
            <SearchOutlined className={styles['icon']} />
            <MoreOutlined style={{ transform: 'rotate(90deg)' }} className={styles['icon']} />
          </div>
        </div>

        <Input placeholder="Tìm kiếm..." style={{ margin: '10px 0', borderRadius: '20px' }} value={searchQuery} onChange={handleSearch} />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Phần Người liên hệ */}
            {filteredDirectMessages.length > 0 && (
              <>
                <List
                  itemLayout="horizontal"
                  dataSource={filteredDirectMessages}
                  renderItem={item => {
                    const avatarSrc = item.other_user?.avatar_url;
                    const title = item.other_user?.name;

                    return (
                      <List.Item
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleMessageClick(item)}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge dot={item.other_user?.status === 'available'} color="green" offset={[-2, 30]}>
                              <Avatar src={avatarSrc || 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/40'} />
                            </Badge>
                          }
                          title={<Text strong>{truncateText(title, 30)}</Text>}
                          description={
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              {getUserStatus(item)}
                            </Text>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </>
            )}

            {/* Label Nhóm chat và danh sách nhóm */}
            {filteredGroupMessages.length > 0 && (
              <>
                <div className={styles['flex-between']} style={{ marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #e6e6e6' }}>
                  <span style={{ fontSize: '16px', fontWeight: 500, color: '#65686c' }}>Nhóm chat</span>
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={filteredGroupMessages}
                  renderItem={item => {
                    const avatarSrc = item.avatar_url;
                    const title = item.name;

                    return (
                      <List.Item
                        style={{
                          padding: '8px',
                          borderBottom: '1px solid #f0f0f0',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleMessageClick(item)}
                      >
                        <List.Item.Meta avatar={<Avatar src={avatarSrc || 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/40'} />} title={<Text strong>{truncateText(title, 30)}</Text>} />
                      </List.Item>
                    );
                  }}
                />
              </>
            )}

            {/* Hiển thị thông báo khi không có kết quả */}
            {filteredDirectMessages.length === 0 && filteredGroupMessages.length === 0 && <Text type="secondary">Không có kết quả</Text>}
          </>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
