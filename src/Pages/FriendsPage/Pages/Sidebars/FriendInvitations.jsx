import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import styles from "./FriendInvitations.module.scss";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FriendRequestItem from "../../Components/FriendRequestItem";
import { getFriendshipRequestService } from "../../../../services/friendService";
import { getUserIdFromLocalStorage } from "../../../../utils/authUtils";
import SentFriendRequestsModal from "../../Components/SentFriendRequestsModal";

const FriendInvitations = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSentModal, setShowSentModal] = useState(false);
  const navigate = useNavigate();

  const userId2 = getUserIdFromLocalStorage();

  const handleBack = () => {
    navigate("/friends");
  };

  const handleSelectUser = (senderId) => {
    setSelectedUserId(senderId);
    if (onSelectUser) {
      onSelectUser(senderId);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await getFriendshipRequestService({
        user_id: userId2,
      });
      if (response.data?.received_requests) {
        const formattedData = response.data.received_requests.map((item) => ({
          senderId: item.requester.id,
          fullName: item.requester.name,
          profilePictureUrl: item.requester.avatar_url,
          coverPhotoUrl: item.requester.cover_photo_url,
          birthYear: item.requester.birth_year,
          profession: item.requester.profession,
          address: item.requester.address,
          status: item.status,
          sentAt: new Date(item.requester.created_at).toLocaleDateString(
            "vi-VN"
          ), // định dạng ngày
        }));
        setUsers(formattedData);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <span onClick={() => setShowSentModal(true)}>Xem lời mời đã gửi</span>
      </Row>
      <Row style={{ marginTop: "16px" }}>
        {loading ? (
          <span>Đang tải...</span>
        ) : (
          users.map((user) => (
            <FriendRequestItem
              userId={userId2}
              key={user.senderId}
              user={user}
              onSelectUser={handleSelectUser}
              isSelected={user.senderId === selectedUserId}
              fetchFriendRequests={fetchFriendRequests}
            />
          ))
        )}
      </Row>

      <SentFriendRequestsModal
        visible={showSentModal}
        onClose={() => setShowSentModal(false)}
      />
    </>
  );
};

export default FriendInvitations;
