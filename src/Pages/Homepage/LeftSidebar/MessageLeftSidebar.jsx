import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Input, List, Tabs, Tooltip, Typography, Dropdown, Menu, Spin, Button } from 'antd';
import { EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import { FaCog, FaUserShield, FaQuestionCircle, FaDesktop, FaEnvelope, FaArchive, FaShieldAlt } from 'react-icons/fa';
import SettingsMessageModal from '../../../Modal/SettingsMessageModal';
import CreateGroupChatModal from '../../../Modal/CreateGroupChatModal';
import RestrictedAccountsView from './RestrictedAccountsView';
import { getUserMessageListService, getUserGroupChatsService } from '../../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';
import styles from './MessageLeftSidebar.module.scss';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const MessageLeftSidebar = ({ onSelectChat, refetchTrigger }) => {
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGroupChatModalVisible, setIsGroupChatModalVisible] = useState(false);
  const [isRestrictedView, setIsRestrictedView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [activeTab, setActiveTab] = useState('1');
  const userId = getUserIdFromLocalStorage();

  const showModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const showGroupChatModal = () => setIsGroupChatModalVisible(true);
  const closeGroupChatModal = () => setIsGroupChatModalVisible(false);

  const openRestrictedView = () => {
    setIsModalVisible(false);
    setIsRestrictedView(true);
  };

  const goBackToMainView = () => {
    setIsRestrictedView(false);
  };

  const handleSelectChat = (conversation) => {
    setSelectedChatId(conversation.id);
    console.log("SELECTED CHAT: ", conversation);
    onSelectChat(conversation);
  };

  const fetchUserMessageList = async () => {
    try {
      setLoading(true);
      const response = await getUserMessageListService(userId.toString());
      const conversations = response?.data?.conversations || [];
      setList(conversations);

      if (conversations.length > 0 && !selectedChatId) {
        setSelectedChatId(conversations[0].id);
        onSelectChat(conversations[0]);
      }
    } catch (error) {
      console.error("Error fetching List:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupChats = async () => {
    try {
      setLoading(true);
      const response = await getUserGroupChatsService(userId.toString());
      const groups = response?.data?.group_chats || [];
      setGroupChats(groups);
    } catch (error) {
      console.error("Error fetching group chats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi component mount lần đầu
  useEffect(() => {
    if (activeTab === '1') {
      fetchUserMessageList();
    } else if (activeTab === '2') {
      fetchGroupChats();
    }
  }, [activeTab]);

  // Re-fetch khi refetchTrigger thay đổi
  useEffect(() => {
    if (refetchTrigger > 0) {
      if (activeTab === '1') {
        fetchUserMessageList();
      } else if (activeTab === '2') {
        fetchGroupChats();
      }
    }
  }, [refetchTrigger]);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleGroupChatCreated = () => {
    // Refresh danh sách nhóm chat khi tạo mới thành công
    fetchGroupChats();
    // Chuyển sang tab nhóm chat
    setActiveTab('2');
  };

  const renderLastMessage = (lastMessage) => {
    if (!lastMessage) return '';
    if (lastMessage.type === 'image') return 'Đã gửi một hình ảnh';
    return lastMessage.content || '';
  };

  const menu = (
    <Menu style={{ padding: '20px 10px' }}>
      <Menu.Item key="1" onClick={showModal} icon={<FaCog />}>Tùy chọn</Menu.Item>
      <Menu.Item key="2" icon={<FaEnvelope />}>Tin nhắn đang chờ</Menu.Item>
      <Menu.Item key="3" icon={<FaArchive />}>Đoạn chat đã lưu trữ</Menu.Item>
      <Menu.Item key="4" onClick={openRestrictedView} icon={<FaUserShield />}>Tài khoản đã hạn chế</Menu.Item>
      <Menu.Item key="5" icon={<FaShieldAlt />}>Quyền riêng tư & an toàn</Menu.Item>
      <Menu.Item key="6" icon={<FaQuestionCircle />}>Trợ giúp</Menu.Item>
      <Menu.Item key="7" icon={<FaDesktop />}>Dùng thử Messenger dành cho máy tính</Menu.Item>
    </Menu>
  );

  if (isRestrictedView) {
    return <RestrictedAccountsView onBack={goBackToMainView} />;
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <Title level={5} className={styles.title}>Đoạn chat</Title>
        <div className={styles.headerIcons}>
          <Dropdown overlay={menu} trigger={['click']}>
            <Tooltip title="Tùy chọn">
              <EllipsisOutlined className={styles.icon} />
            </Tooltip>
          </Dropdown>
          <Tooltip title="Tạo nhóm chat">
            <EditOutlined className={styles.icon} onClick={showGroupChatModal} />
          </Tooltip>
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
              renderItem={(conversation) => (
                <List.Item
                  className={`${styles.messageItem} ${conversation.id === selectedChatId ? styles.selected : ''}`}
                  onClick={() => handleSelectChat(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={conversation.other_user.status === 'available'} color="green" offset={[-2, 30]}>
                        <Avatar src={conversation.other_user.avatar_url} size="large" />
                      </Badge>
                    }
                    title={<Text strong>{conversation.other_user.name}</Text>}
                    description={
                      <div className={styles.messageDescription}>
                        <Text type="secondary" ellipsis>
                          {renderLastMessage(conversation.last_message)}
                        </Text>
                        <Text className={styles.timeText}>
                          {conversation.last_message?.created_at ? new Date(conversation.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
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
              renderItem={(group) => (
                <List.Item
                  className={`${styles.messageItem} ${group.id === selectedChatId ? styles.selected : ''}`}
                  onClick={() => handleSelectChat({
                    id: group.id,
                    type: 'group',
                    ...group
                  })}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={group.avatar_url} size="large" />}
                    title={<Text strong>{group.name}</Text>}
                    description={
                      <div className={styles.messageDescription}>
                        <Text type="secondary" ellipsis>
                          {renderLastMessage(group.last_message)}
                        </Text>
                        <Text className={styles.timeText}>
                          {group.last_message?.created_at ? new Date(group.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
      <CreateGroupChatModal 
        visible={isGroupChatModalVisible} 
        onClose={closeGroupChatModal} 
        onSuccess={handleGroupChatCreated}
      />
    </div>
  );
};

export default MessageLeftSidebar;