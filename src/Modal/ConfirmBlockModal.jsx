// ConfirmBlockModal.js
import React from 'react';
import { Modal, Typography, Button } from 'antd';

const { Text } = Typography;

const ConfirmBlockModal = ({ visible, onClose, onConfirm, name }) => {
  return (
    <Modal
      title={`Block ${name}?`}
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
      <Text>Bạn sẽ không nhận được tin nhắn hay cuộc gọi của họ trên Messenger.</Text>
    </Modal>
  );
};

export default ConfirmBlockModal;
