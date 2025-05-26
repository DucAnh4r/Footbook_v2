/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Row, Col, Avatar, Button, Skeleton } from 'antd';
import { FaEarthAmericas, FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';
import { AiOutlineFullscreen, AiOutlineLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { PiShareFat } from 'react-icons/pi';
import { IoIosSend } from 'react-icons/io';
import CancelIcon from '../../assets/image/PhotoPage/CancelButton.png';
import HahaIcon from '../../assets/image/Reacts/haha.png';
import LikeIcon from '../../assets/image/Reacts/like.png';
import CommentSection from '../../Components/Comment/CommentSection';
import styles from './PhotoPage.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { countCommentService } from '../../services/commentService';
import { getPostByIdService } from '../../services/postService';
import { getPostReactionService } from '../../services/postReactionService';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';
import { userFindByIdService } from '../../services/userService';

const PhotoPage = () => {
  const navigate = useNavigate();
  const [scale, setScale] = useState(1); // Zoom scale
  const [isFullScreen, setIsFullScreen] = useState(false); // State for fullscreen mode
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState([]);
  const [postReactionCount, setPostReactionCount] = useState([]);
  const [commentCount, setCommentCount] = useState([]);
  const myId = getUserIdFromLocalStorage();
  const { postId } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  
  // Refs for container and image elements
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Log postId and myId for debugging
  console.log("PhotoPage props:", { postId, myId });

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % post.images.length);
    // Reset position when changing images
    setPosition({ x: 0, y: 0 });
  };

  const handlePrev = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + post.images.length) % post.images.length);
    // Reset position when changing images
    setPosition({ x: 0, y: 0 });
  };

  const handleFullScreenToggle = () => {
    setIsFullScreen(prev => !prev);
  };

  // Function to calculate drag boundaries
  const calculateBoundaries = () => {
    if (!containerRef.current || !imageRef.current) return null;
    
    const container = containerRef.current.getBoundingClientRect();
    const image = imageRef.current.getBoundingClientRect();
    
    const scaledImageWidth = image.width * scale;
    const scaledImageHeight = image.height * scale;
    
    const maxX = Math.max(0, (scaledImageWidth - container.width) / 2);
    const maxY = Math.max(0, (scaledImageHeight - container.height) / 2);
    
    return {
      minX: -maxX,
      maxX: maxX,
      minY: -maxY,
      maxY: maxY
    };
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await getPostByIdService(postId);
      console.log("Fetched post:", response?.data?.post);
      setPost(response?.data?.post || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await userFindByIdService(post.user_id);
      console.log("Fetched user:", response?.data?.user);
      setUserInfo(response?.data?.user || []);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchCommentUser = async () => {
    try {
      const response = await userFindByIdService(myId);
      console.log("Fetched comment user:", response?.data?.user);
    } catch (error) {
      console.error('Error fetching comment user:', error);
    }
  };

  const countReaction = async () => {
    try {
      const response = await getPostReactionService(postId);
      console.log("Fetched reaction count:", response?.data?.counts?.total);
      setPostReactionCount(response?.data?.counts?.total || 0);
    } catch (error) {
      console.error('Error counting reaction:', error);
    }
  };

  const countComment = async () => {
    try {
      const response = await countCommentService(postId);
      console.log("Fetched comment count:", response?.data?.comment_count);
      setCommentCount(response?.data?.comment_count || 0);
    } catch (error) {
      console.error('Error counting comments:', error);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
      countReaction();
      countComment();
      fetchCommentUser();
    }
  }, [postId]);

  useEffect(() => {
    if (post.user_id) {
      fetchUser();
    }
  }, [post.user_id]);

  // Reset position when scale changes
  useEffect(() => {
    setPosition({ x: 0, y: 0 });
  }, [scale]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
  };

  const handleMouseDown = e => {
    if (scale <= 1) return; // Only allow dragging when zoomed in
    setIsDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = e => {
    if (!isDragging || scale <= 1) return;
    
    const newX = e.clientX - start.x;
    const newY = e.clientY - start.y;
    
    const boundaries = calculateBoundaries();
    if (!boundaries) {
      setPosition({ x: newX, y: newY });
      return;
    }
    
    // Constrain position within boundaries
    const constrainedX = Math.min(Math.max(newX, boundaries.minX), boundaries.maxX);
    const constrainedY = Math.min(Math.max(newY, boundaries.minY), boundaries.maxY);
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Validate props before rendering CommentSection
  if (!postId) {
    console.error("No postId provided to PhotoPage");
    return <div>Invalid post ID</div>;
  }

  if (!myId) {
    console.warn("No userId found. User might not be logged in.");
  }

  return (
    <Layout>
      <Row className={styles['container']}>
        <Col className={`${styles['image-row']} ${isFullScreen ? styles['fullscreenContainer'] : ''}`}>
          <div
            className={`${styles['round-button-container']} ${styles['cancel-button-container']}`}
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
          >
            <img style={{ width: '80%', height: '80%' }} src={CancelIcon} alt="" />
          </div>
          <div className={`${styles['round-button-container']} ${styles['zoomin-button-container']}`} onClick={handleZoomIn}>
            <MdZoomIn />
          </div>
          <div className={`${styles['round-button-container']} ${styles['zoomout-button-container']}`} onClick={handleZoomOut}>
            <MdZoomOut />
          </div>
          <div className={`${styles['round-button-container']} ${styles['full-button-container']}`} onClick={handleFullScreenToggle}>
            <AiOutlineFullscreen />
          </div>
          {post?.images?.length > 1 && (
            <>
              <div className={`${styles['round-button-container']} ${styles['left-button-container']}`} onClick={handlePrev}>
                <FaAngleLeft />
              </div>
              <div className={`${styles['round-button-container']} ${styles['right-button-container']}`} onClick={handleNext}>
                <FaAngleRight />
              </div>
            </>
          )}
          <div className={styles['image-container']} ref={containerRef}>
            {loading ? (
              <Skeleton.Image 
                style={{ 
                  width: '100%', 
                  height: '100%',
                  minHeight: '400px'
                }} 
                active 
              />
            ) : (
              post?.images?.length > 0 && (
                <img
                  ref={imageRef}
                  src={post?.images[currentIndex].image_url}
                  alt={`Image ${currentIndex + 1}`}
                  className={`${styles.image} disable-select`}
                  style={{
                    cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  draggable={false}
                />
              )
            )}
          </div>
        </Col>
        <Col className={styles['right-row']}>
          <div>
            {loading ? (
              <>
                <div className={styles.header}>
                  <Skeleton.Avatar active size={40} />
                  <div className={styles.userInfo} style={{ marginLeft: '12px' }}>
                    <Skeleton active title={{ width: 120 }} paragraph={false} />
                    <Skeleton active title={{ width: 80 }} paragraph={false} />
                  </div>
                </div>
                <div className={styles.content} style={{ marginTop: '16px' }}>
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                </div>
                <div className={styles.reactionsContainer} style={{ marginTop: '16px' }}>
                  <Skeleton active title={{ width: 100 }} paragraph={false} />
                </div>
                <div className={styles.footer} style={{ marginTop: '16px' }}>
                  <Skeleton.Button active size="small" style={{ marginRight: '8px' }} />
                  <Skeleton.Button active size="small" style={{ marginRight: '8px' }} />
                  <Skeleton.Button active size="small" />
                </div>
              </>
            ) : (
              <>
                <div className={styles.header}>
                  <Avatar src={userInfo.avatar_url} className={styles.avatar} />
                  <div className={styles.userInfo}>
                    <span className={styles.userName}>{userInfo.name}</span>
                    <span className={styles.time}>
                      {post.created_at} phút · <FaEarthAmericas style={{ marginLeft: '4px' }} />
                    </span>
                  </div>
                </div>

                <div className={styles.content}>
                  <p>{post.content}</p>
                </div>

                <div className={styles.reactionsContainer}>
                  <div className={styles['reactions']}>
                    <img src={HahaIcon} alt="Haha" className={`${styles['icon']} ${styles['icon-left']}`} />
                    <img src={LikeIcon} alt="Like" className={`${styles['icon']} ${styles['icon-right']}`} />
                  </div>
                  <span className={styles.reactionCount}>{postReactionCount}</span>
                  <div className={styles.rightFooter}>
                    <span className={styles.cmtCount} style={{ marginRight: '10px' }}>
                      {commentCount} bình luận
                    </span>
                    <span className={styles.shareCount}>1 lượt chia sẻ</span>
                  </div>
                </div>

                <div className={styles.footer}>
                  <Button icon={<AiOutlineLike />} type="text" className={styles.likeButtonWrapper}>
                    Thích
                  </Button>
                  <Button icon={<FaRegComment />} type="text">
                    Bình luận
                  </Button>
                  <Button icon={<PiShareFat />} type="text">
                    Chia sẻ
                  </Button>
                </div>

                <CommentSection
                  postId={postId}
                  userId={myId}
                  userInfo={userInfo}
                  isModalOpen={true}
                />
              </>
            )}
          </div>
        </Col>
      </Row>
    </Layout>
  );
};

export default PhotoPage;