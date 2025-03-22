// /src/components/StoryList.jsx
import React from 'react';
import { Avatar, Button } from 'antd';

const stories = [
  { name: 'Tạo tin', isCreate: true },
  { name: 'Phạm Hoàng Thọ', image: 'https://via.placeholder.com/150', profilePic: 'https://via.placeholder.com/30', isActive: true },
  { name: 'Guga Foods', image: 'https://via.placeholder.com/150', profilePic: 'https://via.placeholder.com/30' },
  // Add more stories here if needed
];

const StoryList = () => {
  return (
    <div style={styles.container}>
      {stories.map((story, index) => (
        <div key={index} style={styles.storyCard}>
          {story.isCreate ? (
            <div style={styles.createStory}>
              <div style={styles.createStoryBackground}>
                <Avatar size={40} icon={<img src="https://via.placeholder.com/150" alt="create story" />} />
              </div>
              <Button style={styles.createButton}>+</Button>
              <div style={styles.storyLabel}>Tạo tin</div>
            </div>
          ) : (
            <div style={styles.storyContent}>
              <img src={story.image} alt={story.name} style={styles.storyImage} />
              <div style={styles.profileContainer}>
                <Avatar size={24} src={story.profilePic} />
                {story.isActive && <span style={styles.activeIndicator} />}
              </div>
              <div style={styles.storyName}>{story.name}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '10px 0',
    backgroundColor: '#f0f2f5',
    borderRadius: '8px',
    width: '100%',
    whiteSpace: 'nowrap',
    margin: '10px auto'
  },
  storyCard: {
    width: '100px',
    minWidth: '100px',
    position: 'relative',
    textAlign: 'center',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  createStory: {
    position: 'relative',
    height: '170px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  createStoryBackground: {
    width: '100%',
    height: '100px',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: '45px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#1877f2',
    color: '#fff',
    border: 'none',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyLabel: {
    padding: '10px 0',
    fontWeight: '500',
    fontSize: '12px',
  },
  storyContent: {
    height: '170px',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  profileContainer: {
    position: 'absolute',
    top: '8px',
    left: '8px',
    borderRadius: '50%',
    border: '2px solid #1877f2',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff00',
    borderRadius: '50%',
    border: '1px solid white',
  },
  storyName: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    padding: '4px 0',
    fontSize: '12px',
    fontWeight: '500',
  },
};

export default StoryList;
