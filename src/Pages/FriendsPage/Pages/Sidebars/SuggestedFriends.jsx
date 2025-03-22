import React, { useState } from "react";
import { Row, Col } from "antd";
import styles from "./SuggestedFriends.module.scss";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FriendRequestItem from "../../Components/FriendRequestItem";

const SuggestedFriends = ({ users, onSelectUser }) => {
  const [selectedUserId, setSelectedUserId] = useState(null); // State để lưu id người dùng được chọn
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/friends");
  };

  const handleSelectUser = (userId) => {
    // Cập nhật selectedUserId khi thẻ FriendRequestItem được chọn
    setSelectedUserId(userId);
    if (onSelectUser) {
      onSelectUser(userId); // Gọi callback từ cha nếu có
    }
  };

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
          <span className={styles.title}>Gợi ý</span>
        </Col>
      </Row>
      <Row style={{ padding: "0 16px" }} className={styles.statsRow}>
        <span>Những người bạn có thể biết</span>
      </Row>
      
      <Row style={{ marginTop: "16px" }}>
        {users.map((user) => (
          <FriendRequestItem
            key={user.senderId}
            userId={user.senderId}
            user={user} // Truyền thêm dữ liệu người dùng
            onSelectUser={handleSelectUser}
            isSelected={user.senderId === selectedUserId} // Truyền prop để biết thẻ nào được chọn
          />
        ))}
      </Row>
    </>
  );
};

export default SuggestedFriends;
