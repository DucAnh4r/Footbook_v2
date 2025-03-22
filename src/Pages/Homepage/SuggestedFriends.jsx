// /src/components/SuggestedFriends.jsx
import React from 'react';
import { Avatar, Button, Card } from 'antd';
import { LeftOutlined, RightOutlined, CloseOutlined, UserAddOutlined } from '@ant-design/icons';

const suggestedFriends = [
  { name: 'Phương Linh', image: 'https://via.placeholder.com/150' },
  { name: 'Luqman', image: 'https://via.placeholder.com/150', followers: '123 người theo dõi' },
  { name: 'Vo Hang', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  { name: 'Lê Thành', image: 'https://via.placeholder.com/150' },
  // Add more friends here if needed
];

const SuggestedFriends = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.title}>Những người bạn có thể biết</span>
        <RightOutlined style={{ cursor: 'pointer', fontSize: '16px', color: 'gray' }} />
      </div>
      <div style={styles.friendList}>
        {suggestedFriends.map((friend, index) => (
          <Card key={index} style={styles.card} bodyStyle={styles.cardBody}>
            <CloseOutlined style={styles.closeIcon} />
            <Avatar src={friend.image} style={styles.avatar} size={80} />
            <div style={styles.friendInfo}>
              <span style={styles.friendName}>{friend.name}</span>
              {friend.followers && <span style={styles.followers}>{friend.followers}</span>}
            </div>
            <Button type="primary" icon={<UserAddOutlined />} style={styles.addButton}>Thêm bạn bè</Button>
          </Card>
        ))}
      </div>
      <div style={styles.footer}>
        <a href="#" style={styles.seeAllLink}>Xem tất cả</a>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '680px',
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
    paddingBottom: '16px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '16px',
  },
  friendList: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
    flexWrap: 'nowrap',
  },
  card: {
    minWidth: '130px',
    maxWidth: '130px',
    border: '1px solid #f0f2f5',
    borderRadius: '8px',
    position: 'relative',
    textAlign: 'center',
    flexShrink: 0,
  },
  cardBody: {
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '12px',
    color: 'gray',
    cursor: 'pointer',
  },
  avatar: {
    marginBottom: '8px',
  },
  friendInfo: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  friendName: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  followers: {
    fontSize: '12px',
    color: 'gray',
  },
  addButton: {
    fontSize: '12px',
    fontWeight: '500',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    textAlign: 'center',
    marginTop: '8px',
  },
  seeAllLink: {
    color: '#1877f2',
    fontWeight: 'bold',
    fontSize: '14px',
    textDecoration: 'none',
  },
};

export default SuggestedFriends;
