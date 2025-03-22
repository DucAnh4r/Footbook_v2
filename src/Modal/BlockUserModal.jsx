// BlockUserModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, Space, Divider } from 'antd';
import { FacebookOutlined, MessageOutlined } from '@ant-design/icons';
import ConfirmBlockModal from './ConfirmBlockModal';
import ConfirmFacebookBlockModal from './ConfirmFacebookBlockModal';

const { Text, Title } = Typography;

const BlockUserModal = ({ visible, onClose, name }) => {
  const [isConfirmBlockVisible, setConfirmBlockVisible] = useState(false);
  const [isConfirmFacebookBlockVisible, setConfirmFacebookBlockVisible] = useState(false);

  // Đóng BlockUserModal và mở ConfirmBlockModal
  const handleOpenConfirmBlock = () => {
    setConfirmBlockVisible(true);
  };

  // Đóng BlockUserModal và mở ConfirmFacebookBlockModal
  const handleOpenConfirmFacebookBlock = () => {
    setConfirmFacebookBlockVisible(true);
  };

  // Đóng ConfirmBlockModal và gọi onClose của BlockUserModal
  const handleConfirmBlockClose = () => {
    setConfirmBlockVisible(false);
    onClose();
  };

  // Đóng ConfirmFacebookBlockModal và gọi onClose của BlockUserModal
  const handleConfirmFacebookBlockClose = () => {
    setConfirmFacebookBlockVisible(false);
    onClose();
  };

  // Theo dõi thay đổi của visible để reset trạng thái modal
  useEffect(() => {
    if (!visible) {
      setConfirmBlockVisible(false);
      setConfirmFacebookBlockVisible(false);
    }
  }, [visible]);

  return (
    <>
      {/* BlockUserModal */}
      <Modal
        title={`Chặn ${name}`}
        open={visible && !isConfirmBlockVisible && !isConfirmFacebookBlockVisible}
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Hủy
          </Button>,
        ]}
        width={500}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Chặn tin nhắn và cuộc gọi */}
          <Space align="start" style={{ width: '100%' }}>
            <MessageOutlined style={{ fontSize: '24px', color: '#000' }} />
            <div onClick={handleOpenConfirmBlock} style={{ width: '100%', cursor: 'pointer' }}>
              <Title level={5}>Chặn tin nhắn và cuộc gọi</Title>
              <Text type="secondary">
                - Tài khoản Facebook của bạn sẽ không nhận được tin nhắn hoặc cuộc gọi từ tài khoản Facebook của {name}.
              </Text>
            </div>
          </Space>
          
          <Divider />

          {/* Chặn trên Facebook */}
          <Space align="start" style={{ width: '100%' }}>
            <FacebookOutlined style={{ fontSize: '24px', color: '#3b5998' }} />
            <div onClick={handleOpenConfirmFacebookBlock} style={{ width: '100%', cursor: 'pointer' }}>
              <Title level={5}>Chặn trên Facebook</Title>
              <Text type="secondary">
                - Nếu các bạn là bạn bè, việc chặn {name} cũng sẽ hủy kết bạn với họ.
              </Text>
              <br />
              <Text type="secondary">
                - Tin nhắn và cuộc gọi của {name} cũng sẽ bị chặn.
              </Text>
            </div>
          </Space>
        </Space>
      </Modal>

      {/* ConfirmBlockModal */}
      <ConfirmBlockModal
        visible={isConfirmBlockVisible}
        onClose={() => {
          setConfirmBlockVisible(false);
        }}
        onConfirm={handleConfirmBlockClose}
        name={name}
      />

      {/* ConfirmFacebookBlockModal */}
      <ConfirmFacebookBlockModal
        visible={isConfirmFacebookBlockVisible}
        onClose={() => {
          setConfirmFacebookBlockVisible(false);
        }}
        onConfirm={handleConfirmFacebookBlockClose}
        name={name}
      />
    </>
  );
};

export default BlockUserModal;
