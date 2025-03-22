import React, { useState, useEffect } from "react";
import { Modal, Avatar, Input, Row, Col, Skeleton } from "antd";
import styles from "./CommentModal.module.scss"; // Import SCSS module
import Post from "../Components/Post";
import SharedPost from "../Components/SharedPost";
import { IoIosSend } from "react-icons/io";
import { addCommentService, getCommentService, countCommentService } from "../services/commentService";
import Comment from "../Pages/Photo/Components/Comment";

const CommentModal = ({
  type,
  userId,
  content,
  isModalOpen,
  onCancel,
  postId,
  images,
  userInfo,
  createdAt,
  shareId
}) => {
  const [commentText, setCommentText] = useState(""); // Biến duy nhất để lưu nội dung bình luận
  const [comments, setComments] = useState([]); // Lưu danh sách bình luận
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [commentCount, setCommentCount] = useState(0); // Đếm số lượng bình luận

  // Fetch comments and comment count
  const fetchCommentsAndCount = async () => {
    try {
      setLoading(true);
      const [commentResponse, countResponse] = await Promise.all([
        getCommentService(postId),
        countCommentService(postId),
      ]);
      setComments(commentResponse?.data?.data || []);
      setCommentCount(countResponse?.data?.data || 0);
    } catch (error) {
      console.error("Error fetching comments or count:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchCommentsAndCount();
    }
  }, [isModalOpen]);

  // Xử lý gửi bình luận
  const handleAddComment = async () => {
    if (!commentText.trim()) return; // Không gửi bình luận rỗng

    try {
      const newComment = {
        userId,
        postId,
        content: commentText.trim(),
      };
      await addCommentService(newComment);
      setCommentText(""); // Reset input
      fetchCommentsAndCount(); // Refresh comments and count
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width="700px"
      title={`${userInfo?.fullName || "Người dùng"}'s post`}
      className={styles.commentModal}
    >
      {/* Render bài post */}
      {type === "post" ? (
        <Post
          key={postId}
          postId={postId}
          content={content}
          createdAt={createdAt}
          userId={userId}
          images={images}
          isModalOpen={true}
        />
      ) : type === "sharedpost" ? (
        <SharedPost
          key={postId}
          postId={postId}
          content={content}
          createdAt={createdAt}
          userId={userId}
          images={images}
          shareId={shareId}
          isModalOpen={true}
        />
      ) : (
        <p>Loại bài viết không hợp lệ</p>
      )}

      {/* Section bình luận */}
      <div className={styles.commentsSection}>
        <h3>{`Bình luận (${commentCount})`}</h3>
        {loading ? (
          // Hiển thị Skeleton khi đang tải dữ liệu
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.skeletonComment}>
              <Skeleton.Avatar active size="small" style={{ marginRight: 10 }} />
              <Skeleton.Input active style={{ width: "80%" }} />
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.commentId}
              commentId={comment.commentId}
              content={comment.content}
              createdAt={comment.createdAt}
              userId={comment.userId}
              childComments={comment.childComments}
              postId={postId}
            />
          ))
        ) : (
          <p>Không có bình luận nào để hiển thị.</p>
        )}
      </div>

      {/* Section viết bình luận */}
      <div className={styles.writeCommentSection}>
        <Row>
          <Col span={2}>
            <Avatar
              src={userInfo?.profilePictureUrl || "https://via.placeholder.com/40"}
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
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Ngăn xuống dòng
                    handleAddComment(); // Gửi bình luận
                  }
                }}
              ></textarea>
              <IoIosSend
                className={styles["sendCommentButton"]}
                style={{
                  color: commentText.trim() ? "blue" : "gray",
                  cursor: commentText.trim() ? "pointer" : "not-allowed",
                }}
                onClick={handleAddComment}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default CommentModal;
