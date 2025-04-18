import React from "react";
import styles from "./FriendItem.module.scss";
import { Row, Col } from "antd";

const FriendItem = ({ user, onSelectUser, isSelected }) => {
  const { id, name, avatar_url } = user;

  const handleClick = () => {
    if (onSelectUser) {
      onSelectUser(id); // Gọi hàm onSelectUser với id của người dùng
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
              src={avatar_url || "default-avatar-url"} // Nếu avatarUrl là null, hiển thị ảnh mặc định
              alt={name}
            />
          </div>
        </Col>

        {/* Thông tin người dùng */}
        <Col span={19}>
          <Row className={styles["flex-between"]}>
            <span style={{ fontSize: "16px", marginTop: '8px', fontWeight: 500, color: "black" }}>
              {name}
            </span>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FriendItem;
