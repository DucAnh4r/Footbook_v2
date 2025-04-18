import React, { useState } from 'react';
import { Tabs } from 'antd';
import ProfileContent from './ProfileContent';

const { TabPane } = Tabs;

const Introduction = ({ userInfo, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
      <Tabs
        tabPosition="left"
        defaultActiveKey="overview"
        onChange={handleTabChange}
      >
        <TabPane tab="Tổng quan" key="overview" />
        <TabPane tab="Công việc và học vấn" key="work" />
        <TabPane tab="Nơi từng sống" key="living" />
        <TabPane tab="Thông tin liên hệ và cơ bản" key="contact" />
        <TabPane tab="Gia đình và các mối quan hệ" key="family" />
        <TabPane tab="Chi tiết về bạn" key="details" />
        <TabPane tab="Sự kiện trong đời" key="events" />
      </Tabs>
      <ProfileContent userInfo={userInfo} activeTab={activeTab} onProfileUpdated={onProfileUpdated} />
    </div>
  );
};

export default Introduction;
