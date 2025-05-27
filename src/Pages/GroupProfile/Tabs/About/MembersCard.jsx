import React from 'react';
import { Avatar, Row, Col } from 'antd';
import styles from './MembersCard.module.scss';

const MembersCard = () => {
  const members = [
    { id: 1, name: 'Nguyễn Huy Hoàng', role: 'Quản trị viên', avatar: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/50' },
    { id: 2, name: 'Bạn A', role: '', avatar: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/50' },
    { id: 3, name: 'Bạn B', role: '', avatar: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/50' },
    { id: 4, name: 'Bạn C', role: '', avatar: 'https://https://cdn.vectorstock.com/i/500p/29/53/gray-silhouette-avatar-for-male-profile-picture-vector-56412953.jpg.com/50' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span>Thành viên - 420,1K</span>
      </div>
      <Row gutter={[16, 16]} className={styles.membersList}>
        {members.map(member => (
          <Col key={member.id} span={6} className={styles.memberItem}>
            <Avatar size={50} src={member.avatar} />
            <div className={styles.memberInfo}>
              <span className={styles.name}>{member.name}</span>
              {member.role && <span className={styles.role}>{member.role}</span>}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MembersCard;
