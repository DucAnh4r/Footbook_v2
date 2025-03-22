import React from 'react';
import { Col, Row, Space } from 'antd';
import StatusInput from '../../../Homepage/StatusInput';
import Post from '../../../../Components/Post';
import PostFilter from './PostFilter';
import styles from './Discussion.module.scss';
import AboutCard from '../About/AboutCard';

const Discussion = () => {
  return (
    <Row gutter={16}>
      <Col
        span={16}
        className={styles.leftCol}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <StatusInput />
          <PostFilter />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </Space>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} span={8}>
        <AboutCard />
      </Col>
    </Row>
  );
};

export default Discussion;
