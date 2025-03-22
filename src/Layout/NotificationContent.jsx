import React from 'react';
import { Avatar, Badge, List, Typography, Space, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import styles from './NotificationContent.module.scss';

const { Text } = Typography;

const notifications = [
  {
    id: 1,
    name: 'Brawlhalla Online Việt Nam:',
    description: 'Danh sách những nhân vật được chia ra hai team như sau',
    time: '5 giờ',
    unread: true,
  },
  {
    id: 2,
    name: 'Liên chi Đoàn Khoa Công nghệ thông tin:',
    description: 'Trường Đại học Xây dựng Hà Nội đã nhắc đến bạn...',
    time: '3 ngày',
    unread: false,
  },
  {
    id: 3,
    name: 'SmallGym 💪 Đơn Giản Là Đam Mê:',
    description: 'Sau 3 tháng lăn lội 🏋️‍♂️😂',
    time: '4 ngày',
    unread: true,
  },
  {
    id: 4,
    name: 'Facebook:',
    description: 'Chúng tôi nhận thấy có lượt đăng nhập mới từ thiết bị/vị trí mà bạn không hay dùng...',
    time: '4 ngày',
    unread: false,
  },

];

const NotificationContent = () => (
  <div className={styles.container}>
    {/* Header */}
    <div className={styles.header}>
      <Text strong style={{ fontSize: '20px' }}>Thông báo</Text>
      <Button type="text" icon={<BellOutlined />} />
    </div>

    {/* Button Group */}
    <div className={styles.buttonGroup}>
      <Button type="text">Tất cả</Button>
      <Button type="text">Chưa đọc</Button>
    </div>

    {/* Notifications List */}
    <div className={styles.list}>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={({ name, description, time, unread }) => (
          <List.Item className={styles.listItem}>
            <List.Item.Meta
              avatar={
                <Badge dot={unread} offset={[-4, 4]} style={{ backgroundColor: '#1890ff' }}>
                  <Avatar src="https://via.placeholder.com/40" size="large" />
                </Badge>
              }
              title={<Text className={styles.title}>{name}</Text>}
              description={
                <Text className={styles.description}>
                  {description}
                  <br />
                  {time}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </div>

    {/* Footer */}
    <div className={styles.footer}>
      <Button type="text">Xem tất cả</Button>
    </div>
  </div>
);

export default NotificationContent;
