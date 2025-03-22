import React from 'react';
import { Typography, Avatar, Button } from 'antd';
import { LeftOutlined, PlusOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const RestrictedAccountsView = ({ onBack }) => {
  return (
    <div style={styles.container}>
      {/* Nút quay lại */}
      <Button
        type="text"
        icon={<LeftOutlined />}
        onClick={onBack}
        style={{ marginBottom: '16px' }}
      >
        Tài khoản đã hạn chế
      </Button>

      {/* Nội dung */}
      <Title level={5}>Tài khoản đã hạn chế</Title>
      <Text>
        Với tùy chọn hạn chế, bạn có thể giới hạn hoạt động tương tác với ai đó bạn biết mà không phải chặn họ.{' '}
        <Link href="#">Tìm hiểu cách hoạt động</Link>
      </Text>

      <div style={styles.addPersonContainer}>
        <Avatar
          size="large"
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#e6e6e6', color: '#999' }}
        />
        <Text style={{ marginLeft: '10px' }}>Thêm người</Text>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
  },
  addPersonContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
  },
};

export default RestrictedAccountsView;
