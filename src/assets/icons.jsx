// /src/assets/icons.jsx
import React from 'react';
import { RiHome2Line, RiHome2Fill, RiTeamLine, RiTeamFill, RiGroup2Line } from "react-icons/ri";
import { AiFillAppstore, AiFillMessage } from "react-icons/ai";
import { FaBell, FaUser, FaRegFlag, FaFlag } from "react-icons/fa";
import { MdOutlineGroups } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md";
import { IoHome } from "react-icons/io5";
import { IoAppsSharp } from "react-icons/io5";
import { FaFacebookMessenger } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { Badge } from 'antd';

export const navItems = [
  { key: 'home', icon: <GoHomeFill   />, selectedIcon: <GoHomeFill   style={{ fontSize: '30px', color: '#1877f2' }} />, tooltip: 'Home', path: '/' },
  { key: 'friends', icon: <FaUserGroup   />, selectedIcon: <FaUserGroup   style={{ fontSize: '32px', color: '#1877f2' }} />, tooltip: 'Friend', path: '/friends' },
  { key: 'groups', icon: <MdGroups  style={{fontSize: '30px'}} />,selectedIcon: <MdGroups  style={{ fontSize: '36px', color: '#1877f2' }} />, tooltip: 'Group', path: '/groups' }
];

export const iconData = [
  { name: 'appStore', icon: <IoAppsSharp  style={{ fontSize: '24px' }} />, tooltip: 'Menu' },
  { name: 'messages', icon: <FaFacebookMessenger style={{ fontSize: '20px' }} />, tooltip: 'Messages' },
  { name: 'notifications', icon: <Badge count={1} size="small"><FaBell style={{ fontSize: '25px' }} /></Badge>, tooltip: 'Notifications' }
];
