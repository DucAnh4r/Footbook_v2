/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Input, List, Tabs, Tooltip, Typography, Dropdown, Menu, Spin, Button } from 'antd';
import { EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import { FaCog, FaUserShield, FaQuestionCircle, FaDesktop, FaEnvelope, FaArchive, FaShieldAlt } from 'react-icons/fa';
import SettingsMessageModal from '../../Modal/SettingsMessageModal';
import RestrictedAccountsView from '../Homepage/LeftSidebar/RestrictedAccountsView';
import { getUserMessageListService, getUserGroupChatsService } from '../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import styles from './MessageLeftSidebar.module.scss';
import CreateGroupChatModal from '../../Modal/CreateGroupChatModal';
import CreateMessageModal from '../../Modal/CreateMessageModal';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const MessageLeftSidebar = ({ onSelectChat, refetchTrigger }) => {
  const [selectedChat, setSelectedChat] = useState(null); // thay vì chỉ selectedChatId
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGroupChatModalVisible, setIsGroupChatModalVisible] = useState(false);
  const [isCreateMessageModalVisible, setIsCreateMessageModalVisible] = useState(false);
  const [isRestrictedView, setIsRestrictedView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const userId = parseInt(getUserIdFromLocalStorage(), 10);

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const showGroupChatModal = () => setIsGroupChatModalVisible(true);
  const showCreateMessageModal = () => setIsCreateMessageModalVisible(true);
  const closeGroupChatModal = () => setIsGroupChatModalVisible(false);

  const openRestrictedView = () => {
    setIsModalVisible(false);
    setIsRestrictedView(true);
  };

  const goBackToMainView = () => {
    setIsRestrictedView(false);
  };

  const handleSelectChat = conversation => {
    setSelectedChat({ id: conversation.id, type: conversation.type });
    onSelectChat(conversation);
  };

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

      // Gộp và sắp xếp theo thời gian tin nhắn mới nhất
      const combined = [...directMessages, ...groupMessages].sort((a, b) => {
        const timeA = new Date(a.last_message?.created_at || a.created_at).getTime();
        const timeB = new Date(b.last_message?.created_at || b.created_at).getTime();
        return timeB - timeA;
      });

      setList(combined);
    } catch (error) {
      console.error('Error fetching combined messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupChats = async () => {
    try {
      setLoading(true);
      const response = await getUserGroupChatsService(userId.toString());
      let groups = (response?.data?.group_chats || []).map(group => ({
        ...group,
        type: 'group' // đánh dấu nhóm
      }));

      groups.sort((a, b) => {
        const timeA = new Date(a.last_message?.created_at || a.created_at).getTime();
        const timeB = new Date(b.last_message?.created_at || b.created_at).getTime();
        return timeB - timeA; // giảm dần (mới nhất trước)
      });

      setGroupChats(groups);
    } catch (error) {
      console.error('Error fetching group chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderLastMessageText = item => {
    const msg = item.last_message;
    if (!msg) return 'Chưa có tin nhắn';

    const isSelf = msg.sender_id === userId;
    const isText = msg.type === 'text';

    if (item.type === 'dm') {
      if (isSelf) {
        return isText ? `Bạn: ${msg.content}` : 'Bạn đã gửi một ảnh';
      } else {
        return isText ? `${item.other_user?.name}: ${msg.content}` : `${item.other_user?.name} đã gửi một ảnh`;
      }
    } else if (item.type === 'group') {
      if (isSelf) {
        return isText ? `Bạn: ${msg.content}` : 'Bạn đã gửi một ảnh';
      } else {
        return isText ? `${msg.sender?.name}: ${msg.content}` : `${msg.sender?.name} đã gửi một ảnh`;
      }
    }

    return '';
  };

  useEffect(() => {
    if (activeTab === '1') {
      fetchCombinedMessages();
    } else if (activeTab === '2') {
      fetchGroupChats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (refetchTrigger > 0) {
      if (activeTab === '1') {
        fetchCombinedMessages();
      } else if (activeTab === '2') {
        fetchGroupChats();
      }
    }
  }, [refetchTrigger]);

  const handleTabChange = key => {
    setActiveTab(key);
  };

  const handleGroupChatCreated = () => {
    fetchGroupChats();
    setActiveTab('2');
  };

  const handleMessageSent = (conversation) => {
    fetchCombinedMessages();
    setSelectedChat({ id: conversation.id, type: conversation.type });
    onSelectChat(conversation);
  };

  const menu = (
    <Menu style={{ padding: '20px 10px' }}>
      <Menu.Item key="1" onClick={showModal} icon={<FaCog />}>
        Tùy chọn
      </Menu.Item>
      <Menu.Item key="2" icon={<FaEnvelope />}>
        Tin nhắn đang chờ
      </Menu.Item>
      <Menu.Item key="3" icon={<FaArchive />}>
        Đoạn chat đã lưu trữ
      </Menu.Item>
      <Menu.Item key="4" onClick={openRestrictedView} icon={<FaUserShield />}>
        Tài khoản đã hạn chế
      </Menu.Item>
      <Menu.Item key="5" icon={<FaShieldAlt />}>
        Quyền riêng tư & an toàn
      </Menu.Item>
      <Menu.Item key="6" icon={<FaQuestionCircle />}>
        Trợ giúp
      </Menu.Item>
      <Menu.Item key="7" icon={<FaDesktop />}>
        Dùng thử Messenger dành cho máy tính
      </Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu style={{ padding: '20px 10px' }}>
      <Menu.Item key="1" icon={<FaCog />} onClick={showCreateMessageModal}>
        Viết tin nhắn
      </Menu.Item>
      <Menu.Item key="2" icon={<FaEnvelope />} onClick={showGroupChatModal}>
        Tạo nhóm chat
      </Menu.Item>
    </Menu>
  );

  if (isRestrictedView) {
    return <RestrictedAccountsView onBack={goBackToMainView} />;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Title level={5} className={styles.title}>
          Đoạn chat
        </Title>
        <div className={styles.headerIcons}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Tooltip title="Tùy chọn" placement="bottom">
              <EllipsisOutlined className={styles.icon} />
            </Tooltip>
          </Dropdown>
          <Dropdown overlay={menu2} trigger={['click']}>
            <Tooltip title="Tin nhắn mới" placement="bottom">
              <EditOutlined className={styles.icon} />
            </Tooltip>
          </Dropdown>
        </div>
      </div>

      <Input placeholder="Tìm kiếm trên Messenger" className={styles.searchInput} />

      <Tabs defaultActiveKey="1" className={styles.tabs} onChange={handleTabChange} activeKey={activeTab}>
        <TabPane tab="Hộp thư" key="1">
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
              renderItem={item => {
                const isGroup = item.type === 'group';
                const title = isGroup ? item.name : item.other_user?.name;
                const avatarSrc = isGroup ? item.avatar_url : item.other_user?.avatar_url;

                return (
                  <List.Item className={`${styles.messageItem} ${selectedChat?.id === item.id && selectedChat?.type === item.type ? styles.selected : ''}`} onClick={() => handleSelectChat(item)}>
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
                      title={<Text strong>{title}</Text>}
                      description={
                        <div className={styles.messageDescription}>
                          <Text type="secondary" ellipsis>
                            {renderLastMessageText(item)}
                          </Text>
                          <Text className={styles.timeText}>
                            {item.last_message?.created_at
                              ? new Date(item.last_message.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              : ''}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </TabPane>
        <TabPane tab="Nhóm chat" key="2">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
            </div>
          ) : groupChats.length === 0 ? (
            <div className={styles.emptyState}>
              <Text type="secondary">Bạn chưa có nhóm chat nào</Text>
              <Button type="primary" onClick={showGroupChatModal} style={{ marginTop: '10px' }}>
                Tạo nhóm chat
              </Button>
            </div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={groupChats}
              renderItem={group => (
                <List.Item
                  className={`${styles.messageItem} ${selectedChat?.id === group.id && selectedChat?.type === 'group' ? styles.selected : ''}`}
                  onClick={() =>
                    handleSelectChat({
                      id: group.id,
                      type: 'group',
                      ...group
                    })
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar src={group.avatar_url} size="large" />}
                    title={<Text strong>{group.name}</Text>}
                    description={
                      <div className={styles.messageDescription}>
                        <Text type="secondary" ellipsis>
                          {renderLastMessageText(group)}
                        </Text>
                        <Text className={styles.timeText}>
                          {group.last_message?.created_at
                            ? new Date(group.last_message.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : ''}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </TabPane>
      </Tabs>

      <SettingsMessageModal visible={isModalVisible} onClose={closeModal} />
      <CreateMessageModal visible={isCreateMessageModalVisible} onClose={() => setIsCreateMessageModalVisible(false)} onSuccess={handleMessageSent}/>
      <CreateGroupChatModal visible={isGroupChatModalVisible} onClose={closeGroupChatModal} onSuccess={handleGroupChatCreated} />
    </div>
  );
};

export default MessageLeftSidebar;
