import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';
import styles from './AppStoreContent.module.scss'; // Import SCSS module
import FriendsImg from "../assets/image/Homepage/LeftSidebar/friend.png";
import GroupsImg from "../assets/image/Homepage/LeftSidebar/groups.png";
import FeedImg from "../assets/image/Homepage/LeftSidebar/feed.png";

const AppStoreContent = () => {
    const navigate = useNavigate();

    const handleGroupClick = () => {
        navigate('/groups');
    };

    const handleFriendsClick = () => {
        navigate('/friends');
    };

    const handleHomeClick = () => {
        navigate('/');
    };
  // Dữ liệu các mục menu
  const menuItems = [
    {
      icon: FriendsImg,
      title: "Bạn bè",
      description: "Tìm kiếm bạn bè hoặc những người bạn có thể biết",
      onClick: handleFriendsClick,
    },
    {
      icon: GroupsImg,
      title: "Nhóm",
      description: "Kết nối với những người có chung sở thích",
      onClick: handleGroupClick,
    },
    {
      icon: FeedImg, 
      title: "Bảng tin",
      description: "Xem bài viết phù hợp của những người mà bạn theo dõi",
      onClick: handleHomeClick,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Menu</h2>
      </div>

      <div className={styles.content}>
        {/* Sử dụng map để render các mục menu */}
        {menuItems.map((item, index) => (
          <div key={index} className={styles.itemContainer} onClick={item.onClick} > 
            <div className={styles.iconContainer}>
              <img style={{ width: '40px' }} src={item.icon} alt={item.title} />
            </div>
            <div className={styles.labelContainer}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>{item.title}</span>
              <span>{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppStoreContent;
