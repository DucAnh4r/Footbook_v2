// /src/components/Reels.jsx
import React from 'react';
import { Card, Avatar, Button } from 'antd';
import { RightOutlined, LeftOutlined } from '@ant-design/icons';

const reelsData = [
  { title: 'Miền Mến', video: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/150', profilePic: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/40', author: 'Author 1' },
  { title: 'Thong Prank On My Hispanic Grandma 🍑', video: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/150', profilePic: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/40', author: 'Author 2' }
  // Add more reels data if needed
];

const Reels = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>
          <Avatar src="https://img.icons8.com/ios-filled/50/000000/instagram-reels.png" size={20} style={{ marginRight: 8 }} />
          Reels và video ngắn
        </span>
        <Button type="link" style={styles.createButton}>
          Tạo
        </Button>
      </div>
      <div style={styles.reelsContainer}>
        <Button icon={<LeftOutlined />} style={styles.navButton} />
        <div style={styles.reelsList}>
          {reelsData.map((reel, index) => (
            <Card key={index} style={styles.reelCard} bodyStyle={styles.reelBody}>
              <div style={styles.videoContainer}>
                <img src={reel.video} alt={reel.title} style={styles.video} />
                <div style={styles.overlayText}>{reel.title}</div>
              </div>
            </Card>
          ))}
        </div>
        <Button icon={<RightOutlined />} style={styles.navButton} />
      </div>
      <div style={styles.footer}>
        <a href="#" style={styles.seeMoreLink}>
          Xem thêm
        </a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    padding: '16px',
    marginBottom: '16px',
    margin: '10px auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px'
  },
  title: {
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center'
  },
  createButton: {
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#1877f2'
  },
  reelsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  navButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'gray',
    fontSize: '16px'
  },
  reelsList: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    maxWidth: '100%',
    paddingBottom: '8px'
  },
  reelCard: {
    width: '150px',
    minWidth: '150px',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    flexShrink: 0 // Prevents card from shrinking on smaller screens
  },
  reelBody: {
    padding: 0
  },
  videoContainer: {
    position: 'relative',
    height: '250px',
    width: '100%'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  overlayText: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    textShadow: '0px 0px 5px rgba(0,0,0,0.5)'
  },
  footer: {
    textAlign: 'center',
    marginTop: '8px'
  },
  seeMoreLink: {
    color: '#1877f2',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none'
  }
};

export default Reels;
