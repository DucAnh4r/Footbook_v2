import React from 'react';
import { Modal, Typography, Radio, Space, Button, Avatar } from 'antd';

const { Text, Title } = Typography;

const RestrictUserModal = ({ visible, onClose, onRestrict, avatar, name }) => {
  return (
    <Modal
      title={`Ẩn bớt nội dung về ${name} mà không chặn họ`}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onRestrict}>
          Hạn chế {name}
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <Avatar src={avatar} size={80} />
      </div>

      <Radio.Group style={{ width: '100%' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Radio value="hideChat">
            <Text strong>Ẩn đoạn chat</Text>
            <Text type="secondary" style={{ display: 'block' }}>
              Gỡ cuộc trò chuyện khỏi danh sách Đoạn chat để không nhận thông báo về tin nhắn nữa.
            </Text>
          </Radio>
          <Radio value="hideActivity">
            <Text strong>Ẩn hoạt động của bạn</Text>
            <Text type="secondary" style={{ display: 'block' }}>
              Họ sẽ không biết khi nào bạn đọc tin nhắn hay Trạng thái hoạt động của bạn.
            </Text>
          </Radio>
          <Radio value="removeRestriction">
            <Text strong>Bỏ hạn chế bất cứ lúc nào</Text>
            <Text type="secondary" style={{ display: 'block' }}>
              Họ sẽ không nhận được thông báo rằng bạn đã hạn chế họ. Bạn có thể bỏ hạn chế trong phần cài đặt quyền riêng tư.
            </Text>
          </Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default RestrictUserModal;
