import React from 'react';
import styles from './LeftSidebar.module.scss';
import FriendImg from '../../../assets/image/Homepage/LeftSidebar/friend.png';
import PostImg from '../../../assets/image/SearchPage/instagram-post.png';
import AllFriends from '../../../assets/image/FriendPage/Sidebar/all-friends.png';
import ExploreImg from '../../../assets/image/Homepage/LeftSidebar/explore.png';

import { useNavigate } from 'react-router-dom';

const LeftSidebar = ({query}) => {
  const navigate = useNavigate();

  // Hàm điều hướng khi click vào từng mục
  const handleNavigate = (type) => {
    navigate(`/search/${type}`); // Điều hướng đến URL với tham số type
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 style={{ marginLeft: '20px', marginBottom: '20px', fontSize: '24px' }}>Kết quả tìm kiếm</h1>
      </div>
      <ul className={styles['list-container']}>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate(`top?query=${query}`)} // Điều hướng đến trang home
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={ExploreImg} alt="" />
            </div>
            <span className={styles['text']}>Tất cả</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate(`post?query=${query}`)} // Điều hướng đến lời mời kết bạn
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']}  src={PostImg} alt="" />
            </div>
            <span className={styles['text']}>Bài viết</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate(`friend?query=${query}`)} // Điều hướng đến gợi ý bạn bè
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={FriendImg} alt="" />
            </div>
            <span className={styles['text']}>Mọi người</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate(`group?query=${query}`)} // Điều hướng đến tất cả bạn bè
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={AllFriends} alt="" />
            </div>
            <span className={styles['text']}>Nhóm</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
