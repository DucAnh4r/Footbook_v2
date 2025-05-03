/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Avatar, message, Upload, Select, Tag } from 'antd';
import { UserOutlined, CameraOutlined } from '@ant-design/icons';
import { createGroupChatService } from '../services/privateMessageService';
import { getUserIdFromLocalStorage } from '../utils/authUtils';
import { userSearchService, userListFriendService } from '../services/userService';
import styles from './CreateGroupChatModal.module.scss';

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
      console.error("Error fetching friends:", error);
    } finally {
      setLoadingFriends(false);
    }
  };

  const showAvailableFriends = () => {
    const availableFriends = friends.filter(friend =>
      !selectedMembers.some(member => member.id === friend.id)
    );
    setSearchResults(availableFriends);
  };

  const handleSearch = async (value) => {
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
          avatar_url: user.avatar_url,
        }));
      
      const updatedAllUsers = [...allAvailableUsers];
      
      newSearchResults.forEach(newUser => {
        if (!updatedAllUsers.some(existingUser => existingUser.id === newUser.id)) {
          updatedAllUsers.push(newUser);
        }
      });
      
      setAllAvailableUsers(updatedAllUsers);
      
      const filteredResults = newSearchResults.filter(user => 
        !selectedMembers.some(member => member.id === user.id)
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching users:", error);
      message.error("Không thể tìm kiếm người dùng");
    } finally {
      setSearching(false);
    }
  };
  
  // Chuyển đổi sang sử dụng labelInValue
  const handleSelectMember = (selectedOptions) => {
    // selectedOptions sẽ là mảng các đối tượng { value: id, label: name }
    const newSelectedMembers = selectedOptions.map(option => {
      const found = allAvailableUsers.find(user => user.id === option.value);
      return found ? {
        id: found.id,
        name: found.name,
        avatar_url: found.avatar_url,
      } : null;
    }).filter(Boolean);
    
    setSelectedMembers(newSelectedMembers);
    
    // Cập nhật lại danh sách hiển thị, loại bỏ người dùng đã chọn
    const selectedIds = newSelectedMembers.map(member => member.id);
    const availableUsers = allAvailableUsers.filter(user => 
      !selectedIds.includes(user.id)
    );
    setSearchResults(availableUsers);
  };

  const handleRemoveMember = (memberId) => {
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

  const handleAvatarChange = (info) => {
    if (info.file.originFileObj) {
      setAvatarFile(info.file.originFileObj);
      const reader = new FileReader();
      reader.readAsDataURL(info.file.originFileObj);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setUploading(false);
      };
    }
  };

  const generateDefaultGroupName = () => {
    if (selectedMembers.length === 0) return '';
    return selectedMembers.map(member => member.name).join(', ');
  };

  const handleCreateGroup = async () => {
    if (selectedMembers.length < 1) {
      message.error("Vui lòng chọn ít nhất 2 thành viên để tạo nhóm chat");
      return;
    }

    const finalGroupName = groupName.trim() || generateDefaultGroupName();
    try {
      const memberIds = selectedMembers.map(member => member.id);
      const data = {
        name: finalGroupName,
        creator_id: currentUserId,
        members: [currentUserId, ...memberIds],
        avatar_file: avatarFile,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      };
      await createGroupChatService(data);
      message.success("Tạo nhóm chat thành công");
      onSuccess && onSuccess();
      handleCancel();
    } catch (error) {
      console.error("Error creating group chat:", error);
      message.error("Không thể tạo nhóm chat");
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
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error('Bạn chỉ có thể tải lên tệp hình ảnh!');
        return false;
      }
      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      return false;
    },
    onChange: handleAvatarChange,
    showUploadList: false,
  };

  // Tạo mảng các đối tượng chứa value và label cho Select
  const selectedOptions = selectedMembers.map(member => ({
    value: member.id,
    label: member.name
  }));

  return (
    <Modal
      title="Tạo nhóm chat"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleCreateGroup} disabled={selectedMembers.length < 1}>
          Tạo nhóm
        </Button>,
      ]}
      width={500}
    >
      <div className={styles.modalContent}>
        <div className={styles.avatarUploadContainer}>
          <Upload {...uploadProps}>
            <div className={styles.avatarWrapper}>
              <Avatar size={100} icon={<UserOutlined />} src={avatarPreview} />
              <div className={styles.avatarIcon}>
                <CameraOutlined className={styles.avatarIconInner} />
              </div>
            </div>
          </Upload>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tên nhóm chat:</label>
          <Input
            placeholder="Nhập tên nhóm chat (hoặc để trống để tự động tạo)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Thêm thành viên:</label>
          <Select
            mode="multiple"
            placeholder="Tìm kiếm tên hoặc email"
            value={selectedOptions} // Sử dụng mảng các đối tượng {value, label}
            onSearch={handleSearch}
            onChange={handleSelectMember}
            onFocus={handleFocus}
            loading={searching || loadingFriends}
            filterOption={false}
            style={{ width: '100%' }}
            notFoundContent={searching ? "Đang tìm kiếm..." : "Không tìm thấy kết quả"}
            labelInValue={true} // Quan trọng: Bật chế độ sử dụng đối tượng {value, label}
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
                <Tag
                  key={member.id}
                  closable
                  onClose={() => handleRemoveMember(member.id)}
                  className={styles.memberTag}
                >
                  <Avatar
                    size="small"
                    src={member.avatar_url}
                    icon={<UserOutlined />}
                    className={styles.memberAvatar}
                  />
                  {member.name}
                </Tag>
              ))
            )}
          </div>
        </div>

        {selectedMembers.length < 1 && (
          <div className={styles.errorMessage}>
            Vui lòng chọn ít nhất 2 thành viên để tạo nhóm chat
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateGroupChatModal;