import React, { useEffect, useState } from 'react';
import { Tabs, Card, Row, Col, Button, Dropdown, Menu } from 'antd';
import { PlusOutlined, EllipsisOutlined, EditOutlined } from '@ant-design/icons';
import { getImageByUserIdService } from '../../../../../services/postService';
import { getUserIdFromLocalStorage } from '../../../../../utils/authUtils';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const Photos = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = getUserIdFromLocalStorage();
  const navigate = useNavigate();

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const response = await getImageByUserIdService(user_id, 20, 0);
      setImages(response?.data?.images || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = postId => {
    navigate(`/photo/${postId}`);
  };

  useEffect(() => {
    fetchUserImages();
  }, []);

  const renderPhotoCard = photo => (
    <div
      key={photo.imageId}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        marginBottom: '16px',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <img alt="example" src={photo.image_url} onError={e => (e.target.src = 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/150')} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }} onClick={() => handleImageClick(photo.post_id)} />

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
            borderRadius: '50%'
          }}
        />
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', margin: 'auto' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <h2>Ảnh</h2>
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
        <TabPane tab="Ảnh của bạn" key="tagged">
          {loading ? (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>Đang tải ảnh...</div>
          ) : (
            <Row gutter={16}>
              {images.map(photo => (
                <Col span={6} key={photo.imageId}>
                  {renderPhotoCard(photo)}
                </Col>
              ))}
            </Row>
          )}
        </TabPane>
        <TabPane tab="Ảnh có mặt bạn" key="yourPhotos">
          <Row gutter={16}>{/* Add your own photos here */}</Row>
        </TabPane>
        <TabPane tab="Album" key="albums">
          <Row gutter={16}>{/* Add albums here */}</Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Photos;
