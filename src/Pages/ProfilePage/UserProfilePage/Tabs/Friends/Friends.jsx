import React, { useState } from 'react';
import { Input, Tabs, Card, Row, Col, Button, Dropdown, Menu } from 'antd';
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const friendsData = [
  { id: 1, name: 'Đỗ Hùng Minh', mutualFriends: 54, avatar: 'https://thanhnien.mediacdn.vn/Uploaded/namnt/2022_11_30/16693885043817-2633.jpg' },
  { id: 2, name: 'Đặng Vũ Huy', mutualFriends: 116, avatar: 'https://thanhnien.mediacdn.vn/Uploaded/namnt/2022_11_30/16693885043817-2633.jpg' },
  { id: 3, name: 'Minh Hoàng', mutualFriends: 47, avatar: 'https://thanhnien.mediacdn.vn/Uploaded/namnt/2022_11_30/16693885043817-2633.jpg' },
  { id: 4, name: 'Minh Hoàng', mutualFriends: 50, avatar: 'https://thanhnien.mediacdn.vn/Uploaded/namnt/2022_11_30/16693885043817-2633.jpg' },
  { id: 5, name: 'Le Loc', mutualFriends: 56, avatar: 'https://thanhnien.mediacdn.vn/Uploaded/namnt/2022_11_30/16693885043817-2633.jpg' },
  { id: 6, name: 'Duc Manh', mutualFriends: 24, avatar: null }, // No avatar example
];

const Friends = () => {
  const [activeTab, setActiveTab] = useState('all');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const renderFriendCard = (friend) => (
    <Card
      style={{ width: '100%', marginBottom: '16px' }}
      key={friend.id}
    >
      <Row align="middle">
        <Col span={4}>
          {friend.avatar ? (
            <img
              src={friend.avatar}
              alt={friend.name}
              style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '8px',
                backgroundColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '24px', color: '#fff' }}>{friend.name.charAt(0)}</span>
            </div>
          )}
        </Col>
        <Col span={16} style={{ paddingLeft: '16px' }}>
          <div style={{ fontWeight: 'bold' }}>{friend.name}</div>
          <div style={{ color: '#888' }}>{friend.mutualFriends} bạn chung</div>
        </Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Xem hồ sơ</Menu.Item>
                <Menu.Item key="2">Hủy kết bạn</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisOutlined />} shape="circle" />
          </Dropdown>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div style={{ padding: '20px', width: '100%', margin: 'auto' }}>
      <h2>Bạn bè</h2>
      <Input
        placeholder="Tìm kiếm"
        prefix={<SearchOutlined />}
        style={{ marginBottom: '16px' }}
      />
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả bạn bè" key="all">
          <Row gutter={16}>
            {friendsData.map((friend) => (
              <Col span={12} key={friend.id}>
                {renderFriendCard(friend)}
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Đã thêm gần đây" key="recent">
          {/* Data for "Đã thêm gần đây" */}
        </TabPane>
        <TabPane tab="Sinh nhật" key="birthday">
          {/* Data for "Sinh nhật" */}
        </TabPane>
        <TabPane tab="Đại học" key="university">
          {/* Data for "Đại học" */}
        </TabPane>
        <TabPane tab="Trường trung học" key="highschool">
          {/* Data for "Trường trung học" */}
        </TabPane>
        <TabPane tab="Tỉnh/Thành phố hiện tại" key="currentCity">
          {/* Data for "Tỉnh/Thành phố hiện tại" */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Friends;
