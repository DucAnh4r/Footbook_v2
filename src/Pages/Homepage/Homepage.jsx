import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import StatusInput from "./StatusInput";
import StoryList from "./StoryList";
import Post from "../../Components/Post";
import Reels from "./Reels";
import LeftSidebar from "./LeftSidebar/LeftSidebar";
import RightSidebar from "./RightSidebar/RightSidebar";
import "./Homepage.scss";
import SuggestedFriends from "../ProfilePage/UserProfilePage/SuggestedFriends";
import GroupPost from "../../Components/GroupPost";
import { useAuthCheck } from "../../utils/checkAuth";
import { getUserIdFromLocalStorage } from "../../utils/authUtils";
import { getFeedPostsService } from "../../services/postService";
import SharedPost from "../../Components/SharedPost";
import { userFindByIdService } from "../../services/userService";

const { Sider, Content } = Layout;

const Homepage = () => {
  useAuthCheck();
  const [posts, setPosts] = useState([]); // Lưu danh sách bài viết
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const user_id = getUserIdFromLocalStorage(); // Lấy userId từ localStorage
  const [userInfo, setUserInfo] = useState([]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(user_id);
      setUserInfo(response?.data?.user || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getFeedPostsService(user_id);
      setPosts(response?.data?.posts || []); // Lưu dữ liệu trả về
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  document.title = "Trang chủ";
  return (
    <>
      <Sider
        width={360}
        style={{
          background: "#f5f5f5",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: "64px",
          left: "0",
          zIndex: "100",
        }}
        className="scroll-on-hover"
      >
        <LeftSidebar user_id={user_id} />
      </Sider>

      <Content
        style={{ padding: "70px 370px", minHeight: "100vh", overflow: "unset" }}
      >
        <div className="page-content" style={{ padding: "16px 30px" }}>
          <StatusInput userName={userInfo?.name} avatar={userInfo?.avatar_url} onPostCreated={fetchPosts} />

          {loading ? (
            <p>Đang tải bài viết...</p>
          ) : posts.length > 0 ? (
            posts
              .filter((post) => !post.isDeleted)
              .map((post) =>
                post.share ? (
                  <SharedPost
                    key={post.post_id}
                    postId={post.post_id}
                    content={post.content}
                    createdAt={post.create_at}
                    userId={post.user_id}
                    images={post.images}
                    shareId={post.share}
                  />
                ) : (
                  <Post
                    key={post.id}
                    postId={post.id}
                    content={post.content}
                    createdAt={post.created_at}
                    userId={post.user.id}
                    images={post.images}
                    isModalOpen={false}
                  />
                )
              )
          ) : (
            <p>Không có bài viết nào để hiển thị.</p>
          )}
        </div>
      </Content>

      <Sider
        width={360}
        style={{
          background: "#f5f5f5",
          height: "100vh",
          overflow: "hidden",
          position: "fixed",
          top: "64px",
          right: "0",
          zIndex: "100",
        }}
        className="scroll-on-hover"
      >
        <RightSidebar />
      </Sider>
    </>
  );
};

export default Homepage;
