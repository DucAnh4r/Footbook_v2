/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Avatar, Button, Dropdown, Menu, Tooltip, Modal } from "antd";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { FaEarthAmericas } from "react-icons/fa6";
import { BsThreeDots } from "react-icons/bs";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Services
import { 
  countPostReactionService, 
  getPostReactionService,
  deletePostReactionService, 
  addPostReactionService 
} from "../services/postReactionService";
import { countCommentService } from "../services/commentService";
import { DeletePostByIdService, getShareCount } from "../services/postService";

// Components and assets
import styles from "./Post.module.scss";
import CommentModal from "../Modal/CommentModal";
import ShareModal from "../Modal/ShareModal";
import ReactionIconsBox from "./ReactionIconsBox";

// Assets
import HahaIcon from "../assets/image/Reacts/haha.png";
import LikeIcon from "../assets/image/Reacts/like.png";
import LoveIcon from "../assets/image/Reacts/heart.png";
import SadIcon from "../assets/image/Reacts/sad.png";
import AngryIcon from "../assets/image/Reacts/angry.png";

// Utils
import { getUserIdFromLocalStorage } from "../utils/authUtils";
import { reactionConfig } from "../assets/Config";
import { toastError, toastSuccess } from "../utils/toastNotifier";

const Post = ({ content, createdAt, userId, images = [], postId, isModalOpen, user, onPostDeleted }) => {
  const navigate = useNavigate();
  const currentUserId = getUserIdFromLocalStorage();
  
  // Modal states
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  // Reaction states
  const [isReactionBoxVisible, setIsReactionBoxVisible] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState("NONE");
  
  // Data states
  const [reactions, setReactions] = useState([]);
  const [postReactionCount, setPostReactionCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get all reaction users - Memoized for performance
  const reactionUsers = useMemo(() => {
    return reactions
      .map((reaction) => reaction.user.name + " (" + reaction.type + ")")
      .join("<br />");
  }, [reactions]);

  // Get liked users - Memoized for performance
  const likedUsers = useMemo(() => {
    return reactions
      .filter((reaction) => reaction.type === "LIKE")
      .map((reaction) => reaction.user.name)
      .join("<br />");
  }, [reactions]);

  // Data fetching functions
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [reactionsResponse, commentCountResponse, shareCountResponse] = await Promise.all([
        getPostReactionService(postId),
        countCommentService(postId),
        getShareCount(postId)
      ]);
      
      setPostReactionCount(reactionsResponse?.data?.counts?.total || 0);
      setReactions(reactionsResponse?.data?.reactions || []);
      setCommentCount(commentCountResponse.total_comment_count || 0);
      setShareCount(shareCountResponse?.data?.share_count || 0);
      
      // Find user's current reaction
      const userReaction = reactionsResponse?.data?.reactions?.find(
        (reaction) => String(reaction.user_id) === String(currentUserId)
      );
      setSelectedReaction(userReaction ? userReaction.type : "NONE");
    } catch (error) {
      console.error("Error fetching post data:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, currentUserId]);
  
  // Load data on mount and when modals change
  useEffect(() => {
    fetchData();
  }, [fetchData, isCommentModalOpen]);
  
  // Handle reaction updates
  const handleReactionAdded = useCallback(async (reactionType) => {
    try {
      // Handle case when user clicks the same reaction or wants to remove reaction
      if (reactionType === "NONE" || reactionType === selectedReaction) {
        await deletePostReactionService({
          post_id: postId,
          user_id: currentUserId,
        });
        setSelectedReaction("NONE");
      } 
      // Handle adding a new reaction when none exists
      else if (selectedReaction === "NONE") {
        await addPostReactionService({
          post_id: postId,
          user_id: currentUserId,
          type: reactionType,
        });
        setSelectedReaction(reactionType);
      } 
      // Handle changing from one reaction to another
      else {
        await deletePostReactionService({
          post_id: postId,
          user_id: currentUserId,
        });
        await addPostReactionService({
          post_id: postId,
          user_id: currentUserId,
          type: reactionType,
        });
        setSelectedReaction(reactionType);
      }
      
      // Refresh data after reaction changes
      fetchData();
      setIsReactionBoxVisible(false);
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  }, [postId, currentUserId, selectedReaction, fetchData]);
  
  // Handle like button click - simplified
  const handleLikeButtonClick = useCallback(async () => {
    // Toggle LIKE reaction
    handleReactionAdded(selectedReaction !== "NONE" ? "NONE" : "LIKE");
  }, [selectedReaction, handleReactionAdded]);
  
  // Handle post deletion
  const handleDeletePost = useCallback(async () => {
    setDeleteLoading(true);
    try {
      const response = await DeletePostByIdService(postId, currentUserId);
      if (response?.status === 200 && response?.data?.message) {
        toastSuccess("Xóa bài viết thành công!");
        setIsDeleteConfirmOpen(false);
        // Gọi callback để thông báo cho Homepage
        onPostDeleted(postId);
      } else {
        toastError("Không thể xóa bài viết. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      toastError("Đã xảy ra lỗi khi xóa bài viết.");
    } finally {
      setDeleteLoading(false);
    }
  }, [postId, currentUserId, onPostDeleted]);
  
  // Navigate to photo detail page
  const handleImageClick = useCallback((id) => {
    if (deleteLoading) return; // Prevent navigation during deletion
    navigate(`/photo/${id}`);
  }, [navigate, deleteLoading]);

  // Show delete confirmation
  const showDeleteConfirm = useCallback(() => {
    setIsDeleteConfirmOpen(true);
  }, []);

  return (
    <>
      <ToastContainer />
      <div className={styles.postContainer}>
        {/* Post Header */}
        <div className={styles.header}>
          <Avatar src={user?.avatar_url} className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name}</span>
            <span className={styles.time}>
              {new Date(createdAt).toLocaleString()} ·{" "}
              <FaEarthAmericas style={{ marginLeft: "4px" }} />
            </span>
          </div>
          
          {/* Post options menu - only show for post owner */}
          {userId === currentUserId ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={showDeleteConfirm} disabled={deleteLoading}>
                    Xóa bài viết
                  </Menu.Item>
                  <Menu.Item key="2" onClick={() => console.log("Edit post clicked")} disabled={deleteLoading}>
                    Chỉnh sửa bài viết
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
              disabled={deleteLoading}
            >
              <div className={styles.optionContainer}>
                <BsThreeDots />
              </div>
            </Dropdown>
          ) : (
            <div className={styles.optionContainer}>
              <BsThreeDots />
            </div>
          )}
        </div>

        {/* Post Content */}
        <div className={styles.content}>
          <p style={{ margin: "0" }}>{content}</p>

          {/* Images Display */}
          {images.length > 0 && (
            <div className={styles.imageGrid}>
              {(isModalOpen ? images : images.slice(0, 2)).map((image, index) => (
                <img
                  key={index}
                  src={image.image_url}
                  alt={`post-image-${index}`}
                  className={styles.mainImage}
                  onClick={() => handleImageClick(postId)}
                  loading="lazy" // Lazy loading for better performance
                  style={{ pointerEvents: deleteLoading ? "none" : "auto" }}
                />
              ))}
            </div>
          )}

          {/* View All Images Button */}
          {!isModalOpen && images.length >= 3 && (
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className={styles.viewMoreButton}
              disabled={deleteLoading}
            >
              Xem tất cả
            </button>
          )}
        </div>

        {/* Reactions Summary */}
        <div className={styles.reactionsContainer}>
          <div className={styles["reactions"]}>
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: likedUsers }} />} arrow>
              <img
                src={LikeIcon}
                alt="Like"
                className={`${styles["icon"]} ${styles["icon-1"]}`}
              />
            </Tooltip>
            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: likedUsers }} />} arrow>
              <img
                src={HahaIcon}
                alt="Haha"
                className={`${styles["icon"]} ${styles["icon-2"]}`}
              />
            </Tooltip>
          </div>
          
          {/* Reaction counts and comments/shares summary */}
          <Tooltip title={<span dangerouslySetInnerHTML={{ __html: reactionUsers }} />} arrow>
            <span className={styles.reactionCount}>{postReactionCount}</span>
          </Tooltip>
          
          <div className={styles.rightFooter}>
            <span className={styles.cmtCount} style={{ marginRight: "10px" }}>
              {commentCount} bình luận
            </span>
            <span className={styles.shareCount}>{shareCount} lượt chia sẻ</span>
          </div>
        </div>

        {/* Post Actions Footer */}
        <div className={styles.footer}>
          {/* Like Button with Reaction Hover Box */}
          <div 
            className={styles.reactionButtonContainer}
            onMouseEnter={() => !deleteLoading && setIsReactionBoxVisible(true)}
            onMouseLeave={() => setIsReactionBoxVisible(false)}
          >
            <Button
              icon={reactionConfig[selectedReaction].icon}
              type="text"
              className={styles.likeButtonWrapper}
              onClick={handleLikeButtonClick}
              style={{
                color: reactionConfig[selectedReaction].color,
              }}
              disabled={deleteLoading}
            >
              {reactionConfig[selectedReaction].text}
            </Button>

            {/* Reaction Selection Box */}
            {isReactionBoxVisible && (
              <div
                className={styles.reactionBoxWrapper}
                style={{
                  position: "absolute",
                  left: "0px",
                  bottom: "0px",
                }}
              >
                <ReactionIconsBox
                  postId={postId}
                  onReactionAdded={handleReactionAdded}
                  currentReaction={selectedReaction}
                />
              </div>
            )}
          </div>

          {/* Comment Button */}
          <Button
            icon={<FaRegComment />}
            type="text"
            onClick={() => {
              if (!isModalOpen && !deleteLoading) {
                setIsCommentModalOpen(true);
              }
            }}
            disabled={deleteLoading}
          >
            Bình luận
          </Button>

          {/* Share Button */}
          <Button
            icon={<PiShareFat />}
            type="text"
            onClick={() => !deleteLoading && setIsShareModalOpen(true)}
            disabled={deleteLoading}
          >
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa bài viết"
        open={isDeleteConfirmOpen}
        onOk={handleDeletePost}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        confirmLoading={deleteLoading}
        okButtonProps={{ danger: true, disabled: deleteLoading }}
        cancelButtonProps={{ disabled: deleteLoading }}
        closable={!deleteLoading}
        maskClosable={!deleteLoading}
      >
        <p>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
      </Modal>

      {/* Other Modals */}
      {isCommentModalOpen && (
        <CommentModal
          type="post"
          userId={userId}
          content={content}
          isModalOpen={isCommentModalOpen}
          onCancel={() => setIsCommentModalOpen(false)}
          postId={postId}
          userInfo={user}
          images={images}
          createdAt={createdAt}
        />
      )}
      
      {isShareModalOpen && (
        <ShareModal
          isModalOpen={isShareModalOpen}
          onCancel={() => setIsShareModalOpen(false)}
          postId={postId}
          userInfo={user}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </>
  );
};

export default React.memo(Post);