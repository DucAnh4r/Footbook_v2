import React from 'react';
import { Modal, Typography, Switch, Avatar, Divider, List } from 'antd';
import { FaCircle, FaBell, FaCreditCard, FaClock, FaBan } from 'react-icons/fa';
import { unset } from 'lodash';

const { Title, Text } = Typography;

const SettingsMessageModal = ({ visible, onClose }) => {
  return (

    <Modal
      title="Tùy chọn"
      open={visible}
      onCancel={onClose}
      footer={null}
      center
      width={600}
    >
      {/* Tài khoản */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Avatar src="https://via.placeholder.com/50" size={50} />
        <div style={{ marginLeft: 16 }}>
          <Text strong>Duc Manh</Text>
          <br />
          <Text type="secondary">Xem trang cá nhân của bạn</Text>
        </div>
      </div>

      {/* Trạng thái hoạt động */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <FaCircle style={{ fontSize: '16px', marginRight: 8 }} />
        <Text>Trạng thái hoạt động: <strong>ĐANG BẬT</strong></Text>
      </div>

      <Divider style={{ margin: '0px' }} />

      {/* Thông báo */}
      <Title style={{ margin: '5px 0px', fontSize: '16px' }}>Thông báo</Title>

      <List>
        <List.Item>
          <List.Item.Meta
            avatar={<FaBell style={{ fontSize: '16px' }} />}
            title="Âm thanh thông báo"
            description="Dùng thông báo bằng âm thanh để biết về tin nhắn, cuộc gọi đến, đoạn chat video và âm thanh trong ứng dụng."
          />
          <Switch defaultChecked />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            avatar={<FaClock style={{ fontSize: '16px' }} />}
            title="Không làm phiền"
            description="Tắt thông báo trong một khoảng thời gian cụ thể."
          />
          <Switch />
        </List.Item>
      </List>

      <Divider style={{ margin: '0px' }} />

      {/* Các tùy chọn khác */}
      <List>
        <List.Item>
          <List.Item.Meta
            avatar={<FaCreditCard style={{ fontSize: '16px' }} />}
            title="Quản lý khoản thanh toán"
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            avatar={<FaClock style={{ fontSize: '16px' }} />}
            title="Quản lý hoạt động gửi tin nhắn"
          />
        </List.Item>

        <List.Item>
          <List.Item.Meta
            avatar={<FaBan style={{ fontSize: '16px' }} />}
            title="Quản lý phần Chặn"
          />
        </List.Item>
      </List>
    </Modal>

  );
};

export default SettingsMessageModal;
