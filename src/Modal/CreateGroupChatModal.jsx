/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Button, Avatar, message, Upload, Select, Tag, Spin } from 'antd';
import { UserOutlined, CameraOutlined, PictureOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { createGroupChatService } from '../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../utils/authUtils';
import { userSearchService, userListFriendService } from '../services/userService';
import styles from './CreateGroupChatModal.module.scss';
import { debounce } from 'lodash';

const { Option } = Select;

const CreateGroupChatModal = ({ visible, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [allAvailableUsers, setAllAvailableUsers] = useState([]);
  const currentUserId = parseInt(getUserIdFromLocalStorage(), 10);

  useEffect(() => {
    if (visible) {
      fetchFriends();
      setSearchResults([]);
      setAllAvailableUsers([]);
      setSelectedMembers([]);
    }
  }, [visible]);

  useEffect(() => {
    if (friends.length > 0) {
      showAvailableFriends();
    }
  }, [friends]);

  const fetchFriends = async () => {
    try {
      setLoadingFriends(true);
      const response = await userListFriendService(currentUserId);
      if (response && response.data) {
        const friendList = response.data.friends.map(friend => ({
          id: friend.id || friend.user_id,
          name: friend.fullName || friend.name,
          avatar_url: friend.avatar_url || friend.profile_picture
        }));
        setFriends(friendList);
        setAllAvailableUsers(friendList);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const showAvailableFriends = () => {
    const availableFriends = friends.filter(friend => !selectedMembers.some(member => member.id === friend.id));
    setSearchResults(availableFriends);
  };

  // Tạo hàm search với debounce
  const performSearch = async (value) => {
    if (!value) {
      showAvailableFriends();
      return;
    }

    setSearching(true);
    try {
      const response = await userSearchService({ keyword: value });

      const users = response.data.results || [];
      const newSearchResults = users
        .filter(user => user.id !== currentUserId)
        .map(user => ({
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url
        }));

      const updatedAllUsers = [...allAvailableUsers];

      newSearchResults.forEach(newUser => {
        if (!updatedAllUsers.some(existingUser => existingUser.id === newUser.id)) {
          updatedAllUsers.push(newUser);
        }
      });

      setAllAvailableUsers(updatedAllUsers);

      const filteredResults = newSearchResults.filter(user => !selectedMembers.some(member => member.id === user.id));

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Error searching users:', error);
      message.error('Không thể tìm kiếm người dùng');
    } finally {
      setSearching(false);
    }
  };

  // Sử dụng useCallback và debounce để tạo hàm debouncedSearch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((value) => {
      performSearch(value);
    }, 1500),
    [selectedMembers, allAvailableUsers]
  );

  // Thay thế handleSearch cũ bằng hàm này
  const handleSearch = (value) => {
    if (!value) {
      showAvailableFriends();
      return;
    }
    debouncedSearch(value);
  };

  const handleSelectMember = selectedOptions => {
    const newSelectedMembers = selectedOptions
      .map(option => {
        const found = allAvailableUsers.find(user => user.id === option.value);
        return found
          ? {
              id: found.id,
              name: found.name,
              avatar_url: found.avatar_url
            }
          : null;
      })
      .filter(Boolean);

    setSelectedMembers(newSelectedMembers);

    const selectedIds = newSelectedMembers.map(member => member.id);
    const availableUsers = allAvailableUsers.filter(user => !selectedIds.includes(user.id));
    setSearchResults(availableUsers);
  };

  const handleRemoveMember = memberId => {
    setSelectedMembers(prev => prev.filter(member => member.id !== memberId));

    const removedUser = allAvailableUsers.find(user => user.id === memberId);
    if (removedUser) {
      setSearchResults(prev => {
        if (!prev.some(user => user.id === memberId)) {
          return [...prev, removedUser];
        }
        return prev;
      });
    }
  };

  const handleAvatarChange = info => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setUploading(true);
      setAvatarFile(file);

      // Đảm bảo preview hoạt động bằng cách sử dụng FileReader
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setUploading(false);
        console.log('Preview đã được tạo:', reader.result.substring(0, 50) + '...');
      };
      reader.onerror = error => {
        console.error('Lỗi khi đọc file:', error);
        setUploading(false);
        message.error('Không thể xem trước ảnh');
      };
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const generateDefaultGroupName = () => {
    if (selectedMembers.length === 0) return '';
    return selectedMembers.map(member => member.name).join(', ');
  };

  const handleCreateGroup = async () => {
    if (selectedMembers.length < 1) {
      message.error('Vui lòng chọn ít nhất 2 thành viên để tạo nhóm chat');
      return;
    }

    const finalGroupName = groupName.trim() || generateDefaultGroupName();

    try {
      // Get member IDs
      const memberIds = selectedMembers.map(member => member.id);

      // Create data object (not FormData) as expected by the service
      const groupChatData = {
        name: finalGroupName,
        creator_id: currentUserId,
        members: [currentUserId, ...memberIds]
      };

      // Add avatar file if available
      if (avatarFile) {
        groupChatData.avatar_file = avatarFile;
        groupChatData.onUploadProgress = progressEvent => {
          console.log('Upload progress:', Math.round((progressEvent.loaded * 100) / progressEvent.total));
        };
      }

      // Call the service with the correct data format
      await createGroupChatService(groupChatData);

      message.success('Tạo nhóm chat thành công');
      onSuccess && onSuccess();
      handleCancel();
    } catch (error) {
      console.error('Error creating group chat:', error);
      message.error('Không thể tạo nhóm chat: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    setGroupName('');
    setSelectedMembers([]);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSearchResults([]);
    setAllAvailableUsers([]);
    onClose();
  };

  const handleFocus = () => {
    showAvailableFriends();
  };

  const uploadProps = {
    accept: 'image/*',
    beforeUpload: file => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
        return Upload.LIST_IGNORE;
      }

      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
        return Upload.LIST_IGNORE;
      }

      // Xử lý file và preview trực tiếp tại đây
      handleAvatarChange({ file });
      return false; // Ngăn chặn upload tự động
    },
    showUploadList: false,
    multiple: false
  };

  const selectedOptions = selectedMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  // Đảm bảo hủy debounce khi component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <Modal
      title="Tạo nhóm chat"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleCreateGroup} disabled={selectedMembers.length < 1}>
          Tạo nhóm
        </Button>
      ]}
      width={500}
    >
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Ảnh nhóm:</label>
          <div className={styles.uploadArea} style={{ position: 'relative' }}>
            {uploading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                <div style={{ marginTop: '12px' }}>Đang xử lý ảnh...</div>
              </div>
            ) : avatarPreview ? (
              <>
                <img
                  src={avatarPreview}
                  alt="Avatar preview"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    objectFit: 'contain'
                  }}
                />
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  className={styles.closeUploadButton}
                  onClick={handleRemoveAvatar}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '50%'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '8px',
                    textAlign: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px'
                  }}
                  onClick={() => document.getElementById('upload-avatar-input').click()}
                >
                  Thay đổi ảnh
                </div>
                <input
                  type="file"
                  id="upload-avatar-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleAvatarChange({ file: e.target.files[0] });
                    }
                  }}
                />
              </>
            ) : (
              <Upload.Dragger
                {...uploadProps}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '20px'
                }}
              >
                <PictureOutlined style={{ fontSize: '42px', color: '#8c8c8c' }} />
                <div className={styles.uploadHint}>Nhấp hoặc kéo thả để tải lên ảnh nhóm</div>
              </Upload.Dragger>
            )}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tên nhóm chat:</label>
          <Input placeholder="Nhập tên nhóm chat (hoặc để trống để tự động tạo)" value={groupName} onChange={e => setGroupName(e.target.value)} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Thêm thành viên:</label>
          <Select 
            mode="multiple" 
            placeholder="Tìm kiếm tên hoặc email" 
            value={selectedOptions} 
            onSearch={handleSearch} 
            onChange={handleSelectMember} 
            onFocus={handleFocus} 
            loading={searching || loadingFriends} 
            filterOption={false} 
            style={{ width: '100%' }} 
            notFoundContent={searching ? 'Đang tìm kiếm...' : 'Không tìm thấy kết quả'} 
            labelInValue={true} 
            optionLabelProp="label"
          >
            {searchResults.map(user => (
              <Option key={user.id} value={user.id} label={user.name}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar size="small" src={user.avatar_url} icon={<UserOutlined />} style={{ marginRight: '8px' }} />
                  {user.name}
                </div>
              </Option>
            ))}
          </Select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Thành viên nhóm ({selectedMembers.length}):</label>
          <div className={styles.selectedMembersContainer}>
            {selectedMembers.length === 0 ? (
              <span className={styles.emptyMembers}>Chưa có thành viên nào được chọn</span>
            ) : (
              selectedMembers.map(member => (
                <Tag key={member.id} closable onClose={() => handleRemoveMember(member.id)} className={styles.memberTag}>
                  <Avatar size="small" src={member.avatar_url} icon={<UserOutlined />} className={styles.memberAvatar} />
                  {member.name}
                </Tag>
              ))
            )}
          </div>
        </div>

        {selectedMembers.length < 1 && <div className={styles.errorMessage}>Vui lòng chọn ít nhất 2 thành viên để tạo nhóm chat</div>}
      </div>
    </Modal>
  );
};

export default CreateGroupChatModal;