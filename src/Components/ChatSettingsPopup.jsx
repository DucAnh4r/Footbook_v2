import React from 'react';
import { Popover, Menu } from 'antd';

const ChatSettingsPopup = ({ children }) => {
  const menuItems = [
    { key: '1', label: 'Open in Messenger', icon: '📨' },
    { key: '2', label: 'View profile', icon: '👤' },
    { key: '3', label: 'Change theme', icon: '🎨' },
    { key: '4', label: 'Emoji', icon: '👍' },
    { key: '5', label: 'Nicknames', icon: '✏️' },
    { key: '6', label: 'View pinned messages', icon: '📌' },
    { key: '7', label: 'Create group', icon: '👥' },
    { key: '8', label: 'Mute notifications', icon: '🔕' },
    { key: '9', label: 'Block', icon: '🔕' },
    { key: '10', label: 'Restrict', icon: '🔕' },
    { key: '11', label: 'Archive chat', icon: '🔕' },
    { key: '12', label: 'Delete chat', icon: '🔕' },
    { key: '13', label: 'Report', icon: '🔕' },

  ];

  const renderMenu = (
    <Menu style={{ maxHeight: '385px', maxWidth: '344px', width: '344px', overflow: 'auto' }}>
      {menuItems.map((item, index) => (
        <React.Fragment key={item.key}>
          <Menu.Item icon={<span style={{ marginRight: '10px' }}>{item.icon}</span>}>
            {item.label}
          </Menu.Item>
          {/* Thêm kẻ ngang sau các mục mong muốn */}
          {(item.key === '2' || item.key === '6' || item.key === '7' || item.key === '10') && <Menu.Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );

  return (
    <Popover
      content={renderMenu} // Nội dung popup
      trigger="click"
      placement="leftTop"
    >
      {children} {/* Hiển thị phần tử truyền từ file cha */}
    </Popover>
  );
};

export default ChatSettingsPopup;
