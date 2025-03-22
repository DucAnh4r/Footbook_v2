import React, { useState } from 'react';
import { Layout } from 'antd';
import { useParams } from 'react-router-dom';
import styles from './ShowFriendsPage.module.scss';
import FriendInvitations from './Sidebars/FriendInvitations';
import SuggestedFriends from './Sidebars/SuggestedFriends'; 
import FriendPicture from '../../../assets/image/FriendPage/friends.png';
import ProfilePage from '../../ProfilePage/UserProfilePage/ProfilePage';
import { useAuthCheck } from '../../../utils/checkAuth';
import FriendProfilePage from '../../ProfilePage/FriendProfilePage/FriendProfilePage';
import AllFriends from './Sidebars/AllFriends';

const { Sider, Content } = Layout;

const ShowFriendsPage = () => {
  useAuthCheck();

  const { type } = useParams(); // Lấy tham số type từ URL
  const [selectedUserId, setSelectedUserId] = useState(null); // State lưu ID người dùng đã chọn

  // Hàm gọi khi click vào một bạn trong FriendRequestItem
  const handleSelectUser = (senderId) => {
    setSelectedUserId(senderId);
    console.log(senderId);
  }

    // Dữ liệu mẫu người dùng
    const users = [
      { id: 1, name: 'Lionel Messi', bio: 'This is a bio about Messi.' },
      { id: 2, name: 'Cristiano Ronaldo', bio: 'This is a bio about Ronaldo.' },{ id: 11, name: 'Lionel Messi', bio: 'This is a bio about Messi.' },
      { id: 22, name: 'Cristiano Ronaldo', bio: 'This is a bio about Ronaldo.' },{ id: 41, name: 'Lionel Messi', bio: 'This is a bio about Messi.' },
      { id: 222, name: 'Cristiano Ronaldo', bio: 'This is a bio about Ronaldo.' },{ id: 21, name: 'Lionel Messi', bio: 'This is a bio about Messi.' },
      { id: 212, name: 'Cristiano Ronaldo', bio: 'This is a bio about Ronaldo.' },{ id: 15, name: 'Lionel Messi', bio: 'This is a bio about Messi.' },
      { id: 234, name: 'Cristiano Ronaldo', bio: 'This is a bio about Ronaldo.' },
      // Thêm người dùng khác vào đây
    ];

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
        {(() => {
          switch (type) {
            case 'requests':
              return <FriendInvitations onSelectUser={handleSelectUser} />;
            case 'suggested':
              return <SuggestedFriends users={users} onSelectUser={handleSelectUser} />;
            default:
              return <AllFriends onSelectUser={handleSelectUser} />;
          }
        })()}
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
