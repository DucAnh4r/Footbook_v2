import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { AppstoreOutlined, BarsOutlined, FilterOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './PostFilter.module.scss';

const PostFilter = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' hoặc 'grid'

  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topRow}>
        <div className={styles.title}>Bài viết</div>
        <div className={styles.actions}>
          <Button icon={<FilterOutlined />} className={styles.button}>Bộ lọc</Button>
          <Button icon={<SettingOutlined />} className={styles.button}>Quản lý bài viết</Button>
        </div>
      </div>
      <div className={styles.separator} />
      <div className={styles.viewModes}>
        <Space size="middle">
          <span
            className={`${styles.viewOption} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => handleViewChange('list')}
          >
            <BarsOutlined /> Chế độ xem danh sách
          </span>
          <span
            className={`${styles.viewOption} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => handleViewChange('grid')}
          >
            <AppstoreOutlined /> Chế độ xem lưới
          </span>
        </Space>
      </div>
    </div>
  );
};

export default PostFilter;
