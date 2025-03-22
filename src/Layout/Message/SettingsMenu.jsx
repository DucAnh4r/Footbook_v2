// /src/components/SettingsMenu.jsx
import React from 'react';
import { List, Switch, Typography } from 'antd';
import {
  PhoneOutlined,
  MessageOutlined,
  BellOutlined,
  SafetyOutlined,
  CheckCircleOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  BlockOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const settingsOptions = [
  { id: 1, icon: <PhoneOutlined />, title: 'Âm thanh cuộc gọi đến', switch: true },
  { id: 2, icon: <MessageOutlined />, title: 'Âm thanh tin nhắn', switch: true },
  { id: 3, icon: <BellOutlined />, title: 'Tin nhắn mới bật lên', description: 'Tự động mở tin nhắn mới.', switch: true },
  { id: 4, icon: <SafetyOutlined />, title: 'Quyền riêng tư & an toàn', navigate: true },
  { id: 5, icon: <CheckCircleOutlined />, title: 'Trạng thái hoạt động', description: 'ĐANG BẬT', navigate: true },
  { id: 6, icon: <MailOutlined />, title: 'Tin nhắn đang chờ', navigate: true },
  { id: 7, icon: <ClockCircleOutlined />, title: 'Đoạn chat đã lưu trữ', navigate: true },
  { id: 8, icon: <SettingOutlined />, title: 'Cài đặt gửi tin nhắn', navigate: true },
  { id: 9, icon: <BlockOutlined />, title: 'Tài khoản đã hạn chế', navigate: true },
  { id: 10, icon: <SettingOutlined />, title: 'Cài đặt chặn', navigate: true },
];

const SettingsMenu = () => {
  return (
    <div style={styles.container}>
      <Typography.Title level={5} style={styles.title}>Cài đặt chat</Typography.Title>
      <Text type="secondary" style={styles.subtitle}>Tùy chỉnh trải nghiệm trên Messenger.</Text>
      <List
        itemLayout="horizontal"
        dataSource={settingsOptions}
        renderItem={(item) => (
          <List.Item
            actions={
              item.switch ? [<Switch defaultChecked />] : item.navigate ? [<SettingOutlined />] : null
            }
          >
            <List.Item.Meta
              avatar={item.icon}
              title={<Text>{item.title}</Text>}
              description={item.description && <Text type="secondary" style={styles.description}>{item.description}</Text>}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

const styles = {
  container: {
    width: '400px',
    padding: '16px',
    position: 'absolute',
    top: '-6px',
    right: '6px',
    backgroundColor: 'white',
    zIndex: 1000,
  },
  title: {
    marginBottom: 0,
  },
  subtitle: {
    fontSize: '12px',
    marginBottom: '16px',
  },
  description: {
    fontSize: '12px',
  },
};

export default SettingsMenu;
