import React from 'react';
import { Tabs, Row, Col, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

const videosData = [
  { id: 1, src: 'https://nationaltoday.com/wp-content/uploads/2022/10/40-Nikocado-Avocado-1200x834.jpg', duration: '0:05', editable: true },
  { id: 2, src: 'https://nationaltoday.com/wp-content/uploads/2022/10/40-Nikocado-Avocado-1200x834.jpg', duration: '0:11', editable: true },
  { id: 3, src: 'https://nationaltoday.com/wp-content/uploads/2022/10/40-Nikocado-Avocado-1200x834.jpg', duration: '0:20', editable: true },
  { id: 4, src: 'https://nationaltoday.com/wp-content/uploads/2022/10/40-Nikocado-Avocado-1200x834.jpg', duration: '0:14', editable: true },
  { id: 5, src: 'https://nationaltoday.com/wp-content/uploads/2022/10/40-Nikocado-Avocado-1200x834.jpg', duration: '0:22', editable: true },
  // Thêm video khác vào đây
];

const Videos = () => {
  const renderVideoCard = (video) => (
    <div
      key={video.id}
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}
    >
      <img
        src={video.src}
        alt="Video thumbnail"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {video.editable && (
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
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '12px',
        }}
      >
        {video.duration}
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px', margin: 'auto' }}>
      <h2>Video</h2>
      <Tabs defaultActiveKey="yourVideos">
        <TabPane tab="Video của bạn" key="yourVideos">
          <Row gutter={16}>
            {videosData.map((video) => (
              <Col span={6} key={video.id}>
                {renderVideoCard(video)}
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Videos;
