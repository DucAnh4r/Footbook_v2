// /src/components/NavItem.jsx
import React from 'react';
import { Tooltip } from 'antd';

const NavItem = ({ item, selected, handleSelect }) => (
  <Tooltip title={item.tooltip}>
    <div
      onClick={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderRadius = '0px';
        handleSelect(item.key);
      }}
      style={{
        cursor: 'pointer',
        borderBottom: selected === item.key ? '2px solid #1877f2' : 'none',
        width: '129.59px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        transition: 'background-color 0.3s, transform 0.3s, border-radius 0.3s',
        fontSize: '25px',
      }}
      onMouseEnter={(e) => {
        if (selected !== item.key) {
          e.currentTarget.style.backgroundColor = '#f0f2f5';
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.borderRadius = '8px';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderRadius = '0px';
      }}
    >
      {selected === item.key ? item.selectedIcon : item.icon}
    </div>
  </Tooltip>
);

export default NavItem;
