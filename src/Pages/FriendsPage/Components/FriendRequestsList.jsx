import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import styles from "./FriendRequestsList.module.scss";
import { acceptFriendshipService, declineFriendshipService } from "../../../services/friendService";

const FriendRequestsList = ({
  userId,
  requestsType,
  data,
  fetchFriendRequests,
  loading = false,
  onSendRequest,
  onRemoveSuggestion
}) => {
  const [visibleRequests, setVisibleRequests] = useState(10);
  const [processingIds, setProcessingIds] = useState([]); // Track IDs that are being processed

  const handleShowMore = () => {
    setVisibleRequests((prev) => prev + 10);
  };

  const handleAccept = async (requester_id, addressee_id) => {
    try {
      setProcessingIds(prev => [...prev, requester_id]);
      await acceptFriendshipService({
        requester_id: requester_id,
        addressee_id: addressee_id,
      });
      // Sau khi chấp nhận thành công, cập nhật lại danh sách
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requester_id));
    }
  };

  const handleDecline = async (requester_id, addressee_id) => {
    try {
      setProcessingIds(prev => [...prev, requester_id]);
      await declineFriendshipService({
        requester_id: requester_id,
        addressee_id: addressee_id,
      });
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error declining friend request:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== requester_id));
    }
  };

  const handleSendRequest = async (friendId) => {
    try {
      setProcessingIds(prev => [...prev, friendId]);
      await onSendRequest(friendId);
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== friendId));
    }
  };

  const handleRemoveSuggestion = (friendId) => {
    onRemoveSuggestion(friendId);
  };

  const getTitle = () => {
    return requestsType === "friendRequests"
      ? "Lời mời kết bạn"
      : "Những người bạn có thể biết";
  };

  const getRequests = () => {
    return data || [];
  };

  const cardStyle = {
    width: "211px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    marginBottom: "16px",
  };

  // Kiểm tra nếu đang loading
  if (loading) {
    return (
      <div className={styles.friendRequestsContainer}>
        <h2 style={{ marginTop: "40px" }}>{getTitle()}</h2>
        <div className={styles.loadingContainer}>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Kiểm tra nếu không có request nào và hiển thị thông báo theo requestsType
  const renderContent = () => {
    const requests = getRequests();
    if (requests.length === 0) {
      // Kiểm tra requestsType và hiển thị thông báo phù hợp
      const noRequestsMessage =
        requestsType === "friendRequests"
          ? "Không có lời mời kết bạn nào"
          : "Chưa có gợi ý kết bạn";
      return <p className={styles.noRequests}>{noRequestsMessage}</p>;
    }

    return (
      <>
        <div className={styles.friendRequestsList}>
          {requests.slice(0, visibleRequests).map((request) => {
            const isProcessing = processingIds.includes(
              requestsType === "friendRequests" ? request.requesterId : request.id
            );
            
            return (
              <Card
                key={requestsType === "friendRequests" ? request.requesterId : request.id}
                style={cardStyle}
                bodyStyle={{ padding: "0" }}
                hoverable
              >
                <img
                  src={request.image || "/default-avatar.png"}
                  alt={request.name}
                  className={styles.friendImage}
                />
                <div className={styles.friendDetails}>
                  <h3 className={styles.name}>{request.name}</h3>
                  {request.mutualFriends !== undefined && (
                    <p className={styles.mutualFriends}>
                      {request.mutualFriends} bạn chung
                    </p>
                  )}
                  <div className={styles.buttons}>
                    {requestsType === "friendRequests" ? (
                      <>
                        <Button
                          onClick={() =>
                            handleAccept(request.requesterId, userId)
                          }
                          type="primary"
                          className={styles.confirmButton}
                          loading={isProcessing}
                          disabled={isProcessing}
                        >
                          Xác nhận
                        </Button>

                        <Button
                          onClick={() =>
                            handleDecline(request.requesterId, userId)
                          }
                          className={styles.deleteButton}
                          loading={isProcessing}
                          disabled={isProcessing}
                        >
                          Từ chối
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          type="primary" 
                          className={styles.addFriendButton}
                          onClick={() => handleSendRequest(request.id)}
                          loading={isProcessing}
                          disabled={isProcessing}
                        >
                          Thêm bạn bè
                        </Button>
                        <Button 
                          className={styles.removeButton}
                          onClick={() => handleRemoveSuggestion(request.id)}
                          disabled={isProcessing}
                        >
                          Gỡ bỏ
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        {visibleRequests < requests.length && (
          <Button
            onClick={handleShowMore}
            className={styles.seeMoreButton}
            type="link"
          >
            Xem thêm
          </Button>
        )}
      </>
    );
  };

  return (
    <div className={styles.friendRequestsContainer}>
      <h2 style={{ marginTop: "40px" }}>{getTitle()}</h2>
      {renderContent()}
    </div>
  );
};

export default FriendRequestsList;