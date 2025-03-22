import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Typography, Spin } from 'antd';
import styles from './FriendsList.module.scss';
import { userListFriendService } from '../../../../../services/userService';
import { useNavigate } from 'react-router-dom';

const { Title, Link, Text } = Typography;

const FriendsList = ({ user_Id }) => {
  const [friends, setFriends] = useState([]); // State lưu danh sách bạn bè
  const [loading, setLoading] = useState(true); // State loading
  const navigate = useNavigate(); // Dùng để điều hướng

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await userListFriendService(user_Id); // Lấy dữ liệu từ API
      const friendsData = response?.data?.data?.friends || []; // Lấy danh sách bạn bè
      console.log("API trả về:", friendsData); // Log dữ liệu từ API
      setFriends(friendsData); // Cập nhật state
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };
  

  // Xử lý điều hướng tới trang cá nhân của bạn bè
  const handleImageClick = (id) => {
    navigate(`/friendprofile/${id}`);
  };

  useEffect(() => {
    fetchFriends();
  }, [user_Id]); // Chỉ gọi API khi userId thay đổi

  return (
    <Card className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Title level={4}>Bạn bè</Title>
        <Link className={styles.viewAll} href="#">
          Xem tất cả bạn bè
        </Link>
      </div>

      {/* Hiển thị số lượng bạn bè */}
      <Text className={styles.friendCount}>
        {friends.length === 0
          ? 'Chưa có bạn bè'
          : friends.length === 1
          ? '1 bạn'
          : `${friends.length} người bạn`}
      </Text>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Spin size="large" />
        </div>
      ) : friends.length === 0 ? ( // Kiểm tra danh sách bạn bè rỗng
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Text>Hiện tại bạn chưa có bạn bè nào.</Text>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {friends.map((friend) => (
            <Col span={8} key={friend.id}>
              <div className={styles.friend}>
                <div className={styles.avatar}>
                  {friend.avatarUrl ? (
                    <img
                      src={friend.avatarUrl}
                      alt={friend.fullName}
                      onClick={() => handleImageClick(friend.id)} // Truyền hàm đúng cách
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <div
                      onClick={() => handleImageClick(friend.id)} // Truyền hàm đúng cách
                      style={{ cursor: 'pointer' }}
                      className={styles.placeholderAvatar}
                    />
                  )}
                </div>
                <Text className={styles.name}>{friend.fullName}</Text>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

export default FriendsList;
