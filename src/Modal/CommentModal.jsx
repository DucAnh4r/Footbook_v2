import React from "react";
import { Modal } from "antd";
import styles from "./CommentModal.module.scss";

// Components
import Post from "../Components/Post";
import SharedPost from "../Components/SharedPost";
import CommentSection from "../Components/Comment/CommentSection";

const CommentModal = ({
  type,
  userId,
  content,
  isModalOpen,
  onCancel,
  postId,
  images = [],
  userInfo,
  createdAt,
  shareId
}) => {
  // Determine which post component to render based on type
  const renderPostComponent = () => {
    const commonProps = {
      key: postId,
      postId,
      content,
      createdAt,
      userId,
      images,
      isModalOpen: true,
      user: userInfo,
    };

    switch (type) {
      case "post":
        return <Post {...commonProps} />;
      case "sharedpost":
        return <SharedPost {...commonProps} shareId={shareId} />;
      default:
        return <p>Loại bài viết không hợp lệ</p>;
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width="700px"
      title={`${userInfo?.name || "Người dùng"}'s post`}
      className={styles.commentModal}
      destroyOnClose={true} // Clean up on close for better performance
    >
      {/* Post Content */}
      {renderPostComponent()}

      {/* Comments Section */}
      <CommentSection
        postId={postId}
        userId={userId}
        userInfo={userInfo}
        isModalOpen={isModalOpen}
      />
    </Modal>
  );
};

export default React.memo(CommentModal);