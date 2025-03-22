import React from 'react';
import { Tabs, Card, Row, Col, Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const photosData = [
  { id: 1, src: 'https://dims.apnews.com/dims4/default/98c7c25/2147483647/strip/true/crop/3343x2229+0+0/resize/599x399!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F23%2F2a%2Fc195983e0f48a7e07f43883f1803%2Fc4ddb5cfc45448f2b4827af26a565e49', editable: true },
  { id: 2, src: 'https://dims.apnews.com/dims4/default/98c7c25/2147483647/strip/true/crop/3343x2229+0+0/resize/599x399!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F23%2F2a%2Fc195983e0f48a7e07f43883f1803%2Fc4ddb5cfc45448f2b4827af26a565e49', editable: true },
  // Add more photos as needed
];

const Photos = () => {
  const renderPhotoCard = (photo) => (
    <div
      key={photo.id}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <img
        alt="example"
        src={photo.src}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {photo.editable && (
        <Button
          type="link"
          icon={<EditOutlined />}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: '#fff',
            borderRadius: '50%',
          }}
        />
      )}
    </div>
  );


  return (
    <div style={{ padding: '20px', margin: 'auto', backgroundColor: '#ffffff' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <h2>File phương tiện</h2>
        <div>
          <Button type="link" icon={<PlusOutlined />}>
            Thêm ảnh/video
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Xóa ảnh</Menu.Item>
                <Menu.Item key="2">Chỉnh sửa album</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<EllipsisOutlined />} shape="circle" />
          </Dropdown>
        </div>
      </Row>
      <Tabs defaultActiveKey="tagged">
        <TabPane tab="Ảnh" key="photo">
          <Row gutter={16}>
            {photosData.map((photo) => (
              <Col span={6} key={photo.id}>
                {renderPhotoCard(photo)}
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Video" key="video">
          <Row gutter={16}>
            {/* Add your own photos here */}
          </Row>
        </TabPane>
        <TabPane tab="Album" key="albums">
          <Row gutter={16}>
            {/* Add albums here */}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Photos;
