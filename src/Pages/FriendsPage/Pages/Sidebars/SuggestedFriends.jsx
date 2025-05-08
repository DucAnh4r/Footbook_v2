import React from "react";
import { Row, Col, Spin, Empty } from "antd";
import styles from "./SuggestedFriends.module.scss";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FriendRequestItem from "../../Components/FriendRequestItem";
import { getUserIdFromLocalStorage } from "../../../../utils/authUtils";

const SuggestedFriends = ({ 
  users = [], 
  onSelectUser, 
  selectedUserId, 
  loading = false,
  fetchSuggestedFriends
}) => {
  const navigate = useNavigate();
  const currentUserId = getUserIdFromLocalStorage();
  
  const handleBack = () => {
    navigate("/friends");
  };

  const handleSelectUser = (userId) => {
    if (onSelectUser) {
      onSelectUser(userId);
    }
  };

  return (
    <div className={styles.container}>
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
      
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      ) : (
        <Row className={styles.friendsContainer}>
          {users.length > 0 ? (
            users.map((user) => (
              <FriendRequestItem
                key={user.id}
                userId={currentUserId}
                user={user}
                onSelectUser={handleSelectUser}
                isSelected={user.id === selectedUserId}
                itemType="suggested"
                fetchFriendRequests={fetchSuggestedFriends}
              />
            ))
          ) : (
            <Empty 
              description="Không có gợi ý bạn bè"
              className={styles.emptyState}
            />
          )}
        </Row>
      )}
    </div>
  );
};

export default SuggestedFriends;