import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin } from 'antd';
import styles from './PhotoGallery.module.scss';
import { getImageByUserIdService } from '../../../../../services/postService';
import { useNavigate } from 'react-router-dom';

const { Title, Link } = Typography;

const PhotoGallery = ({ user_Id }) => {
  const [images, setImages] = useState([]); // State lưu ảnh
  const [loading, setLoading] = useState(true); // State loading
  const navigate = useNavigate(); // Dùng để điều hướng trang

  // Hàm fetch ảnh
  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const response = await getImageByUserIdService(user_Id); // Sử dụng userId từ props
      setImages(response?.data?.data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý click vào ảnh
  const handleImageClick = (postId) => {
    navigate(`/photo/${postId}`);
  };

  useEffect(() => {
    if (user_Id) fetchUserImages();
  }, [user_Id]); // Gọi lại khi userId thay đổi

  return (
    <Card className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Title level={4}>Ảnh</Title>
        <Link className={styles.viewAll} href="#">
          Xem tất cả ảnh
        </Link>
      </div>

      {/* Nội dung */}
      {loading ? (
        <div className={styles.spinner}>
          <Spin size="large" />
        </div>
      ) : images.length > 0 ? (
        <Row gutter={[8, 8]}>
          {images.slice(0, 9).map((photo) => (
            <Col span={8} key={photo.imageId}>
              <div className={styles.photo} onClick={() => handleImageClick(photo.postId)}>
                <img
                  src={photo.imageUrl}
                  alt={`Photo ${photo.imageId}`}
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150')} // Fallback ảnh lỗi
                />
              </div>
            </Col>
          ))}
        </Row>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Chưa có ảnh nào.</p>
        </div>
      )}
    </Card>
  );
};

export default PhotoGallery;
