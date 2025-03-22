import React, { useState } from 'react';
import { Layout, Menu, List } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  HomeOutlined,
  PhoneOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const UserProfile = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const handleMenuClick = (key) => {
    setSelectedTab(key);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: 'Học Công Nghệ Thông Tin tại Trường Đại học Xây dựng Hà Nội - Hanoi University of Civil Engineering',
                icon: <BookOutlined style={{ color: '#1890ff' }} />,
              },
              {
                title: 'Sống tại Hà Nội',
                icon: <HomeOutlined style={{ color: '#1890ff' }} />,
              },
              {
                title: '097 166 54 75',
                icon: <PhoneOutlined style={{ color: '#1890ff' }} />,
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={item.icon}
                  title={item.title}
                />
              </List.Item>
            )}
          />
        );
      // Thêm các case khác cho các tab khác (tùy vào nội dung cần hiển thị)
      default:
        return null;
    }
  };

  return (
    <Layout style={{ border: '1px solid #d9d9d9', background: '#fff' }}>
      <Sider width={300} style={{ background: '#f0f2f5' }}>
        <h3 style={{ padding: '0px' }}>Giới thiệu</h3>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['overview']}
          style={{ height: '100%', borderRight: 0 }}
          onClick={(e) => handleMenuClick(e.key)}
        >
          <Menu.Item key="overview" icon={<UserOutlined />}>
            Tổng quan
          </Menu.Item>
          <Menu.Item key="workEducation" icon={<BookOutlined />}>
            Công việc và học vấn
          </Menu.Item>
          <Menu.Item key="placesLived" icon={<HomeOutlined />}>
            Nơi từng sống
          </Menu.Item>
          <Menu.Item key="contactInfo" icon={<PhoneOutlined />}>
            Thông tin liên hệ và cơ bản
          </Menu.Item>
          <Menu.Item key="familyRelationships" icon={<TeamOutlined />}>
            Gia đình và các mối quan hệ
          </Menu.Item>
          <Menu.Item key="about" icon={<InfoCircleOutlined />}>
            Chi tiết về bạn
          </Menu.Item>
          <Menu.Item key="lifeEvents" icon={<CalendarOutlined />}>
            Sự kiện trong đời
          </Menu.Item>
        </Menu>
      </Sider>
      <Content style={{ padding: '24px', background: '#fff' }}>
        {renderContent()}
      </Content>
    </Layout>
  );
};

export default UserProfile;
