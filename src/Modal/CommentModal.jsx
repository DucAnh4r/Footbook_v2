import React, { useState, useEffect, useCallback } from "react";
import { Modal, Avatar, Row, Col, Skeleton } from "antd";
import { IoIosSend } from "react-icons/io";
import styles from "./CommentModal.module.scss";

// Components
import Post from "../Components/Post";
import SharedPost from "../Components/SharedPost";
import Comment from "../Pages/Photo/Components/Comment";

// Services
import { 
  addCommentService, 
  getCommentService, 
  countCommentService 
} from "../services/commentService";

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
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch comments and count in a single function
  const fetchCommentsAndCount = useCallback(async () => {
    if (!postId || !isModalOpen) return;
    
    try {
      setLoading(true);
      // Use Promise.all for parallel requests
      const [commentResponse, countResponse] = await Promise.all([
        getCommentService(postId),
        countCommentService(postId),
      ]);
      
      // Set data with safe fallbacks
      setComments(commentResponse?.data?.comments || []);
      setCommentCount(countResponse || 0);
    } catch (error) {
      console.error("Error fetching comments or count:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, isModalOpen]);

  // Fetch data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchCommentsAndCount();
    }
  }, [isModalOpen, fetchCommentsAndCount]);

  // Handle comment submission
  const handleAddComment = useCallback(async () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment) return;

    try {
      await addCommentService({
        userId,
        postId,
        content: trimmedComment,
      });
      
      setCommentText(""); // Clear input field
      fetchCommentsAndCount(); // Refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  }, [commentText, userId, postId, fetchCommentsAndCount]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  }, [handleAddComment]);

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
      <div className={styles.commentsSection}>
        <h3>{`Bình luận (${commentCount})`}</h3>
        
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.skeletonComment}>
              <Skeleton.Avatar active size="small" style={{ marginRight: 10 }} />
              <Skeleton.Input active style={{ width: "80%" }} />
            </div>
          ))
        ) : comments.length > 0 ? (
          // Comments list
          comments.map((comment) => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              content={comment.content}
              createdAt={comment.created_at}
              userId={comment.user.id}
              childComments={comment.childComments}
              postId={postId}
            />
          ))
        ) : (
          <p>Không có bình luận nào để hiển thị.</p>
        )}
      </div>

      {/* Comment Input Section */}
      <div className={styles.writeCommentSection}>
        <Row>
          <Col span={2}>
            <Avatar
              src={userInfo?.avatar_url || "https://via.placeholder.com/40"}
              className={styles.avatar}
            />
          </Col>
          <Col span={22}>
            <div className={styles.writeCommentContainer}>
              <textarea
                style={{ overflow: 'hidden', height: '100%' }}
                placeholder="Viết bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <IoIosSend
                className={styles.sendCommentButton}
                style={{
                  color: commentText.trim() ? "blue" : "gray",
                  cursor: commentText.trim() ? "pointer" : "not-allowed",
                }}
                onClick={handleAddComment}
                aria-label="Send comment"
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default React.memo(CommentModal);