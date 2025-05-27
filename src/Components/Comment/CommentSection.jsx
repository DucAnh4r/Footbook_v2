import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Avatar, Skeleton, Button } from 'antd';
import { IoIosSend } from 'react-icons/io';
import styles from './CommentSection.module.scss';

import Comment from './Comment';
import { addCommentService, countCommentService, getCommentService } from '../../services/commentService';

const CommentSection = ({ postId, userId, userInfo, isModalOpen }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState(null);

  // Log props for debugging
  console.log('CommentSection props:', { postId, userId, userInfo, isModalOpen });

  // Fetch comments and count in a single function
  const fetchCommentsAndCount = useCallback(async () => {
    if (!postId) {
      console.warn('Skipping fetch: postId is missing', { postId });
      setError('Invalid post ID. Cannot load comments.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching comments for postId:', postId);
      const [commentResponse, countResponse] = await Promise.all([getCommentService(postId), countCommentService(postId)]);
      setComments(commentResponse?.data?.comments || []);
      setCommentCount(countResponse.total_comment_count || 0);
    } catch (error) {
      console.error('Error fetching comments or count:', error);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // Fetch data when postId changes
  useEffect(() => {
    if (postId && isModalOpen) {
      console.log('Triggering fetchCommentsAndCount for postId:', postId);
      fetchCommentsAndCount();
    } else {
      console.warn('useEffect skipped:', { postId, isModalOpen });
    }
  }, [postId, isModalOpen, fetchCommentsAndCount]);

  // Handle comment submission
  const handleAddComment = useCallback(async () => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      console.log('Comment submission skipped: empty comment');
      return;
    }

    if (!userId || !postId) {
      console.warn('Cannot submit comment: missing userId or postId', { userId, postId });
      setError('Please log in to comment.');
      return;
    }

    try {
      console.log('Submitting comment for postId:', postId, 'userId:', userId);
      await addCommentService({
        userId,
        postId,
        content: trimmedComment
      });

      console.log('Comment added successfully');
      setCommentText('');
      fetchCommentsAndCount();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  }, [commentText, userId, postId, fetchCommentsAndCount]);

  // Handle Enter key press
  const handleKeyPress = useCallback(
    e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    },
    [handleAddComment]
  );

  // Early return if critical props are missing
  if (!postId) {
    console.error('CommentSection: Invalid postId');
    return <div>Invalid post ID. Cannot load comments.</div>;
  }

  return (
    <>
      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h3>{`Bình luận (${commentCount})`}</h3>

        {error && (
          <div>
            <p className={styles.error}>{error}</p>
            <Button onClick={fetchCommentsAndCount}>Retry</Button>
          </div>
        )}

        {loading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={styles.skeletonComment}>
              <Skeleton.Avatar active size="small" style={{ marginRight: 10 }} />
              <Skeleton.Input active style={{ width: '80%' }} />
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map(comment => (
            <Comment
              key={comment.id}
              commentId={comment.id}
              content={comment.content}
              createdAt={comment.created_at}
              userId={comment.user?.id || comment.user_id}
              postId={postId}
              isParentComment={true} // Pass isParentComment={true} for parent comments
            />
          ))
        ) : (
          <p>Không có bình luận nào để hiển thị.</p>
        )}
      </div>

      {/* Comment Input Section */}
      <div className={styles.inputCommentSection}>
        <Row>
          <Col style={{ paddingTop: '10px' }} span={2}>
            <Avatar src={userInfo?.avatar_url || 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/40'} className={styles.avatar} />
          </Col>
          <Col style={{ paddingLeft: '10px' }} span={22}>
            <div className={styles.inputCommentContainer}>
              <textarea style={{ overflow: 'hidden', height: '100%' }} placeholder="Viết bình luận..." value={commentText} onChange={e => setCommentText(e.target.value)} onKeyPress={handleKeyPress} disabled={!userId} />
              <IoIosSend
                className={styles.sendCommentButton}
                style={{
                  color: commentText.trim() && userId ? 'blue' : 'gray',
                  cursor: commentText.trim() && userId ? 'pointer' : 'not-allowed'
                }}
                onClick={handleAddComment}
                aria-label="Send comment"
              />
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default React.memo(CommentSection);
