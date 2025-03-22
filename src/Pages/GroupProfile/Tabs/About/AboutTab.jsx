import React from 'react';
import AboutCard from './AboutCard';
import { Col, Row, Space } from 'antd';
import styles from './AboutTab.module.scss';
import MembersCard from './MembersCard';
import ActionCard from './ActionCard';

const AboutTab = () => {
  return (
    <Row gutter={16}>
      <Col
        span={24}
        className={styles.leftCol}
      >
        <AboutCard />
        <div style={{ height: '16px' }}></div>
        <MembersCard />
        <div style={{ height: '16px' }}></div>
        <ActionCard />

      </Col>
    </Row>
  );
};

export default AboutTab;
