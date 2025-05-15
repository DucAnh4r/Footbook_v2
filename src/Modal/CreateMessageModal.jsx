/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal, Input, Button, Avatar, message, Spin, List, Typography, Space, Badge, Upload, Tooltip } from 'antd';
import { UserOutlined, SendOutlined, UploadOutlined, CloseCircleOutlined, SearchOutlined, PhoneOutlined, VideoCameraOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { userSearchService, userListFriendService } from '../services/userService';
import { getUserById, getUserIdFromLocalStorage } from '../utils/authUtils';
import { debounce } from 'lodash';
import { getConversationBetweenUsers, getMessageHistoryService, sendPrivateMessageService } from '../services/privateMessageService';
import styles from './CreateMessageModal.module.scss';

const { Text } = Typography;

const CreateMessageModal = ({ visible, onClose, onSuccess }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatBodyRef = useRef(null);

  const currentUserId = parseInt(getUserIdFromLocalStorage(), 10);
  const [currentUser, setCurrentUser] = useState(null);

  // Load friends when modal opens
  useEffect(() => {
    if (visible) {
      fetchFriends();
      setSelectedUser(null);
      setMessages([]);
      setMessageText('');
      setSearchText('');
      setSearchResults([]);
      setConversationId(null);
      getUserById(currentUserId).then(user => {
        if (user) {
          setCurrentUser(user);
        }
      });
    }
  }, [visible]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatBodyRef.current) {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }
    }, 100); // delay nhẹ để đảm bảo DOM đã vẽ xong

    return () => clearTimeout(timeout);
  }, [messages]);

  // Fetch friends list
  const fetchFriends = async () => {
    try {
      setLoadingFriends(true);
      const response = await userListFriendService(currentUserId);
      if (response && response.data) {
        const friendList = response.data.friends.map(friend => ({
          id: friend.id || friend.user_id,
          name: friend.fullName || friend.name,
          avatar_url: friend.avatar_url || friend.profile_picture,
          status: friend.status || 'offline'
        }));
        setFriends(friendList);
        setSearchResults(friendList);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      message.error('Không thể tải danh sách bạn bè');
    } finally {
      setLoadingFriends(false);
    }
  };

  // Search friends with debounce - tìm kiếm trong danh sách bạn bè
  const performSearch = value => {
    if (!value.trim()) {
      setSearchResults(friends);
      return;
    }

    setSearching(true);
    try {
      // Lọc từ danh sách bạn bè thay vì gọi API search
      const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(value.toLowerCase()));
      setSearchResults(filteredFriends);
    } catch (error) {
      console.error('Error searching friends:', error);
      message.error('Không thể tìm kiếm bạn bè');
    } finally {
      setSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce(value => {
      performSearch(value);
    }, 500),
    [friends]
  );

  const handleSearch = e => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  // Select a user to message
  const handleSelectUser = async user => {
    setSelectedUser(user);
    setConversationId(null); // Reset conversation ID
    await fetchMessages(user.id);
  };

  // Fetch message history with selected user
  const fetchMessages = async userId => {
    setLoadingMessages(true);
    try {
      const response = await getConversationBetweenUsers(userId, currentUserId);

      if (response?.data?.conversation) {
        setConversationId(response.data.conversation.id);
        setMessages(response.data.messages || []);
      } else {
        // No conversation exists yet
        setConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      message.error('Không thể tải lịch sử tin nhắn');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send new message
  const handleSendMessage = async (type = 'text', content = messageText) => {
    if (!content.trim() && type === 'text') return;
    if (!selectedUser) return;

    try {
      setSending(true);

      const payload = {
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        type: type,
        content: content
      };

      await sendPrivateMessageService(payload);

      // Clear input and refresh messages
      setMessageText('');
      await fetchMessages(selectedUser.id);

      // If this was first message, we should now have a conversation ID
      if (!conversationId) {
        // Fetch updated conversation info
        const newResponse = await getMessageHistoryService(null, {
          user1_id: currentUserId,
          user2_id: selectedUser.id
        });

        if (newResponse?.data?.conversation) {
          const conversation = newResponse.data.conversation;
          setConversationId(conversation.id);

          // Notify parent component for success with full conversation object
          if (typeof onSuccess === 'function') {
            onSuccess(conversation);
          }

          // Close modal if this is a new conversation
          onClose();
        }
      } else {
        // Fetch the updated conversation to get latest message
        const updatedResponse = await getMessageHistoryService(conversationId);
        if (updatedResponse?.data?.conversation) {
          if (typeof onSuccess === 'function') {
            onSuccess(updatedResponse.data.conversation);
          }
          onClose();
        } else {
          // Fallback if can't fetch updated conversation
          if (typeof onSuccess === 'function') {
            onSuccess({ id: conversationId, type: 'dm', other_user: selectedUser });
          }
          onClose();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Không thể gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  // Handle image upload
  // Handle image upload
  const handleUpload = async file => {
    try {
      setSending(true);

      const payload = {
        sender_id: currentUserId,
        receiver_id: selectedUser.id,
        type: 'image',
        image_file: file,
        onUploadProgress: progressEvent => {
          // Could show upload progress if desired
        }
      };

      await sendPrivateMessageService(payload);
      await fetchMessages(selectedUser.id);

      // If this was first message, refresh to get conversation ID
      if (!conversationId) {
        const newResponse = await getMessageHistoryService(null, {
          user1_id: currentUserId,
          user2_id: selectedUser.id
        });

        if (newResponse?.data?.conversation) {
          const conversation = newResponse.data.conversation;
          setConversationId(conversation.id);

          // Notify parent component for success with full conversation object
          if (typeof onSuccess === 'function') {
            onSuccess(conversation);
          }

          // Close modal if this is a new conversation
          onClose();
        }
      } else {
        // Fetch the updated conversation to get latest message
        const updatedResponse = await getMessageHistoryService(conversationId);
        if (updatedResponse?.data?.conversation) {
          if (typeof onSuccess === 'function') {
            onSuccess(updatedResponse.data.conversation);
          }
          onClose();
        } else {
          // Fallback if can't fetch updated conversation
          if (typeof onSuccess === 'function') {
            onSuccess({ id: conversationId, type: 'dm', other_user: selectedUser });
          }
          onClose();
        }
      }
    } catch (error) {
      console.error('Error sending image message:', error);
      message.error('Không thể gửi hình ảnh');
    } finally {
      setSending(false);
    }

    return false; // Prevent default upload behavior
  };

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const isSameUser = msgSenderId => {
    return Number(msgSenderId) === Number(currentUserId);
  };

  return (
    <Modal title={null} open={visible} onCancel={onClose} footer={null} width={700} bodyStyle={{ padding: 0, height: '70vh', display: 'flex', flexDirection: 'column' }} closable={false}>
      <div className={styles.modalContent}>
        {!selectedUser ? (
          // User selection view
          <div className={styles.userSelectionContainer}>
            <div className={styles.searchHeader}>
              <Button type="text" icon={<CloseCircleOutlined />} onClick={onClose} />
              <Text strong>Tin nhắn mới</Text>
              <div style={{ width: '28px' }}></div> {/* Để cân đối với nút bên trái */}
            </div>
            <div className={styles.searchContainer}>
              <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm bạn bè..." value={searchText} onChange={handleSearch} className={styles.searchInput} />
            </div>

            <div className={styles.userList}>
              {loadingFriends || searching ? (
                <div className={styles.centerSpin}>
                  <Spin />
                </div>
              ) : searchResults.length === 0 ? (
                <div className={styles.noResults}>
                  <Text type="secondary">Không tìm thấy kết quả</Text>
                </div>
              ) : (
                <List
                  dataSource={searchResults}
                  renderItem={user => (
                    <List.Item className={styles.userItem} onClick={() => handleSelectUser(user)}>
                      <List.Item.Meta
                        avatar={
                          <Badge dot={user.status === 'available'} color="green" offset={[-2, 30]}>
                            <Avatar src={user?.avatar_url} icon={!user.avatar_url && <UserOutlined />} />
                          </Badge>
                        }
                        title={user.name}
                      />
                    </List.Item>
                  )}
                />
              )}
            </div>
          </div>
        ) : (
          // Chat view with selected user - Styled similar to Messagepage
          <div className={styles.chatContainer}>
            <div className={styles.header}>
              <Space>
                <Button type="text" icon={<CloseCircleOutlined />} onClick={() => setSelectedUser(null)} />
                <Badge dot={selectedUser.status === 'available'} color="green" offset={[-2, 30]}>
                  <Avatar src={selectedUser.avatar_url} icon={!selectedUser.avatar_url && <UserOutlined />} />
                </Badge>
                <Text strong>{selectedUser.name}</Text>
              </Space>
            </div>

            <div className={styles.chatBody} ref={chatBodyRef}>
              {loadingMessages ? (
                <div className={styles.centerText}>
                  <Spin />
                </div>
              ) : messages.length === 0 ? (
                <div className={styles.centerText}>
                  <Text type="secondary">Bạn chưa có tin nhắn nào với người dùng này.</Text>
                  <Text type="secondary">Hãy gửi tin nhắn đầu tiên!</Text>
                </div>
              ) : (
                messages.map(msg => {
                  const isMyMessage = isSameUser(msg.sender_id);

                  return (
                    <div key={msg.id} className={`${styles.chatMessage} ${isMyMessage ? styles.sender : styles.receiver}`}>
                      {isMyMessage ? (
                        <>
                          <div className={styles.messageContent}>
                            {msg.type === 'text' && <span>{msg.content}</span>}
                            {msg.type === 'image' && msg.image && <img src={msg.image.image_url} alt="sent-img" className={styles.sentImage} />}
                          </div>
                          <Avatar src={currentUser.avatar_url} size="small" className={styles.messageAvatar} />
                        </>
                      ) : (
                        <>
                          <Avatar src={selectedUser.avatar_url} size="small" className={styles.messageAvatar} />
                          <div className={styles.messageContent}>
                            {msg.type === 'text' && <span>{msg.content}</span>}
                            {msg.type === 'image' && msg.image && <img src={msg.image.image_url} alt="sent-img" className={styles.sentImage} />}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className={styles.footer}>
              <Input className={styles.input} placeholder="Aa" value={messageText} onChange={e => setMessageText(e.target.value)} onPressEnter={() => handleSendMessage('text', messageText)} disabled={sending} />
              <Space>
                <Upload showUploadList={false} beforeUpload={handleUpload}>
                  <Tooltip title="Gửi hình ảnh">
                    <Button icon={<UploadOutlined />} type="text" disabled={sending} />
                  </Tooltip>
                </Upload>
                <Tooltip title="Gửi">
                  <Button icon={<SendOutlined />} type="text" onClick={() => handleSendMessage('text', messageText)} disabled={!messageText.trim() || sending} />
                </Tooltip>
              </Space>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateMessageModal;
