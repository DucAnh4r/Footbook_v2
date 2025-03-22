import React, { useState, useEffect } from 'react';
import { Avatar, Badge, Button, Input, List, Tabs, Tooltip, Typography, Dropdown, Menu, Spin } from 'antd';
import { EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import { FaCog, FaUserShield, FaQuestionCircle, FaDesktop, FaEnvelope, FaArchive, FaShieldAlt } from 'react-icons/fa';
import SettingsMessageModal from '../../../Modal/SettingsMessageModal';
import RestrictedAccountsView from './RestrictedAccountsView';
import { getUserMessageListService } from '../../../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

const MessageLeftSidebar = ({ onSelectChat }) => {
  const [selectedChatId, setSelectedChatId] = useState(null); // ID của đoạn chat được chọn
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRestrictedView, setIsRestrictedView] = useState(false);
  const userId = getUserIdFromLocalStorage();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const openRestrictedView = () => {
    setIsModalVisible(false);
    setIsRestrictedView(true);
  };

  const goBackToMainView = () => {
    setIsRestrictedView(false);
  };

  const handleSelectChat = (msg) => {
    setSelectedChatId(msg.userId);
    onSelectChat(msg);
  };

  const fetchUserMessageList = async () => {
    try {
      setLoading(true);
      const response = await getUserMessageListService(userId.toString());
      const data = response?.data?.data || [];
      setList(data);

      // Đặt đoạn chat đầu tiên làm mặc định nếu chưa chọn
      if (data.length > 0 && !selectedChatId) {
        setSelectedChatId(data[0].userId);
        onSelectChat(data[0]);
      }
    } catch (error) {
      console.error("Error fetching List:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMessageList();
  }, []);

  // Dropdown menu options
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

  return (
    !isRestrictedView ? (
      <div style={styles.sidebar}>
        <div style={styles.header}>
          <Title level={5} style={styles.title}>Đoạn chat</Title>
          <div style={styles.headerIcons}>
            <Dropdown overlay={menu} trigger={['click']}>
              <Tooltip title="Tùy chọn">
                <EllipsisOutlined style={styles.icon} />
              </Tooltip>
            </Dropdown>
            <Tooltip title="Chỉnh sửa">
              <EditOutlined style={styles.icon} />
            </Tooltip>
          </div>
        </div>

        <Input placeholder="Tìm kiếm trên Messenger" style={styles.searchInput} />

        <Tabs defaultActiveKey="1" style={styles.tabs}>
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
                renderItem={(msg) => (
                  <List.Item
                    style={{
                      ...styles.messageItem,
                      ...(msg.userId === selectedChatId && styles.selected),
                    }}
                    onClick={() => handleSelectChat(msg)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge dot={msg.online} color="green" offset={[-2, 30]}>
                          <Avatar src={msg.profilePictureUrl} size="large" />
                        </Badge>
                      }
                      title={<Text strong>{msg.fullName}</Text>}
                      description={
                        <div style={styles.messageDescription}>
                          <Text type="secondary" ellipsis>{msg.lastMessage}</Text>
                          <Text style={styles.timeText}>{msg.lastMessageTime}</Text>
                        </div>
                      }
                    />
                    {msg.unread && <Badge dot color="#1890ff" />}
                  </List.Item>
                )}
              />
            )}
          </TabPane>
          <TabPane tab="Cộng đồng" key="2">
            {/* Content for "Cộng đồng" */}
          </TabPane>
        </Tabs>

        <SettingsMessageModal visible={isModalVisible} onClose={closeModal} />
      </div>
    ) : (
      <RestrictedAccountsView onBack={goBackToMainView} />
    )
  );
};

const styles = {
  sidebar: {
    width: '360px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    padding: '16px',
    maxHeight: '93vh',
    overflowY: 'auto',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
  },
  headerIcons: {
    display: 'flex',
    gap: '8px',
  },
  icon: {
    fontSize: '20px',
    color: 'gray',
    cursor: 'pointer',
  },
  searchInput: {
    borderRadius: '20px',
    marginBottom: '16px',
  },
  tabs: {
    marginBottom: '16px',
  },
  messageItem: {
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
  },
  selected: {
    backgroundColor: '#d6e4ff',
    borderRadius: '8px',
  },
  messageDescription: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: '12px',
    color: 'gray',
    marginLeft: '10px',
  },
};

export default MessageLeftSidebar;
