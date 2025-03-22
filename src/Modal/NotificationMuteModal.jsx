import React from 'react';
import { Modal, Radio, Typography, Space, Button } from 'antd';

const { Text } = Typography;

const NotificationMuteModal = ({ visible, onClose, onMute }) => {
  return (
    <Modal
      title="Tắt thông báo về cuộc trò chuyện"
      open={visible}
      onCancel={onClose}
      width={535}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onMute}>
          Tắt thông báo
        </Button>,
      ]}
    >
      <Space direction="vertical">
        <Radio.Group defaultValue="15">
          <Space direction="vertical">
            <Radio value="15">Trong 15 phút</Radio>
            <Radio value="60">Trong 1 giờ</Radio>
            <Radio value="480">Trong 8 giờ</Radio>
            <Radio value="1440">Trong 24 giờ</Radio>
            <Radio value="untilEnable">Đến khi tôi bật lại</Radio>
          </Space>
        </Radio.Group>
        <Text>
          Cửa sổ chat vẫn đóng và bạn sẽ không nhận được thông báo đẩy trên thiết bị.
        </Text>
      </Space>
    </Modal>
  );
};

export default NotificationMuteModal;
