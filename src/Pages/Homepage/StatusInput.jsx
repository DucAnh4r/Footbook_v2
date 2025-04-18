import React, { useState } from 'react';
import { Button, Avatar } from 'antd';
import { FaImages, FaSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatePostModal from '../../Modal/CreatePostModal';

const StatusInput = ( { userName, avatar, onPostCreated} ) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleIconClick = () => {
    navigate('/profile');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        marginBottom: '16px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
        <Avatar
          size="large"
          style={{ cursor: 'pointer' }}
          icon={
            <img
              src={avatar}
              alt="User avatar"
              onClick={handleIconClick}
            />
          }
        />
        <Button
          style={{
            borderRadius: '20px',
            height: '40px',
            flex: 1,
            width: '100%',
          }}
          onClick={showModal} // Mở modal khi bấm
        >
          {userName} ơi, bạn đang nghĩ gì thế?
        </Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '16px',
          flexWrap: 'wrap',
        }}
      >
        <Button type="text" icon={<FaImages style={{ color: 'green' }} />}>
          Ảnh/video
        </Button>
        <Button type="text" icon={<FaSmile style={{ color: 'orange' }} />}>
          Cảm xúc/hoạt động
        </Button>
      </div>

      {/* Hiển thị CreatePostModal */}
      {isModalVisible && (
        <CreatePostModal
          isModalOpen={isModalVisible}
          onClose={closeModal}
          userName={userName}
          onPostCreated={onPostCreated} // Gọi lại fetchPosts chỉ khi cần thiết
        />
      )}
    </div>
  );
};

export default StatusInput;
