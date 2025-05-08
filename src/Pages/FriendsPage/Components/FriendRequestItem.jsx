/* eslint-disable no-unused-vars */
import React from "react";
import styles from "./FriendRequestItem.module.scss";
import { Row, Col, Button } from "antd";
import {
  acceptFriendshipService,
  declineFriendshipService,
  createFriendshipService,
} from "../../../services/friendService";
import { getUserIdFromLocalStorage } from "../../../utils/authUtils";

const FriendRequestItem = ({
  userId,
  user,
  onSelectUser,
  isSelected,
  fetchFriendRequests,
  itemType = "request" // 'request' or 'suggested'
}) => {
  const currentUserId = getUserIdFromLocalStorage();
  
  // Handle different user object structures based on itemType
  const id = user.id || user.senderId;
  const name = user.name || user.fullName;
  const profileImage = user.avatar_url || user.image || user.profilePictureUrl || "https://via.placeholder.com/150";
  
  // Format date if available
  const createdAt = user.created_at || user.sentAt;
  const formattedDate = createdAt;

  const handleClick = () => {
    if (onSelectUser) {
      onSelectUser(id);
    }
  };

  const handleAccept = async (e) => {
    e.stopPropagation(); // Prevent event propagation
    try {
      await acceptFriendshipService({
        requester_id: id,
        addressee_id: currentUserId,
      });
      if (fetchFriendRequests) {
        await fetchFriendRequests();
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (e) => {
    e.stopPropagation(); // Prevent event propagation
    try {
      await declineFriendshipService({
        requester_id: id,
        addressee_id: currentUserId,
      });
      if (fetchFriendRequests) {
        await fetchFriendRequests();
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  const handleSendRequest = async (e) => {
    e.stopPropagation(); // Prevent event propagation
    try {
      await createFriendshipService({
        requester_id: currentUserId,
        addressee_id: id,
      });
      if (fetchFriendRequests) {
        await fetchFriendRequests();
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div
      className={`${styles.content} ${isSelected ? styles.selected : ""}`}
      onClick={handleClick}
    >
      <Row align="middle" style={{ cursor: "pointer" }}>
        {/* Profile image */}
        <Col span={5}>
          <div className={styles["image-container"]}>
            <img
              className={styles["image"]}
              src={profileImage}
              alt={name}
            />
          </div>
        </Col>

        {/* User information */}
        <Col span={19}>
          <Row className={styles["flex-between"]}>
            <span className={styles["name"]}>{name}</span>
            {itemType === "request" ? (
              <span className={styles["date"]}>{formattedDate}</span>
            ) : (
              <span className={styles["mutual-friends"]}>
                {user.mutual_friends_count} bạn chung
              </span>
            )}
          </Row>
          
          <Row className={styles["flex-between"]} style={{ marginTop: '8px' }}>
            {itemType === "request" ? (
              <>
                <Button
                  onClick={handleAccept}
                  className={`${styles["button"]} ${styles["confirm-button"]}`}
                  type="primary"
                >
                  Xác nhận
                </Button>
                <Button
                  onClick={handleDecline}
                  className={`${styles["button"]} ${styles["delete-button"]}`}
                >
                  Từ chối
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSendRequest}
                className={`${styles["button"]} ${styles["add-button"]}`}
                type="primary"
              >
                Thêm bạn bè
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default FriendRequestItem;