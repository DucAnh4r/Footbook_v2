import React from "react";
import styles from "./FriendRequestItem.module.scss";
import { Row, Col } from "antd";
import {
  acceptFriendshipService,
  declineFriendshipService,
} from "../../../services/friendService";

const FriendRequestItem = ({
  userId,
  user,
  onSelectUser,
  isSelected,
  fetchFriendRequests,
}) => {
  const { senderId, fullName, profilePictureUrl, sentAt } = user;

  const handleClick = () => {
    if (onSelectUser) {
      onSelectUser(senderId);
    }
  };

  const handleAccept = async (e, requester_id, addressee_id) => {
    e.stopPropagation(); // Chặn lan sự kiện
    try {
      await acceptFriendshipService({
        requester_id,
        addressee_id,
      });
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (e, requester_id, addressee_id) => {
    e.stopPropagation(); // Chặn lan sự kiện
    try {
      await declineFriendshipService({
        requester_id,
        addressee_id,
      });
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error decline friend request:", error);
    }
  };

  return (
    <div
      className={`${styles.content} ${isSelected ? styles.selected : ""}`}
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
            <span
              style={{ fontSize: "14px", fontWeight: 400, color: "#65686c" }}
            >
              {sentAt}
            </span>
          </Row>
          <Row className={styles["flex-between"]}>
            <button
              onClick={(e) => handleAccept(e, user.senderId, userId)}
              className={styles["button"]}
            >
              Xác nhận
            </button>
            <button
              onClick={(e) => handleDecline(e, user.senderId, userId)}
              className={`${styles["button"]} ${styles["delete-button"]}`}
            >
              Từ chối
            </button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FriendRequestItem;
