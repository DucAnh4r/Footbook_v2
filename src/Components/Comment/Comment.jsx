/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { Row, Col, Avatar, Button, Input } from "antd";
import styles from "./Comment.module.scss";
import { userFindByIdService } from "../../services/userService";
import { replyToCommentService, getCommentRepliesService } from "../../services/commentService";

const { TextArea } = Input;

// Cache for user info and replies to avoid repeated API calls
const userCache = new Map();
const replyCache = new Map();

const Comment = ({ content, createdAt, userId, commentId, postId, isParentComment = false }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [visibleReplies, setVisibleReplies] = useState(0); // Start with 0 to hide replies initially
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [totalReplies, setTotalReplies] = useState(0);
  const [error, setError] = useState(null);

  // Fetch user info with caching
  const fetchUser = useCallback(async () => {
    if (!userId) {
      console.warn("Skipping fetchUser: userId is missing");
      setLoading(false);
      return;
    }

    if (userCache.has(userId)) {
      console.log("Using cached user info for userId:", userId);
      setUserInfo(userCache.get(userId));
      setLoading(false);
      return;
    }

    try {
      const response = await userFindByIdService(userId);
      const userData = response?.data?.user || {};
      userCache.set(userId, userData);
      setUserInfo(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user info.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch replies for this comment with caching
  const fetchReplies = useCallback(async () => {
    if (!commentId) {
      console.warn("Skipping fetchReplies: commentId is missing", { commentId });
      setError("Invalid comment ID.");
      return;
    }

    if (replyCache.has(commentId)) {
      console.log("Using cached replies for commentId:", commentId);
      const cachedData = replyCache.get(commentId);
      setReplies(cachedData.replies);
      setTotalReplies(cachedData.total);
      return;
    }

    try {
      setRepliesLoading(true);
      setError(null);
      console.log("Fetching replies for commentId:", commentId);
      const response = await getCommentRepliesService(commentId);
      const fetchedReplies = response?.data?.replies || [];
      const replyCount = response?.data?.total || fetchedReplies.length;
      console.log("Fetched replies:", fetchedReplies, "Total:", replyCount);
      setReplies(fetchedReplies);
      setTotalReplies(replyCount);
      replyCache.set(commentId, { replies: fetchedReplies, total: replyCount });
    } catch (error) {
      console.error("Error fetching replies:", error);
      setError("Failed to load replies.");
      setReplies([]);
      setTotalReplies(0);
    } finally {
      setRepliesLoading(false);
    }
  }, [commentId]);

  // Fetch user and replies (for parent comments only)
  useEffect(() => {
    fetchUser();
    if (isParentComment) {
      fetchReplies();
    }
  }, [fetchUser, fetchReplies, isParentComment]);

  // Handle reply submission
  const handleReply = useCallback(async () => {
    if (!replyContent.trim()) {
      console.log("Reply submission skipped: empty content");
      return;
    }

    if (!userId || !postId) {
      console.warn("Cannot submit reply: missing userId or postId", { userId, postId });
      setError("Please log in to reply.");
      return;
    }

    try {
      console.log("Submitting reply for commentId:", commentId, "postId:", postId, "userId:", userId);
      await replyToCommentService({
        postId,
        userId,
        parentCommentId: commentId,
        content: replyContent,
      });
      setReplyContent("");
      setShowReplyInput(false);
      replyCache.delete(commentId);
      await fetchReplies();
      console.log("Reply submitted successfully!");
    } catch (error) {
      console.error("Error replying to comment:", error);
      setError("Failed to submit reply. Please try again.");
    }
  }, [replyContent, userId, postId, commentId, fetchReplies]);

  // Handle showing replies
  const handleShowReplies = useCallback(() => {
    setVisibleReplies((prev) => (prev === 0 ? 10 : prev + 10));
  }, []);

  // Slice visible replies
  const displayedReplies = useMemo(() => replies.slice(0, visibleReplies), [replies, visibleReplies]);
  const remainingReplies = totalReplies - displayedReplies.length;

  // Memoized loading state for skeleton
  const isLoading = loading || !userInfo.name;

  return (
    <div className={styles.commentContainer}>
      {isLoading ? (
        <Row className={styles.container}>
          <Col className={styles.avatarCol} span={4}>
            <Avatar className={styles.avatar} />
          </Col>
          <Col className={styles.contentCol} span={20}>
            <div className={styles.commentBox}>
              <p className={styles.name}>Loading...</p>
              <p>{content}</p>
            </div>
          </Col>
        </Row>
      ) : (
        <>
          <Row className={styles.container}>
            <Col className={styles.avatarCol} span={4}>
              <Avatar src={userInfo.avatar_url} className={styles.avatar} />
            </Col>
            <Col className={styles.contentCol} span={20}>
              <div className={styles.commentBox}>
                <p className={styles.name}>{userInfo.name || "Unknown User"}</p>
                <p>{content}</p>
              </div>
              <div className={styles.optionBox}>
                <p>{createdAt}</p>
                <p>Like</p>
                <p
                  onClick={() => setShowReplyInput((prev) => !prev)}
                  className={styles.replyLink}
                >
                  Reply
                </p>
              </div>

              {showReplyInput && (
                <div className={styles.replyInput}>
                  <div className={styles.replyInputContainer}>
                    <TextArea
                      rows={1}
                      value={replyContent}
                      placeholder="Nhập trả lời bình luận..."
                      onChange={(e) => setReplyContent(e.target.value)}
                      className={styles.replyTextarea}
                    />
                    <Button
                      type="primary"
                      onClick={handleReply}
                      className={styles.replyButton}
                      disabled={!replyContent.trim() || !userId}
                    >
                      Gửi
                    </Button>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          {error && <p className={styles.error}>{error}</p>}

          {isParentComment && totalReplies > 0 && visibleReplies === 0 && (
            <Button
              type="link"
              onClick={handleShowReplies}
              className={styles.viewRepliesButton}
            >
              View {totalReplies} {totalReplies === 1 ? "reply" : "replies"}
            </Button>
          )}

          {isParentComment && displayedReplies.length > 0 && (
            <div className={styles.childComments}>
              {repliesLoading ? (
                <p className={styles.loadingText}>Loading replies...</p>
              ) : (
                <>
                  {displayedReplies.map((reply) => (
                    <Row key={reply.id} className={styles.replyContainer}>
                      <Col className={styles.replyAvatarCol} span={4}>
                        <Avatar
                          src={reply.user?.avatar_url}
                          className={styles.replyAvatar}
                        />
                      </Col>
                      <Col className={styles.contentCol} span={20}>
                        <div className={styles.replyBox}>
                          <p className={styles.replyName}>{reply.user?.name || "Unknown User"}</p>
                          <p>{reply.content}</p>
                        </div>
                        <div className={styles.replyOptions}>
                          <p>{reply.created_at}</p>
                          <p>Like</p>
                        </div>
                      </Col>
                    </Row>
                  ))}
                  {remainingReplies > 0 && (
                    <Button
                      type="link"
                      onClick={handleShowReplies}
                      className={styles.viewRepliesButton}
                    >
                      View {remainingReplies} more {remainingReplies === 1 ? "reply" : "replies"}
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(Comment);