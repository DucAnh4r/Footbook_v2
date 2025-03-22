// SidebarMenu.js
import React from 'react';
import { Menu } from 'antd';

const SidebarMenu = ({ onSelect }) => (
  <Menu
    onClick={(e) => onSelect(e.key)}
    mode="inline"
    defaultSelectedKeys={['overview']}
    style={{ width: 256 }}
  >
    <Menu.Item key="overview">Tổng quan</Menu.Item>
    <Menu.Item key="workEducation">Công việc và học vấn</Menu.Item>
    <Menu.Item key="placesLived">Nơi từng sống</Menu.Item>
    <Menu.Item key="contactInfo">Thông tin liên hệ và cơ bản</Menu.Item>
    <Menu.Item key="familyRelationships">Gia đình và các mối quan hệ</Menu.Item>
    <Menu.Item key="about">Chi tiết về bạn</Menu.Item>
    <Menu.Item key="lifeEvents">Sự kiện trong đời</Menu.Item>
  </Menu>
);

export default SidebarMenu;
