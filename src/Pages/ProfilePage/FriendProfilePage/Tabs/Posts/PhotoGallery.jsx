/* eslint-disable react-hooks/exhaustive-deps */
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
      const response = await getImageByUserIdService(user_Id, 9, 0); // Sử dụng userId từ props
      setImages(response?.data?.images || []);
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
   fetchUserImages();
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
            <Col span={8} key={photo.image_id}>
              <div className={styles.photo} onClick={() => handleImageClick(photo.post_id)}>
                <img
                  src={photo.image_url}
                  alt={`Photo ${photo.image_id}`}
                  style={{
                    cursor: "pointer"
                  }}
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
