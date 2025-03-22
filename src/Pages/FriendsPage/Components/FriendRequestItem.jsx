import React from "react";
import styles from "./FriendRequestItem.module.scss";
import { Row, Col } from "antd";

const FriendRequestItem = ({ user, onSelectUser, isSelected }) => {
  const { senderId, fullName, profilePictureUrl, sentAt } = user; // Lấy thông tin từ object user

  const handleClick = () => {
    if (onSelectUser) {
      onSelectUser(senderId); // Gọi hàm onSelectUser với userId
    }
  };

  return (
    <div
      className={`${styles.content} ${isSelected ? styles.selected : ""}`} // Thêm class "selected" nếu item được chọn
      onClick={handleClick}
    >
      <Row style={{ cursor: "pointer" }}>
        {/* Ảnh đại diện */}
        <Col span={5}>
          <div className={styles["image-container"]}>
            <img
              className={styles["image"]}
              src={profilePictureUrl}
              alt={fullName}
            />
          </div>
        </Col>

        {/* Thông tin người dùng */}
        <Col span={19}>
          <Row className={styles["flex-between"]}>
            <span style={{ fontSize: "15px", fontWeight: 500, color: "black" }}>
              {fullName}
            </span>
            <span style={{ fontSize: "14px", fontWeight: 400, color: "#65686c" }}>
              {sentAt}
            </span>
          </Row>
          <Row className={styles["flex-between"]}>
            {/* Nút xác nhận */}
            <button className={styles["button"]}>Xác nhận</button>
            {/* Nút xóa */}
            <button
              className={`${styles["button"]} ${styles["delete-button"]}`}
            >
              Xóa
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FriendRequestItem;
