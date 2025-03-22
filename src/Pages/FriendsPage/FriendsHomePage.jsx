import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import LeftSidebar from './Components/LeftSidebar';
import FriendRequestsList from './Components/FriendRequestsList';
import { useAuthCheck } from '../../utils/checkAuth';
import { getFriendshipRequestService } from '../../services/friendService';
import { getUserIdFromLocalStorage } from '../../utils/authUtils';

const { Sider, Content } = Layout;

const FriendsHomePage = () => {
  useAuthCheck();
  const userId1 = getUserIdFromLocalStorage(); // Lấy userId1 từ localStorage
  console.log(userId1); // Kiểm tra console để đảm bảo userId2 có giá trị

  

  // State để lưu danh sách lời mời kết bạn
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId2 = userId1;
    const fetchFriendRequests = async () => {
      try {
        const response = await getFriendshipRequestService({ userId2 });
        if (response.data.success) {
          // Map dữ liệu trả về thành định dạng phù hợp
          const formattedData = response.data.data.map((item) => ({
            name: item.fullName,
            image: item.profilePictureUrl,
            sentAt: item.sentAt,
          }));
          setFriendRequests(formattedData);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendRequests();
  }, []);

  // Dữ liệu ví dụ cho "Những người bạn có thể biết"
  const suggestedFriends = [
    {
      name: 'John Doe',
      image: 'https://cdn.britannica.com/37/231937-050-9228ECA1/Drake-rapper-2019.jpg?w=400&h=300&c=crop',
      mutualFriends: 5,
    },
  ];

  return (
    <Layout>
      <Sider
        width={360}
        style={{
          background: 'white',
          height: '100vh',
          overflow: 'hidden',
          position: 'fixed',
          top: '64px',
          left: '0',
          zIndex: '100',
          boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
        }}
        className="scroll-on-hover"
      >
        <LeftSidebar />
      </Sider>

      <Content style={{ padding: '70px 0px 70px 380px', minHeight: '100vh', overflow: 'auto' }}>
        <div className="page-content">
          {/* Hiển thị Lời mời kết bạn */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <FriendRequestsList requestsType="friendRequests" data={friendRequests} />
          )}

          {/* Hiển thị Những người bạn có thể biết */}
          <FriendRequestsList requestsType="suggestedFriends" data={suggestedFriends} />
        </div>
      </Content>
    </Layout>
  );
};

export default FriendsHomePage;
