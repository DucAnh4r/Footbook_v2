import React, { useEffect, useState, useCallback, useMemo } from 'react';
import AboutSection from './AboutSection';
import { Col, Row, Space, Skeleton } from 'antd';
import StatusInput from '../../../../Homepage/StatusInput';
import Post from '../../../../../Components/Post';
import PostFilter from './PostFilter';
import PhotoGallery from './PhotoGallery';
import FriendsList from './FriendsList';
import styles from './Posts.module.scss';
import { getUserIdFromLocalStorage } from '../../../../../utils/authUtils';
import { getPostByUserIdService } from '../../../../../services/postService';
import SharedPost from '../../../../../Components/SharedPost';

const Posts = ({ userInfo, userName, avatar }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user_id = useMemo(() => getUserIdFromLocalStorage(), []);
  
  // Use a fixed number or make it configurable for pagination
  const POST_LIMIT = 10;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPostByUserIdService(user_id, POST_LIMIT);
      setPosts(response?.data?.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Memoize the post rendering to avoid re-rendering when other state changes
  const renderPosts = useMemo(() => {
    if (loading) {
      return (
        <div className={styles.loadingPosts}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <Skeleton active avatar paragraph={{ rows: 4 }} style={{ marginTop: '20px' }} />
        </div>
      );
    }
    
    if (posts.length === 0) {
      return <p>Không có bài viết nào để hiển thị.</p>;
    }
    
    return posts.map(post => {
      const key = `post-${post.id}`;
      
      if (post.shareId !== 0 && post.shareId !== null) {
        return (
          <SharedPost 
            key={key}
            postId={post.id} 
            content={post.content} 
            createdAt={post.created_at} 
            userId={post.user_id} 
            images={post.images || []} 
            shareId={post.shareId} 
            user={userInfo}
          />
        );
      }
      
      return (
        <Post 
          key={key}
          postId={post.id} 
          content={post.content} 
          createdAt={post.created_at} 
          userId={post.user?.id} 
          images={post.images || []} 
          isModalOpen={false}
          user={userInfo} 
        />
      );
    });
  }, [loading, posts, userInfo]);

  return (
    <Row gutter={16} className={styles.postsContainer}>
      <Col span={10} className={styles.leftCol}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <AboutSection userInfo={userInfo} />
          <PhotoGallery />
          <FriendsList />
        </Space>
      </Col>
      <Col
        className={styles.rightCol}
        span={14}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <StatusInput 
            userName={userName} 
            avatar={avatar} 
            onPostCreated={fetchPosts} 
          />
          <PostFilter />
          {renderPosts}
        </Space>
      </Col>
    </Row>
  );
};

export default React.memo(Posts);