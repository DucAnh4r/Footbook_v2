import React, { useState, useEffect } from 'react';
import { Layout, message, Spin } from 'antd';
import { useParams } from 'react-router-dom';
import styles from './ShowFriendsPage.module.scss';
import FriendInvitations from './Sidebars/FriendInvitations';
import SuggestedFriends from './Sidebars/SuggestedFriends'; 
import FriendPicture from '../../../assets/image/FriendPage/friends.png';
import { useAuthCheck } from '../../../utils/checkAuth';
import FriendProfilePage from '../../ProfilePage/FriendProfilePage/FriendProfilePage';
import AllFriends from './Sidebars/AllFriends';
import { getSuggestedFriendsService } from '../../../services/friendService';
import { getUserIdFromLocalStorage } from '../../../utils/authUtils';

const { Sider, Content } = Layout;

const ShowFriendsPage = () => {
  useAuthCheck();
  const userId = getUserIdFromLocalStorage();
  const { type } = useParams(); // Get type parameter from URL
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  // Fetch suggested friends when component mounts
  useEffect(() => {
    if (type === 'suggested') {
      fetchSuggestedFriends();
    }
  }, [type]);

  // Function to fetch suggested friends from API
  const fetchSuggestedFriends = async () => {
    try {
      setLoading(true);
      const response = await getSuggestedFriendsService({ user_id: userId });
      
      if (response.data && response.data.suggested_friends) {
        setSuggestedUsers(response.data.suggested_friends);
      } else {
        message.error("Không thể tải danh sách gợi ý bạn bè");
        setSuggestedUsers([]);
      }
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
      message.error("Đã xảy ra lỗi khi tải danh sách gợi ý bạn bè");
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Render the appropriate sidebar based on URL parameter
  const renderSidebar = () => {
    switch (type) {
      case 'requests':
        return <FriendInvitations onSelectUser={handleSelectUser} />;
      case 'suggested':
        return <SuggestedFriends 
                 users={suggestedUsers} 
                 onSelectUser={handleSelectUser} 
                 selectedUserId={selectedUserId}
                 loading={loading}
                 fetchSuggestedFriends={fetchSuggestedFriends}
               />;
      default:
        return <AllFriends onSelectUser={handleSelectUser} />;
    }
  };

  return (
    <Layout>
      <Sider
        width={360}
        style={{
          background: 'white',
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          position: 'fixed',
          top: '64px',
          left: '0',
          zIndex: '100',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)', 
          paddingBottom: '60px',
        }}
        className="scroll-on-hover"
      >
        {renderSidebar()}
        <div style={{ height: '16px' }}></div>
      </Sider>

      <Content style={{ padding: '64px 0 16px 360px', minHeight: '100vh', overflow: 'auto' }}>
        <div className="page-content">
          {selectedUserId ? (
            <div className={styles.userDetails}>
              <FriendProfilePage userId2={selectedUserId} type="prop"/>
            </div>
          ) : (
            <div className={styles['content']}>
              <img className={styles['empty-img']} src={FriendPicture} alt="Friend" />
              <span className={styles['empty-txt']}>
                Chọn tên của người mà bạn muốn xem trước trang cá nhân
              </span>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default ShowFriendsPage;