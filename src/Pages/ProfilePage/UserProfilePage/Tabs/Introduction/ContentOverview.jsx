// ContentOverview.js
import React from 'react';
import { List } from 'antd';

const ContentOverview = () => (
  <List
    itemLayout="horizontal"
    dataSource={[
      {
        title: 'Học Công Nghệ Thông Tin tại Trường Đại học Xây dựng Hà Nội - Hanoi University of Civil Engineering',
        icon: '🏫',
      },
      {
        title: 'Sống tại Hà Nội',
        icon: '🏠',
      },
      {
        title: '097 166 54 75',
        icon: '📞',
      },
    ]}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<span style={{ fontSize: '20px' }}>{item.icon}</span>}
          title={item.title}
        />
      </List.Item>
    )}
  />
);

export default ContentOverview;
