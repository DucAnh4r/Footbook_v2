// SelfDestructMessageModal.js
import React, { useState } from 'react';
import { Modal, Radio, Typography, Button, Space } from 'antd';

const { Text, Link } = Typography;

const SelfDestructMessageModal = ({ visible, onClose, onSave }) => {
  const [selectedOption, setSelectedOption] = useState("off");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Modal
      title="Tin nhắn tự hủy"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => onSave(selectedOption)}
          disabled={selectedOption !== "24h"} // Chỉ bật khi chọn "24 giờ"
        >
          Xong
        </Button>,
      ]}
    >
      <Text>Tin nhắn sẽ biến mất sau 24 giờ kể từ khi gửi.</Text>
      <br />
      <Link href="#" style={{ color: '#1890ff' }}>Tìm hiểu thêm</Link>
      <br />
      <Radio.Group onChange={handleOptionChange} value={selectedOption} style={{ marginTop: '16px' }}>
        <Space direction="vertical">
          <Radio value="off">Đang tắt</Radio>
          <Radio value="24h">24 giờ</Radio>
        </Space>
      </Radio.Group>
    </Modal>
  );
};

export default SelfDestructMessageModal;
