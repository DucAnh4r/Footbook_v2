import React, { useEffect, useState } from 'react';
import styles from "./PostPage.module.scss";
import { useParams, useNavigate } from 'react-router-dom';
import { getPostByIdService } from '../../services/postService';
import SharedPost from '../../Components/SharedPost';
import Post from '../../Components/Post';

const PostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // Hook để điều hướng người dùng
  const [post, setPost] = useState(null); // Bài viết cần hiển thị
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const getPost = async () => {
    try {
      setLoading(true);
      const response = await getPostByIdService(postId);

      if (response?.data?.data?.postResponse) {
        const fetchedPost = response.data.data.postResponse;

        // Kiểm tra biến isDeleted, nếu true chuyển hướng sang /error
        if (fetchedPost.isDeleted) {
          navigate('/error');
          return;
        }

        setPost(fetchedPost); // Lưu bài viết
      } else {
        console.warn("Post not found");
        setPost(null);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setPost(null); // Nếu có lỗi, đặt bài viết thành null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("aaaaaaaaaaaaa",postId);
    getPost();
  }, [postId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>; // Hiển thị khi bài viết không tồn tại
  }

  return (
    <div className={styles['container']}>
      <div className={styles['post-container']}> 
        {post.share ? (
          <SharedPost
            postId={post.post_id}
            content={post.content}
            createdAt={post.create_at}
            userId={post.user_id}
            images={post.images}
            shareId={post.share}
          />
        ) : (
          <Post
            postId={post.post_id}
            content={post.content}
            createdAt={post.create_at}
            userId={post.user_id}
            images={post.images}
            isModalOpen={false}
          />
        )}
      </div>
    </div>
  );
};

export default PostPage;
