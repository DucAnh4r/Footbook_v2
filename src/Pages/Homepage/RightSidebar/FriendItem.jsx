// FriendItem.js
import React from 'react';
import styles from './FriendItem.module.scss'; // Tạo file CSS Module để styling riêng cho component

const FriendItem = ({ name, imageSrc, isOnline }) => {
  return (
    <div className={styles.friendItem}>
      <div className={styles.avatarContainer}>
        <img src={imageSrc} alt={`${name}'s avatar`} className={styles.avatar} />
        {isOnline && <span className={styles.onlineIndicator}></span>}
      </div>
      <span className={styles.friendName}>{name}</span>
    </div>
  );
};

export default FriendItem;
