import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import LeftSidebar from "./Components/LeftSidebar";
import FriendRequestsList from "./Components/FriendRequestsList";
import { useAuthCheck } from "../../utils/checkAuth";
import { getFriendshipRequestService, getSuggestedFriendsService, createFriendshipService } from "../../services/friendService";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";

const { Sider, Content } = Layout;

const FriendsHomePage = () => {
  useAuthCheck();
  const userId = getUserIdFromLocalStorage();
  
  // State để lưu danh sách lời mời kết bạn và gợi ý kết bạn
  const [friendRequests, setFriendRequests] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState({
    requests: true,
    suggestions: true
  });

  // Fetch lời mời kết bạn
  const fetchFriendRequests = async () => {
    try {
      setLoading(prev => ({ ...prev, requests: true }));
      const response = await getFriendshipRequestService({ user_id: userId });
      if (response.data && response.data.received_requests) {
        const formattedData = response.data.received_requests.map((item) => ({
          id: item.id,
          requesterId: item.requester.id,
          name: item.requester.name,
          email: item.requester.email,
          image: item.requester.avatar_url,
          coverPhoto: item.requester.cover_photo_url,
          birthYear: item.requester.birth_year,
          profession: item.requester.profession,
          address: item.requester.address,
          status: item.status,
          createdAt: item.requester.created_at,
        }));
        setFriendRequests(formattedData);
      } else {
        console.error("No friend requests found or malformed response.");
        setFriendRequests([]);
      }
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      setFriendRequests([]);
    } finally {
      setLoading(prev => ({ ...prev, requests: false }));
    }
  };

  // Fetch danh sách gợi ý kết bạn
  const fetchSuggestedFriends = async () => {
    try {
      setLoading(prev => ({ ...prev, suggestions: true }));
      const response = await getSuggestedFriendsService({ 
        user_id: userId,
        limit: 20 // Lấy tối đa 20 gợi ý
      });
      
      if (response.data && response.data.suggested_friends) {
        const formattedData = response.data.suggested_friends.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          image: item.avatar_url,
          coverPhoto: item.cover_photo_url,
          birthYear: item.birth_year,
          profession: item.profession,
          address: item.address,
          mutualFriends: item.mutual_friends_count,
          createdAt: item.created_at,
        }));
        setSuggestedFriends(formattedData);
      } else {
        console.error("No suggested friends found or malformed response.");
        setSuggestedFriends([]);
      }
    } catch (error) {
      console.error("Error fetching suggested friends:", error);
      setSuggestedFriends([]);
    } finally {
      setLoading(prev => ({ ...prev, suggestions: false }));
    }
  };

  // Xử lý gửi lời mời kết bạn
  const handleSendFriendRequest = async (addresseeId) => {
    try {
      await createFriendshipService({
        requester_id: userId,
        addressee_id: addresseeId
      });
      // Cập nhật lại danh sách gợi ý sau khi gửi lời mời
      fetchSuggestedFriends();
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Xóa khỏi danh sách gợi ý
  const handleRemoveSuggestion = (friendId) => {
    setSuggestedFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
      fetchSuggestedFriends();
    }
  }, [userId]);

  return (
    <Layout>
      <Sider
        width={360}
        style={{
          background: "white",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: "64px",
          left: "0",
          zIndex: "100",
          boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        }}
        className="scroll-on-hover"
      >
        <LeftSidebar />
      </Sider>

      <Content
        style={{
          padding: "70px 0px 70px 380px",
          minHeight: "100vh",
          overflow: "auto",
        }}
      >
        <div className="page-content">
          {/* Hiển thị Lời mời kết bạn */}
          <FriendRequestsList
            userId={userId}
            requestsType="friendRequests"
            data={friendRequests}
            fetchFriendRequests={fetchFriendRequests}
            loading={loading.requests}
          />

          {/* Hiển thị Những người bạn có thể biết */}
          <FriendRequestsList
            userId={userId}
            requestsType="suggestedFriends"
            data={suggestedFriends}
            loading={loading.suggestions}
            onSendRequest={handleSendFriendRequest}
            onRemoveSuggestion={handleRemoveSuggestion}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FriendsHomePage;