import React, { useEffect, useState } from "react";
import { Row, Col, Avatar, Button, Input } from "antd";
import styles from "./Comment.module.scss";
import { userFindByIdService } from "../../../services/userService";
import { addCommentService } from "../../../services/commentService"; // Import API gửi bình luận

const { TextArea } = Input;

const Comment = ({ content, createdAt, userId, childComments = [], commentId, postId }) => {
  const [userInfo, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReplies, setShowReplies] = useState(false); // Hiển thị comment con
  const [showReplyInput, setShowReplyInput] = useState(false); // Hiển thị ô input phản hồi
  const [replyContent, setReplyContent] = useState(""); // Nội dung phản hồi

  const fetchUser = async () => {
    try {
      const response = await userFindByIdService(userId);
      setUserInfo(response?.data?.user || {});
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Hàm gửi phản hồi
  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const newComment = {
        postId: postId,
        userId: userId, 
        parentCommentId: commentId, 
        content: replyContent,
      };

      await addCommentService(newComment);
      setReplyContent("");
      setShowReplyInput(false);
      console.log("Phản hồi thành công!");
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  return (
    <div className={styles.commentContainer}>
      {/* Comment chính */}
      <Row className={styles["container"]}>
        <Col className={styles["avatar-col"]} span={4}>
          <Avatar src={userInfo.avatar_url} className={styles.avatar} />
        </Col>
        <Col span={18}>
          <div className={styles["comment-box"]}>
            <p className={styles["name"]}>{userInfo.name}</p>
            <p>{content}</p>
          </div>
          <div className={styles["option-box"]}>
            <p>{createdAt}</p>
            <p>Thích</p>
            <p onClick={() => setShowReplyInput((prev) => !prev)} style={{ cursor: "pointer" }}>
              Phản hồi
            </p>
          </div>

          {/* Input phản hồi */}
          {showReplyInput && (
            <div className={styles["reply-input"]}>
              <TextArea
                rows={1}
                value={replyContent}
                placeholder="Viết phản hồi..."
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <Button type="primary" onClick={handleReply} style={{ marginTop: "5px" }}>
                Gửi
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* Nút Xem thêm */}
      {childComments.length > 0 && !showReplies && (
        <div className={styles["show-more"]}>
          <Button type="link" onClick={() => setShowReplies(true)}>
            Xem thêm {childComments.length} phản hồi
          </Button>
        </div>
      )}

      {/* Render comment con đệ quy */}
      {showReplies && (
        <div className={styles["child-comments"]}>
          {childComments.map((child) => (
            <Comment
              key={child.commentId}
              commentId={child.commentId}
              content={child.content}
              createdAt={child.createdAt}
              userId={child.userId}
              childComments={child.childComments}
              postId={postId} // Truyền ID bài viết
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
