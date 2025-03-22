import React from 'react';
import styles from './LeftSidebar.module.scss';
import FriendImg from '../../../assets/image/Homepage/LeftSidebar/friend.png';
import MessImg from '../../../assets/image/Homepage/LeftSidebar/messenger.png';
import FriendInvitation from '../../../assets/image/FriendPage/Sidebar/friend-invitation.png';
import FriendSuggestion from '../../../assets/image/FriendPage/Sidebar/friend-suggestion.png';
import AllFriends from '../../../assets/image/FriendPage/Sidebar/all-friends.png';
import { useNavigate } from 'react-router-dom';

const LeftSidebar = () => {
  const navigate = useNavigate();

  // Hàm điều hướng khi click vào từng mục
  const handleNavigate = (type) => {
    navigate(`/friends/${type}`); // Điều hướng đến URL với tham số type
  };

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h1 style={{ marginLeft: '20px', marginBottom: '20px', fontSize: '24px' }}>Bạn bè</h1>
      </div>
      <ul className={styles['list-container']}>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate('')} // Điều hướng đến trang home
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={FriendImg} alt="" />
            </div>
            <span className={styles['text']}>Trang chủ</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate('requests')} // Điều hướng đến lời mời kết bạn
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']}  src={FriendInvitation} alt="" />
            </div>
            <span className={styles['text']}>Lời mời kết bạn</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate('suggested')} // Điều hướng đến gợi ý bạn bè
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img
                className={styles['icon']}
                style={{ width: '30px', height: '30px', marginLeft: '3px' }}
                src={FriendSuggestion}
                alt=""
              />
            </div>
            <span className={styles['text']}>Gợi ý</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => handleNavigate('allFriends')} // Điều hướng đến tất cả bạn bè
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={AllFriends} alt="" />
            </div>
            <span className={styles['text']}>Tất cả bạn bè</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default LeftSidebar;
