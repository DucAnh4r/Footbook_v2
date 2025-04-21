import React, { useState } from "react";
import { Button, Card } from "antd";
import styles from "./FriendRequestsList.module.scss";
import { acceptFriendshipService, declineFriendshipService } from "../../../services/friendService";

const FriendRequestsList = ({
  userId,
  requestsType,
  data,
  fetchFriendRequests,
}) => {
  const [visibleRequests, setVisibleRequests] = useState(10);

  const handleShowMore = () => {
    setVisibleRequests((prev) => prev + 10); // Hiển thị thêm 10 request
  };

  const handleAccept = async (requester_id, addressee_id) => {
    try {
      await acceptFriendshipService({
        requester_id: requester_id,
        addressee_id: addressee_id,
      });
      // Sau khi chấp nhận thành công, cập nhật lại danh sách
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDecline = async (requester_id, addressee_id) => {
    try {
      await declineFriendshipService({
        requester_id: requester_id,
        addressee_id: addressee_id,
      });
      await fetchFriendRequests();
    } catch (error) {
      console.error("Error decline friend request:", error);
    }
  };

  const getTitle = () => {
    return requestsType === "friendRequests"
      ? "Lời mời kết bạn"
      : "Những người bạn có thể biết";
  };

  const getRequests = () => {
    return data || []; // Dữ liệu mặc định nếu không truyền vào
  };

  const cardStyle = {
    width: "211px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
    marginBottom: "16px",
  };

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
          {requests.slice(0, visibleRequests).map((request, index) => (
            <Card
              key={index}
              style={cardStyle}
              bodyStyle={{ padding: "0" }}
              hoverable
            >
              <img
                src={request.image}
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
                      >
                        Xác nhận
                      </Button>

                      <Button
                        onClick={() =>
                          handleDecline(request.requesterId, userId)
                        }
                        className={styles.deleteButton}
                      >
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button type="primary" className={styles.addFriendButton}>
                        Thêm bạn bè
                      </Button>
                      <Button className={styles.removeButton}>Gỡ bỏ</Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
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
