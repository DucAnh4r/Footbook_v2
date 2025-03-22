// ConfirmFacebookBlockModal.js
import React from 'react';
import { Modal, Typography, Button } from 'antd';

const { Text } = Typography;

const ConfirmFacebookBlockModal = ({ visible, onClose, onConfirm, name }) => {
  return (
    <Modal
      title={`Chặn trên Facebook?`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>
          Chặn
        </Button>,
      ]}
    >
      <Text>
        Bạn và {name} sẽ không phải là bạn bè trên Facebook. Tin nhắn và cuộc gọi của {name} cũng sẽ bị chặn.
      </Text>
    </Modal>
  );
};

export default ConfirmFacebookBlockModal;
