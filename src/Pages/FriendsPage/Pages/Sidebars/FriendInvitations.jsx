import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import styles from "./FriendInvitations.module.scss";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FriendRequestItem from "../../Components/FriendRequestItem";
import { getFriendshipRequestService } from "../../../../services/friendService";
import { getUserIdFromLocalStorage } from "../../../../utils/authUtils";

const FriendInvitations = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]); // Lưu danh sách lời mời kết bạn
  const [selectedUserId, setSelectedUserId] = useState(null); // State để lưu id người dùng được chọn
  const [loading, setLoading] = useState(true); // Hiển thị trạng thái loading
  const navigate = useNavigate();
  
  const userId2 = getUserIdFromLocalStorage();

  const handleBack = () => {
    navigate("/friends");
  };

  const handleSelectUser = (senderId) => {
    // Cập nhật selectedUserId khi thẻ FriendRequestItem được chọn
    setSelectedUserId(senderId);
    if (onSelectUser) {
      onSelectUser(senderId); // Gọi callback từ cha nếu có
    }
  };

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await getFriendshipRequestService({ userId2 });
        if (response.data.success) {
          // Lưu dữ liệu vào state
          setUsers(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchFriendRequests();
  }, []);

  return (
    <>
      <Row className={styles.headerRow}>
        <Col>
          <div className={styles.backButton} onClick={handleBack}>
            <div className={styles.backIcon}>
              <IoMdArrowRoundBack style={{ width: "30px", height: "30px" }} />
            </div>
          </div>
        </Col>
        <Col className={styles.titleCol}>
          <span className={styles.subTitle}>Bạn bè</span>
          <span className={styles.title}>Lời mời kết bạn</span>
        </Col>
      </Row>
      <Row style={{ padding: "0 16px" }} className={styles.statsRow}>
        <span>{users.length} lời mời kết bạn</span>
      </Row>
      <Row style={{ padding: "0 16px" }} className={styles.actionRow}>
        <span>Xem lời mời đã gửi</span>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        {loading ? (
          <span>Đang tải...</span>
        ) : (
          users.map((user) => (
            <FriendRequestItem
              key={user.senderId}
              userId={user.senderId}
              user={user} // Truyền thêm dữ liệu người dùng
              onSelectUser={handleSelectUser}
              isSelected={user.senderId === selectedUserId} // Truyền prop để biết thẻ nào được chọn
            />
          ))
        )}
      </Row>
    </>
  );
};

export default FriendInvitations;
