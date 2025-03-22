import React from 'react';
import { Modal, Typography, Button, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const SendReportModal = ({ visible, onClose, reason, onSendReport }) => {
  return (
    <Modal
      title="Gửi báo cáo?"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text>Gửi tin nhắn gần đây trong cuộc trò chuyện này cho Facebook xét duyệt.</Text>
        <Link href="#" style={{ color: '#1890ff' }}>Tìm hiểu thêm về cách báo cáo.</Link>
        <Button type="primary" onClick={() => onSendReport(reason)} block>
          Gửi
        </Button>
        <Button type="link" icon={<LeftOutlined />} onClick={onClose}>
          Quay lại
        </Button>
      </Space>
    </Modal>
  );
};

export default SendReportModal;
