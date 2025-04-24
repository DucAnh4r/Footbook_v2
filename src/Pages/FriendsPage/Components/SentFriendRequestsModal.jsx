/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button } from "antd";
import styles from "./SentFriendRequestsModal.module.scss";
import { deleteFriendshipService, getSentFriendRequestsService } from "../../../services/friendService";
import { getUserIdFromLocalStorage } from "../../../utils/authUtils";

const SentFriendRequestsModal = ({ visible, onClose }) => {
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = getUserIdFromLocalStorage();

  const fetchSentRequests = async () => {
    setLoading(true);
    try {
      const response = await getSentFriendRequestsService({ user_id: userId });
      const sent = response.data?.sent_requests || [];

      const formatted = sent.map(item => ({
        id: item.addressee.id,
        name: item.addressee.name,
        avatar: item.addressee.avatar_url,
        mutualFriends: item.mutual_friends_count || 0,
      }));

      setSentRequests(formatted);
    } catch (err) {
      console.error("Failed to fetch sent requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (friendId) => {
    try {
      await deleteFriendshipService({ user_id: userId, friend_id: friendId });
      fetchSentRequests();
    } catch (err) {
      console.error("Failed to cancel request:", err);
    }
  };

  useEffect(() => {
    if (visible) fetchSentRequests();
  }, [visible]);

  return (
    <Modal
      title="Sent requests"
      visible={visible}
      onCancel={onClose}
      footer={null}
      className={styles.sentModal}
    >
      <p>{sentRequests.length} sent requests</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        sentRequests.map(user => (
          <div key={user.id} className={styles.requestItem}>
            <div className={styles.leftInfo}>
              <img src={user.avatar} alt={user.name} className={styles.avatar} />
              <div>
                <p>{user.name}</p>
                {user.mutualFriends > 0 && (
                  <p className={styles.mutual}>🔗 {user.mutualFriends} mutual friends</p>
                )}
              </div>
            </div>
            <Button onClick={() => handleCancelRequest(user.id)}>Cancel request</Button>
          </div>
        ))
      )}
    </Modal>
  );
};

export default SentFriendRequestsModal;
