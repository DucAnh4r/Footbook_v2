/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import styles from './LeftSidebar.module.scss';
import FriendImg from '../../../assets/image/Homepage/LeftSidebar/friend.png';
import MessImg from '../../../assets/image/Homepage/LeftSidebar/messenger.png';
import { useNavigate } from 'react-router-dom';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';

const LeftSidebar = ({user}) => {
    const [userInfo, setUserInfo] = useState(user);
    const [loading, setLoading] = useState(false);
    const user_id = getUserIdFromLocalStorage(); // Lấy user_id từ LocalStorage

    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/profile');
    };

    const handleFriendsClick = () => {
        navigate('/friends');
    };

    const handleMessageClick = () => {
        navigate('/messages');
    };

    useEffect(() => {
        setUserInfo(user);
    }, [user]);
    
    return (
        <div className={styles['container']}>
            {loading ? (
                <p>Đang tải thông tin người dùng...</p>
            ) : (
                <ul className={styles['list-container']}>
                    <li className={styles['list-item']} onClick={handleProfileClick}>
                        <div className={styles['element-container']}>
                            <div className={styles['image-container']}>
                                <img
                                    className={styles['image']}
                                    src={userInfo.avatar_url}
                                    alt=""
                                />
                            </div>
                            <span className={styles['text']}>{userInfo.name || 'Người dùng'}</span>
                        </div>
                    </li>
                    <li className={styles['list-item']} onClick={handleFriendsClick}>
                        <div className={styles['element-container']}>
                            <div className={styles['image-container']}>
                                <img className={styles['icon']} src={FriendImg} alt="" />
                            </div>
                            <span className={styles['text']}>Bạn bè</span>
                        </div>
                    </li>
                    <li className={styles['list-item']}  onClick={handleMessageClick}> 
                        <div className={styles['element-container']}>
                            <div className={styles['image-container']}>
                                <img
                                    className={styles['icon']}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        marginLeft: '3px',
                                    }}
                                    src={MessImg}
                                    alt=""
                                />
                            </div>
                            <span className={styles['text']}>Messenger</span>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default LeftSidebar;
