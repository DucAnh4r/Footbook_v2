/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Avatar, Button, Skeleton } from "antd";
import { FaEarthAmericas, FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import { AiOutlineFullscreen, AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { IoIosSend } from "react-icons/io";
import CancelIcon from "../../assets/image/PhotoPage/CancelButton.png";
import HahaIcon from "../../assets/image/Reacts/haha.png";
import LikeIcon from "../../assets/image/Reacts/like.png";
import Comment from "./Components/Comment";
import styles from "./PhotoPage.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import {
  addCommentService,
  countCommentService,
  getCommentService,
} from "../../services/commentService";
import { getPostByIdService } from "../../services/postService";
import { countPostReactionService } from "../../services/postReactionService";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";
import { userFindByIdService } from "../../services/userService";

const PhotoPage = () => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1); // Zoom scale
  const [isFullScreen, setIsFullScreen] = useState(false); // State for fullscreen mode
  const [getcomment, setGetComment] = useState([]);
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [userCommentInfo, setUserCommentInfo] = useState([]);
  const [postReactionCount, setPostReactionCount] = useState([]);
  const [commentCount, setCommentCount] = useState([]);
  const myId = getUserIdFromLocalStorage();
  const { postId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length
    );
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen((prev) => {
      return !prev;
    });
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostByIdService(postId);
      setPost(response?.data?.post || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComment = async () => {
    try {
      setLoading(true);
      const response = await getCommentService(postId);
      setGetComment(response?.data?.comments || []);
    } catch (error) {
      console.error("Error fetching comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(post.user_id);
      setUserInfo(response?.data?.user || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommnetUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(myId);
      setUserCommentInfo(response?.data?.data || []);
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

  const handleOk = async () => {
    const commentData = {
      userId: myId,
      postId: postId,
      content: comment,
    };

    await addCommentService(commentData);
    fetchComment();
    setComment("");
    countComment();
  };

  useEffect(() => {
    fetchPost();
    fetchComment();
    countReaction();
    countComment();
    fetchCommnetUser();
  }, [postId]); // Chỉ gọi các fetch ban đầu

  useEffect(() => {
    if (post.user_id) {
      fetchUser(); // Gọi fetchUser chỉ khi post.user_id đã được cập nhật
    }
  }, [post.user_id]); // Theo dõi thay đổi của post.user_id

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3)); // Zoom in, max scale 3
  };

  const handleZoomOut = () => {
    setScale((prev) => {
      const newScale = Math.max(prev - 0.5, 1); // Zoom out, min scale 1
      return newScale;
    });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - start.x;
    const y = e.clientY - start.y;
    setPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  return (
    <Layout>
      <Row className={styles["container"]}>
        <Col
          className={`${styles["image-row"]} ${
            isFullScreen ? styles["fullscreenContainer"] : ""
          }`}
        >
          <div
            className={`${styles["round-button-container"]} ${styles["cancel-button-container"]}`}
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1); // Navigate to previous page if available
              } else {
                navigate("/"); // Navigate to homepage if no previous page
              }
            }}
          >
            <img
              style={{ width: "80%", height: "80%" }}
              src={CancelIcon}
              alt=""
            />
          </div>
          <div
            className={`${styles["round-button-container"]} ${styles["zoomin-button-container"]}`}
            onClick={handleZoomIn}
          >
            <MdZoomIn />
          </div>
          <div
            className={`${styles["round-button-container"]} ${styles["zoomout-button-container"]}`}
            onClick={handleZoomOut}
          >
            <MdZoomOut />
          </div>
          <div
            className={`${styles["round-button-container"]} ${styles["full-button-container"]}`}
            onClick={handleFullScreenToggle}
          >
            <AiOutlineFullscreen />
          </div>
          <div
            className={`${styles["round-button-container"]} ${styles["left-button-container"]}`}
            onClick={handlePrev}
          >
            <FaAngleLeft />
          </div>
          <div
            className={`${styles["round-button-container"]} ${styles["right-button-container"]}`}
            onClick={handleNext}
          >
            <FaAngleRight />
          </div>
          <div className={styles["image-container"]}>
            {post?.images?.length > 0 && (
              <img
                src={post?.images[currentIndex].image_url}
                alt={`Image ${currentIndex + 1}`}
                className={`${styles.image} disable-select`}
                style={{
                  cursor: scale > 1 ? "grab" : "default",
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                draggable={false}
              />
            )}
          </div>
        </Col>
        <Col className={styles["right-row"]}>
          <div style={{ padding: "16px" }}>
            <div className={styles.header}>
              <Avatar src={userInfo.avatar_url} className={styles.avatar} />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userInfo.name}</span>
                <span className={styles.time}>
                  {post.created_at} phút ·{" "}
                  <FaEarthAmericas style={{ marginLeft: "4px" }} />
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <p>{post.content}</p>
            </div>

            <div className={styles.reactionsContainer}>
              <div className={styles["reactions"]}>
                <img
                  src={HahaIcon}
                  alt="Haha"
                  className={`${styles["icon"]} ${styles["icon-left"]}`}
                />
                <img
                  src={LikeIcon}
                  alt="Like"
                  className={`${styles["icon"]} ${styles["icon-right"]}`}
                />
              </div>
              <span className={styles.reactionCount}>{postReactionCount}</span>
              <div className={styles.rightFooter}>
                <span
                  className={styles.cmtCount}
                  style={{ marginRight: "10px" }}
                >
                  {commentCount} bình luận
                </span>
                <span className={styles.shareCount}>1 lượt chia sẻ</span>
              </div>
            </div>

            <div className={styles.footer}>
              <Button
                icon={<AiOutlineLike />}
                type="text"
                className={styles.likeButtonWrapper}
              >
                Thích
              </Button>
              <Button icon={<FaRegComment />} type="text">
                Bình luận
              </Button>
              <Button icon={<PiShareFat />} type="text">
                Chia sẻ
              </Button>
            </div>

            <div className={styles.commentSection}>
              {loading ? (
                // Hiển thị Skeleton khi đang tải dữ liệu
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={styles.skeletonComment}>
                    <Skeleton.Avatar
                      active
                      size="small"
                      style={{ marginRight: 10 }}
                    />
                    <Skeleton.Input active style={{ width: "80%" }} />
                  </div>
                ))
              ) : getcomment.length > 0 ? (
                getcomment.map((comment) => (
                  <Comment
                    key={comment.id}
                    commentId={comment.id}
                    content={comment.content}
                    createdAt={comment.created_at}
                    userId={comment.user_id}
                    childComments={comment.childComments}
                    postId={postId}
                  />
                ))
              ) : (
                <p>Không có bình luận nào để hiển thị.</p>
              )}
            </div>

            {/* <div className={styles.seeMoreSection}>
              <p className={styles.seeMoreBtn}>Xem thêm bình luận</p>
              <p style={{ color: "#65686c" }}>6/84</p>
            </div> */}
          </div>

          <div className={styles.writeCommentSection}>
            <Row>
              <Col span={4}>
                <Avatar
                  src={userCommentInfo.profilePictureUrl}
                  className={styles.avatar}
                  style={{ margin: "6px 0 0 6px" }}
                />
              </Col>
              <Col span={20}>
                <div className={styles.writeCommentContainer}>
                  <textarea
                    placeholder="Viết bình luận..."
                    value={comment}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // Ngăn xuống dòng
                        handleOk(); // Gửi bình luận khi nhấn Enter
                      }
                    }}
                  ></textarea>
                  <div className={styles.actionCommentContainer}>
                    {/* Nút gửi bình luận */}
                    <IoIosSend
                      className={styles["sendCommentButton"]}
                      style={{
                        color: comment ? "blue" : "gray",
                        cursor: comment ? "pointer" : "not-allowed",
                      }}
                      onClick={() => {
                        if (comment.trim()) handleOk(); // Chỉ gửi nếu comment không rỗng
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default PhotoPage;
