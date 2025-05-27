/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Row, Col, Tabs, Dropdown, Menu } from 'antd';
import styles from './ProfilePage.module.scss';
import { IoIosCamera, IoIosArrowDown, IoMdAdd } from 'react-icons/io';
import { FaPen } from 'react-icons/fa6';
import { EllipsisOutlined } from '@ant-design/icons';
import Posts from './Tabs/Posts/Posts.jsx';
import Introduction from './Tabs/Introduction/Introduction.jsx';
import Friends from './Tabs/Friends/Friends.jsx';
import Photos from './Tabs/Photos/Photos.jsx';
import Videos from './Tabs/Videos/Videos.jsx';
import FriendSuggestion from '../../../Components/SuggestedFriends.jsx';
import { useAuthCheck } from '../../../utils/checkAuth.jsx';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils.jsx';
import { countFriendService } from '../../../services/friendService.jsx';
import { updateAvatarService, updateCoverService, updateProfileService, userFindByIdService } from '../../../services/userService.jsx';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  useAuthCheck();
  const [activeTab, setActiveTab] = useState('1');
  const [isFriendSuggestionVisible, setFriendSuggestionVisible] = useState(false);
  const [headerWidth, setHeaderWidth] = useState('70%');
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [friendCount, setFriendCount] = useState(0);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const userId = useMemo(() => getUserIdFromLocalStorage(), []);

  // Memoize fetch functions to avoid recreating them on each render
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await userFindByIdService(userId);
      if (response?.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const countFriend = useCallback(async () => {
    try {
      const response = await countFriendService(userId);
      setFriendCount(response?.data?.friends_count || 0);
    } catch (error) {
      console.error('Error count friend:', error);
    }
  }, [userId]);

  // Upload image helper
  const handleImageChange = useCallback(
    async (e, type) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsLoading(true);

      try {
        if (type === 'avatar') {
          const formData = { avatar: file };
          await updateAvatarService(formData, userId, (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Avatar upload progress: ${percentCompleted}%`);
          });
          toast.success('Ảnh đại diện đã được cập nhật!');
        } else if (type === 'cover') {
          const formData = { coverPicture: file };
          await updateCoverService(formData, userId, (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Cover upload progress: ${percentCompleted}%`);
          });
          toast.success('Ảnh bìa đã được cập nhật!');
        }
        await fetchUser();
      } catch (error) {
        toast.error('Cập nhật ảnh thất bại!');
        console.error(`Error updating ${type}:`, error);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, fetchUser]
  );

  const handleImageClick = useCallback(type => {
    if (type === 'avatar') {
      avatarInputRef.current?.click();
    } else {
      coverInputRef.current?.click();
    }
  }, []);

  useEffect(() => {
    // Fetch data when component mounts
    fetchUser();
    countFriend();

    // Observe container width changes
    const checkContainerWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setHeaderWidth(containerWidth < 1300 ? '94%' : '70%');
      }
    };

    const resizeObserver = new ResizeObserver(checkContainerWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, [fetchUser, countFriend]);

  const handleTabChange = useCallback(key => {
    setActiveTab(key);
  }, []);

  const toggleFriendSuggestion = useCallback(() => {
    setFriendSuggestionVisible(prev => !prev);
  }, []);

  // Memoize menu to prevent re-creation on every render
  const menu = useMemo(
    () => (
      <Menu className={styles['custom-menu']}>
        <Menu.Item key="1" className={styles['menu-item']}>
          Chế độ xem
        </Menu.Item>
        <Menu.Item key="2" className={styles['menu-item']}>
          Tìm kiếm
        </Menu.Item>
        <Menu.Item key="3" className={styles['menu-item']}>
          Trạng thái trang cá nhân
        </Menu.Item>
        <Menu.Item key="4" className={styles['menu-item']}>
          Kho lưu trữ
        </Menu.Item>
        <Menu.Item key="5" className={styles['menu-item']}>
          Kho lưu trữ tin
        </Menu.Item>
        <Menu.Item key="6" className={styles['menu-item']}>
          Nhật ký hoạt động
        </Menu.Item>
        <Menu.Item key="7" className={styles['menu-item']}>
          Cài đặt trang cá nhân và gắn thẻ
        </Menu.Item>
        <Menu.Item key="8" className={styles['menu-item']}>
          Khóa bảo vệ trang cá nhân
        </Menu.Item>
        <Menu.Item key="9" className={styles['menu-item']}>
          Bật chế độ chuyên nghiệp
        </Menu.Item>
        <Menu.Item key="10" className={styles['menu-item']}>
          Tạo trang cá nhân khác
        </Menu.Item>
      </Menu>
    ),
    []
  );

  // Lazy load tabs to improve performance
  const renderTabContent = useCallback(() => {
    switch (activeTab) {
      case '1':
        return <Posts userInfo={userInfo} userName={userInfo.name} avatar={userInfo.avatar_url} />;
      case '2':
        return <Introduction userInfo={userInfo} onProfileUpdated={fetchUser} />;
      case '3':
        return <Friends />;
      case '4':
        return <Photos />;
      case '5':
        return <Videos />;
      case '6':
        return <div style={{ minHeight: '1000px' }}>Nội dung của tab Reels</div>;
      case '7':
        return <div style={{ minHeight: '1000px' }}>Nội dung của tab Xem thêm</div>;
      default:
        return null;
    }
  }, [activeTab, userInfo, fetchUser]);

  return (
    <>
      <div className={styles['container']} ref={containerRef}>
        <div className={styles['header']} style={{ width: headerWidth }}>
          <div className={styles['wallpaper']} onClick={() => handleImageClick('cover')}>
            <img className={styles['wallpaper-img']} src={userInfo.cover_photo_url} alt="" />
            <input type="file" accept="image/*" ref={coverInputRef} style={{ display: 'none' }} onChange={e => handleImageChange(e, 'cover')} />
            <div className={styles['add-wallpaper']}>
              <IoIosCamera style={{ width: '25px', height: '25px' }} />
              <span style={{ fontSize: '16px', fontWeight: 500 }}>Thêm ảnh bìa</span>
            </div>
          </div>
          <Row className={styles['info']} gutter={16}>
            <Col span={6}>
              <div className={styles['avatar']} onClick={() => handleImageClick('avatar')}>
                <img className={styles['avatar-img']} src={userInfo.avatar_url} alt="Avatar" />
                <input type="file" accept="image/*" ref={avatarInputRef} style={{ display: 'none' }} onChange={e => handleImageChange(e, 'avatar')} />
              </div>
              <div className={styles['add-avatar']} onClick={() => handleImageClick('avatar')}>
                <IoIosCamera style={{ width: '25px', height: '25px' }} />
              </div>
            </Col>
            <Col span={9} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '30px', fontWeight: 700, marginTop: '24px' }}>{userInfo.name}</span>
              <a
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#65686c',
                  textDecoration: 'none'
                }}
                onMouseEnter={e => (e.target.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.target.style.textDecoration = 'none')}
              >
                {friendCount} người bạn
              </a>
            </Col>
            <Col style={{ paddingRight: '0px' }} span={9}>
              <div style={{ marginTop: '40px', textAlign: 'right' }}>
                <button className={styles['blue-button']}>
                  <IoMdAdd />
                  Thêm vào tin
                </button>
                <button className={styles['white-button']}>
                  <FaPen />
                  Chỉnh sửa trang cá nhân
                </button>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  display: 'flex',
                  justifyContent: 'end'
                }}
              >
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 16px'
                  }}
                  className={styles['small-button']}
                  onClick={toggleFriendSuggestion}
                >
                  <IoIosArrowDown className={`${styles.arrowIcon} ${isFriendSuggestionVisible ? styles.arrowIconRotated : ''}`} />
                </button>
              </div>
            </Col>
          </Row>

          {isFriendSuggestionVisible && (
            <Row style={{ width: '100%' }}>
              <FriendSuggestion />
            </Row>
          )}

          <Row
            className={styles['tabs-select']}
            style={{
              overflow: 'hidden',
              height: '49px',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline'
            }}
          >
            <Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
              <Tabs.TabPane tab={<span className={styles.tab}>Bài viết</span>} key="1" />
              <Tabs.TabPane tab={<span className={styles.tab}>Giới thiệu</span>} key="2" />
              <Tabs.TabPane tab={<span className={styles.tab}>Bạn bè</span>} key="3" />
              <Tabs.TabPane tab={<span className={styles.tab}>Ảnh</span>} key="4" />
              <Tabs.TabPane tab={<span className={styles.tab}>Video</span>} key="5" />
              <Tabs.TabPane tab={<span className={styles.tab}>Reels</span>} key="6" />
              <Tabs.TabPane tab={<span className={styles.tab}>Xem thêm</span>} key="7" />
            </Tabs>
            <Dropdown overlay={menu} trigger={['click']}>
              <button style={{ alignItems: 'center', padding: '0 16px' }} className={styles['small-button']}>
                <EllipsisOutlined />
              </button>
            </Dropdown>
          </Row>
        </div>
      </div>

      <div className={styles['container-2']}>
        <div className={styles['content']} style={{ width: headerWidth }}>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;