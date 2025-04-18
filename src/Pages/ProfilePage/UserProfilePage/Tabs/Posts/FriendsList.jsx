/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Spin } from "antd";
import styles from "./FriendsList.module.scss";
import { userListFriendService } from "../../../../../services/userService";
import { getUserIdFromLocalStorage } from "../../../../../utils/authUtils";
import { useNavigate } from "react-router-dom";

const { Title, Link, Text } = Typography;

const FriendsList = () => {
  const [friends, setFriends] = useState([]); // State lưu danh sách bạn bè
  const [loading, setLoading] = useState(true); // State loading
  const user_id = getUserIdFromLocalStorage(); // Lấy userId từ localStorage
  const navigate = useNavigate(); // Dùng để điều hướng

  // Hàm fetch bạn bè
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await userListFriendService(user_id);
      setFriends(response?.data?.friends || []); // Lưu danh sách bạn bè
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý điều hướng tới trang cá nhân của bạn bè
  const handleImageClick = (id) => {
    navigate(`/friendprofile/${id}`);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <Card className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Title level={4}>Bạn bè</Title>
        <Link className={styles.viewAll} href="#">
          Xem tất cả bạn bè
        </Link>
      </div>
      <Text className={styles.friendCount}>
        {friends.length === 0
          ? "Chưa có bạn bè"
          : friends.length === 1
          ? "1 người bạn"
          : `${friends.length} người bạn`}
      </Text>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {friends.map((friend) => (
            <Col span={8} key={friend.id}>
              <div
                className={styles.friend}
                onClick={() => handleImageClick(friend.id)} // Truyền hàm đúng cách
                style={{ cursor: "pointer" }}
              >
                <div className={styles.avatar}>
                  {friend.avatar_url ? (
                    <img src={friend.avatar_url} alt={friend.name} />
                  ) : (
                    <div
                      onClick={() => handleImageClick(friend.id)} // Truyền hàm đúng cách
                      style={{ cursor: "pointer" }}
                      className={styles.placeholderAvatar}
                    ></div>
                  )}
                </div>
                <Text className={styles.name}>{friend.name}</Text>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  );
};

export default FriendsList;
