import React from 'react';
import { Avatar, Button } from 'antd';
import { LikeOutlined, CommentOutlined, ShareAltOutlined, SendOutlined } from '@ant-design/icons';
import { AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { PiShareFat } from "react-icons/pi";
import { FaLaugh, FaSmile } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaEarthAmericas } from "react-icons/fa6";
import styles from './GroupPost.module.scss'; // Import SCSS module
import HahaIcon from "../assets/image/Reacts/haha.png";
import LikeIcon from "../assets/image/Reacts/like.png";

const GroupPost = () => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate('/photo');
  };

  return (
    <div className={styles.postContainer}>
      <div className={styles.header}>
        <div className={styles['avatars-container']}>
          <Avatar src="https://pbs.twimg.com/profile_images/1703522276405055488/gW_Wj77j_400x400.jpg" className={styles['group-avatar']}></Avatar>
          <Avatar src="https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223" className={styles.avatar} />

        </div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Hội Ricon Việt Nam</span>
          <span className={styles.time}>Le Dai Tri · 5 phút · <FaEarthAmericas style={{marginLeft: '4px'}}/></span>
          
        </div>
      </div>
      
      <div className={styles.content}>
        <p>Tao cũng đến lạy</p>
        <img 
          src="https://c.ndtvimg.com/2024-04/64v6v0mo_ronaldo_625x300_09_April_24.jpg?im=FitAndFill,algorithm=dnn,width=806,height=605" 
          alt="post content" 
          className={styles.mainImage} 
          onClick={handleImageClick} // Thêm sự kiện click
        />
      </div>

      <div className={styles.reactionsContainer}>
        <div className={styles['reactions']}>
          <img src={HahaIcon} alt="Image 1" className={`${styles['icon']} ${styles['icon-left']}`} />
          <img src={LikeIcon} alt="Image 2" className={`${styles['icon']} ${styles['icon-right']}`} />
        </div>
        <span className={styles.reactionCount}>885</span>

        <div className={styles.rightFooter}>
          <span className={styles.cmtCount} style={{marginRight: '10px'}}>20 bình luận</span>
          <span className={styles.shareCount}>1 lượt chia sẻ</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Button icon={<AiOutlineLike />} type="text">Thích</Button>
        <Button icon={<FaRegComment />} type="text">Bình luận</Button>
        {/* <Button icon={<SendOutlined />} type="text">Gửi</Button> */}
        <Button icon={<PiShareFat />} type="text">Chia sẻ</Button>
      </div>
    </div>
  );
};

export default GroupPost;
