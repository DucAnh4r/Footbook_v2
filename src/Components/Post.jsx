import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Menu, Tooltip } from "antd";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { FaEarthAmericas } from "react-icons/fa6";
import styles from "./Post.module.scss";
import CommentModal from "../Modal/CommentModal";
import HahaIcon from "../assets/image/Reacts/haha.png";
import LikeIcon from "../assets/image/Reacts/like.png";
import LoveIcon from "../assets/image/Reacts/heart.png";
import WowIcon from "../assets/image/Reacts/wow.png";
import SadIcon from "../assets/image/Reacts/sad.png";
import AngryIcon from "../assets/image/Reacts/angry.png";
import ReactionIconsBox from "./ReactionIconsBox";
import ShareModal from "../Modal/ShareModal";
import { BsThreeDots } from "react-icons/bs";
import Toastify from "../assets/Toastify";
import { ToastContainer } from "react-toastify";
import { userFindByIdService } from "../services/userService";
import {
  countPostReactionService,
  getPostReactionService,
  deletePostReactionService,
  addPostReactionService,
} from "../services/postReactionService";

import { countCommentService } from "../services/commentService";

import { getUserIdFromLocalStorage } from "../utils/authUtils";

import { reactionConfig } from "../assets/Config";
import { DeletePostByIdService } from "../services/postService";
import { useNavigate } from "react-router-dom";

const Post = ({ content, createdAt, userId, images, postId, isModalOpen }) => {
  const userId1 = getUserIdFromLocalStorage(); // Lấy userId1 từ localStorage
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isReactionBoxVisible, setIsReactionBoxVisible] = useState(false);
  const [isReactionBoxVisible2, setIsReactionBoxVisible2] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState("NONE");
  const [userInfo, setUserInfo] = useState([]);
  const [postReactionCount, setPostReactionCount] = useState([]);
  const [CommentCount, setCommentCount] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [likeCount, setLikeCount] = useState(0);
  const [loveCount, setLoveCount] = useState(0);
  const [hahaCount, setHahaCount] = useState(0);
  const [sadCount, setSadCount] = useState(0);
  const [angryCount, setAngryCount] = useState(0);
  const navigate = useNavigate();

  const handleImageClick = (postId) => {
    navigate(`/photo/${postId}`);
  };

  const getLikedUsers = () => {
    return reactions
      .filter((reaction) => reaction.reactionType === "LIKE")
      .map((reaction) => reaction.fullName)
      .join("<br />");
  };

  const getAllReactions = () => {
    return reactions
      .map((reaction) => reaction.fullName + " (" + reaction.reactionType + ")")
      .join("<br />"); // Thay thế '\n' bằng '<br />'
  };

  const [comments, setComments] = useState([]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(userId);
      setUserInfo(response?.data?.user || []); // Lưu dữ liệu trả về
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const countReaction = async () => {
    try {
      setLoading(true);
      const response = await countPostReactionService(postId);
      setPostReactionCount(response?.data?.data || 0);
    } catch (error) {
      console.error("Error count reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const countComment = async () => {
    try {
      setLoading(true);
      const response = await countCommentService(postId);
      setCommentCount(response?.data?.comment_count || 0);
    } catch (error) {
      console.error("Error count reaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await getPostReactionService(postId);
      setReactions(response?.data?.data || []); // Lưu dữ liệu phản ứng
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const fetchUserReaction = async () => {
    try {
      const response = await getPostReactionService(postId);
      const reactions = response?.data?.data || [];
      const userReaction = reactions.find(
        (reaction) => reaction.userId === userId1
      );

      // Nếu tìm thấy userReaction, set selectedReaction bằng reactionType, nếu không, set là "NONE"
      setSelectedReaction(userReaction ? userReaction.reactionType : "NONE");
    } catch (error) {
      console.error("Error fetching user reactions:", error);
      setSelectedReaction("NONE"); // Đảm bảo selectedReaction là "NONE" trong trường hợp lỗi
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await DeletePostByIdService(postId);

      if (response?.data?.success) {
        console.log(response.data.message); // Hiển thị thông báo thành công
        Toastify("Xóa bài viết thành công!", "success");
      } else {
        console.error("Không thể xóa bài viết. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  const closeModal = () => {
    setIsShareModalOpen(false);
  };

  useEffect(() => {
    fetchUser();
    countReaction();
    fetchUserReaction(); // Gọi thêm hàm kiểm tra cảm xúc
    fetchReactions();
    countComment();
  }, [postId]); // Gọi lại khi postId thay đổi

  useEffect(() => {
    countReaction();
    fetchUserReaction();
    getAllReactions();
    console.log("cảm xúc đang chọn: ", selectedReaction);
  }, [isCommentModalOpen]); //đóng mở modal thì xem lại đang chọn cảm xúc gì

  const handleReactionAdded = async (reactionType) => {
    try {
      console.log("Selected Reaction:", selectedReaction);
      console.log("Reaction Type:", reactionType);

      // Nếu người dùng bỏ chọn cảm xúc hoặc chọn lại cùng cảm xúc đã chọn
      if (reactionType === "NONE" || reactionType === selectedReaction) {
        console.log("Xóa cảm xúc hiện tại...");
        await deletePostReactionService(postId, userId1);
        setSelectedReaction("NONE");
        console.log("Cảm xúc đã bị xóa");
      }
      // Nếu bài viết chưa có cảm xúc (NONE), thêm cảm xúc mới
      else if (selectedReaction === "NONE") {
        console.log("Thêm cảm xúc mới...");
        await addPostReactionService({
          post_id: postId,
          user_id: userId1,
          reaction_type: reactionType,
        });
        setSelectedReaction(reactionType);
        console.log("Cảm xúc mới đã được thêm:", reactionType);
      }
      // Nếu bài viết đã có cảm xúc, cập nhật sang cảm xúc khác
      else {
        console.log("Cập nhật cảm xúc...");
        await deletePostReactionService(postId, userId1); // Xóa cảm xúc cũ
        await addPostReactionService({
          post_id: postId,
          user_id: userId1,
          reaction_type: reactionType,
        }); // Thêm cảm xúc mới
        setSelectedReaction(reactionType);
        console.log("Cảm xúc đã được cập nhật thành:", reactionType);
      }
      fetchReactions();
      countReaction();
      getAllReactions();
      // Đóng hộp thoại chọn cảm xúc (nếu có)
      setIsReactionBoxVisible(false);
      setIsReactionBoxVisible2(false);
    } catch (error) {
      console.error("Lỗi khi xử lý cảm xúc:", error);
    }
  };

  // Hàm riêng cho nút "LIKE"
  const handleLikeButtonClick = async () => {
    if (selectedReaction !== "NONE") {
      // Nếu đang có cảm xúc LIKE, xóa nó đi
      console.log("Xóa cảm xúc ĐANG CÓ...");
      await deletePostReactionService(postId, userId1);
      setSelectedReaction("NONE");
      console.log("đã xóa cảm xúc ĐANG CÓ");
    } else {
      // Nếu không có cảm xúc, thêm cảm xúc LIKE
      console.log("Thêm cảm xúc LIKE...");
      await addPostReactionService({
        post_id: postId,
        user_id: userId1,
        reaction_type: "LIKE",
      });
      setSelectedReaction("LIKE");
      console.log("Đã thêm cảm xúc LIKE");
    }
    fetchReactions();
    countReaction();
    getAllReactions();
    fetchUserReaction();
    setIsReactionBoxVisible(false); // Đóng box cảm xúc
    setIsReactionBoxVisible2(false); // Đóng box cảm xúc
  };

  const addComment = (newComment) => {
    setComments((prevComments) => [
      ...prevComments,
      { id: prevComments.length + 1, user: "Bạn", content: newComment },
    ]);
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.postContainer}>
        <div className={styles.header}>
          <Avatar src={userInfo.avatar_url} className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>{userInfo.name}</span>
            <span className={styles.time}>
              {new Date(createdAt).toLocaleString()} ·{" "}
              <FaEarthAmericas style={{ marginLeft: "4px" }} />
            </span>
          </div>
          {userId === getUserIdFromLocalStorage() ? (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="1" onClick={() => handleDeletePost(postId)}>
                    Xóa bài viết
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
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

        <div className={styles.content}>
          <p style={{ margin: "0" }}>{content}</p>

          {/* Hiển thị ảnh */}
          <div className={styles.imageGrid}>
            {(isModalOpen ? images : images.slice(0, 2)).map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`post-image-${index}`}
                className={styles.mainImage}
                onClick={() => handleImageClick(postId)}
              />
            ))}
          </div>

          {/* Hiển thị nút "Xem tất cả" nếu có từ 3 ảnh trở lên và chưa mở modal */}
          {!isModalOpen && images.length >= 3 && (
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className={styles.viewMoreButton}
            >
              Xem tất cả
            </button>
          )}
        </div>

        <div className={styles.reactionsContainer}>
          <div className={styles["reactions"]}>
            <Tooltip
              title={
                <span dangerouslySetInnerHTML={{ __html: getLikedUsers() }} />
              }
              arrow
            >
              <img
                src={LikeIcon}
                alt="Image 2"
                className={`${styles["icon"]} ${styles["icon-1"]}`}
              />
            </Tooltip>
            <Tooltip
              title={
                <span dangerouslySetInnerHTML={{ __html: getLikedUsers() }} />
              }
              arrow
            >
              <img
                src={HahaIcon}
                alt="Image 2"
                className={`${styles["icon"]} ${styles["icon-2"]}`}
              />
            </Tooltip>
            {/* <Tooltip 
              title={<span dangerouslySetInnerHTML={{ __html: getLikedUsers() }} />} 
              arrow
            >
              <img
                src={LoveIcon}
                alt="Image 2"
                className={`${styles["icon"]} ${styles["icon-3"]}`}
              />
            </Tooltip>
            <Tooltip 
              title={<span dangerouslySetInnerHTML={{ __html: getLikedUsers() }} />} 
              arrow
            >
              <img
                src={SadIcon}
                alt="Image 2"
                className={`${styles["icon"]} ${styles["icon-4"]}`}
              />
            </Tooltip>
            <Tooltip 
              title={<span dangerouslySetInnerHTML={{ __html: getLikedUsers() }} />} 
              arrow
            >
              <img
                src={AngryIcon}
                alt="Image 2"
                className={`${styles["icon"]} ${styles["icon-5"]}`}
              />
            </Tooltip> */}
          </div>
          <Tooltip
            title={
              <span dangerouslySetInnerHTML={{ __html: getAllReactions() }} />
            }
            arrow
          >
            <span className={styles.reactionCount}>{postReactionCount}</span>
          </Tooltip>
          <div className={styles.rightFooter}>
            <span className={styles.cmtCount} style={{ marginRight: "10px" }}>
              {CommentCount} bình luận
            </span>
            <span className={styles.shareCount}>1 lượt chia sẻ</span>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            icon={reactionConfig[selectedReaction].icon}
            type="text"
            className={styles.likeButtonWrapper}
            onMouseEnter={() => setIsReactionBoxVisible(true)}
            onMouseLeave={() => setIsReactionBoxVisible(false)}
            onClick={handleLikeButtonClick}
            style={{
              color: reactionConfig[selectedReaction].color, // Màu chữ theo cấu hình
            }}
          >
            {reactionConfig[selectedReaction].text}
          </Button>

          {isReactionBoxVisible && (
            <div
              style={{
                position: "absolute",
                left: "0px",
                bottom: "0px",
              }}
              className={styles.reactionBoxWrapper}
              onMouseEnter={() => setIsReactionBoxVisible(true)}
              onMouseLeave={() => setIsReactionBoxVisible(false)}
            >
              <ReactionIconsBox
                postId={postId}
                onReactionAdded={handleReactionAdded}
                currentReaction={selectedReaction}
              />
            </div>
          )}
          <Button
            icon={<FaRegComment />}
            type="text"
            onClick={() => {
              if (!isModalOpen) {
                fetchUserReaction();
                setIsCommentModalOpen(true); // Chỉ mở modal nếu nó chưa được mở
              }
            }}
          >
            Bình luận
          </Button>

          <Button
            icon={<PiShareFat />}
            type="text"
            onClick={() => setIsShareModalOpen(true)}
          >
            Chia sẻ
          </Button>
        </div>
      </div>

      {/* Modal bình luận */}
      <CommentModal
        type="post"
        userId={userId}
        content={content}
        isModalOpen={isCommentModalOpen}
        onCancel={() => setIsCommentModalOpen(false)}
        postId={postId}
        userInfo={userInfo}
        images={images}
        addComment={addComment}
        createdAt={createdAt}
        onReactionChange={(reaction) => setSelectedReaction(reaction)} // Callback
      />
      {/* Modal chia sẻ */}
      {isShareModalOpen && (
        <ShareModal
          isModalOpen={isShareModalOpen}
          onCancel={() => setIsShareModalOpen(false)}
          postId={postId}
          userInfo={userInfo}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Post;
