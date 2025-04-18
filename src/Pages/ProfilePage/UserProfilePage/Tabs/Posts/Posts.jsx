import React, { useEffect, useState } from "react";
import AboutSection from "./AboutSection";
import { Col, Row, Space } from "antd";
import StatusInput from "../../../../Homepage/StatusInput";
import Post from "../../../../../Components/Post";
import PostFilter from "./PostFilter";
import PhotoGallery from "./PhotoGallery";
import FriendsList from "./FriendsList";
import styles from "./Posts.module.scss";
import { getUserIdFromLocalStorage } from "../../../../../utils/authUtils";
import { getPostByUserIdService } from "../../../../../services/postService";
import SharedPost from "../../../../../Components/SharedPost";

const Posts = ({ userInfo, userName, avatar }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = getUserIdFromLocalStorage();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPostByUserIdService(user_id, 1000);
      setPosts(response?.data?.posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <Row gutter={16}>
      <Col span={10} className={styles.leftCol}>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <AboutSection userInfo={userInfo} />
          <PhotoGallery />
          <FriendsList />
        </Space>
      </Col>
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        span={14}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <StatusInput userName={userName} avatar={avatar} onPostCreated={fetchPosts} />
          <PostFilter />
          {loading ? (
            <p>Đang tải bài viết...</p>
          ) : posts.length > 0 ? (
            posts.map((post) =>
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
        </Space>
      </Col>
    </Row>
  );
};

export default Posts;
