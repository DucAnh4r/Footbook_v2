// components/modals/PinnedMessagesModal.js
import React from 'react';
import { Modal, List, Avatar, Typography } from 'antd';

const { Text } = Typography;

const PinnedMessagesModal = ({ visible, onClose, pinnedMessages, selectedColor }) => (
  <Modal title="Tin nhắn đã ghim" open={visible} onCancel={onClose} footer={null} centered>
    <List
      dataSource={pinnedMessages}
      renderItem={(msg) => (
        <List.Item style={msg.sender === 'Bạn' ? { backgroundColor: selectedColor, padding: '10px', borderRadius: '8px' } : {}}>
          <List.Item.Meta
            avatar={<Avatar src={msg.avatar} />}
            title={<Text strong>{msg.sender}</Text>}
            description={<Text>{msg.content}</Text>}
          />
          <Text type="secondary">{msg.time}</Text>
        </List.Item>
      )}
    />
  </Modal>
);

export default PinnedMessagesModal;
