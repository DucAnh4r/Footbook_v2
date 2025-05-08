import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Tabs, Dropdown, Menu } from 'antd';
import styles from './GroupProfile.module.scss';
import { IoIosCamera, IoIosArrowDown, IoMdAdd } from 'react-icons/io';
import { TiArrowSortedDown } from 'react-icons/ti';
import { MdGroups } from 'react-icons/md';
import { FaPen, FaLock, FaShare } from 'react-icons/fa6';
import { EllipsisOutlined } from '@ant-design/icons';
import AboutTab from './Tabs/About/AboutTab.jsx';
import Members from './Tabs/Members/Members.jsx';
import Events from './Tabs/Events/Events.jsx';
import FriendSuggestion from '../../Components/SuggestedFriends.jsx';
import Discussion from './Tabs/Discussion/Discussion.jsx';
import Noticeable from './Tabs/Noticeable/Noticeable.jsx';
import Photos from './Tabs/Photos/Photos.jsx';
import Files from './Tabs/Files/Files.jsx';

const GroupProfile = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [isFriendSuggestionVisible, setFriendSuggestionVisible] = useState(false);
  const [headerWidth, setHeaderWidth] = useState('70%');
  const containerRef = useRef(null);

  const handleTabChange = key => {
    setActiveTab(key);
  };

  const toggleFriendSuggestion = () => {
    setFriendSuggestionVisible(!isFriendSuggestionVisible);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case '1':
        return <AboutTab />;
      case '2':
        return <Discussion />;
      case '3':
        return <Noticeable />;
      case '4':
        return <Members />;
      case '5':
        return <Events />;
      case '6':
        return <Photos />;
      case '7':
        return <Files />;
      default:
        return null;
    }
  };

  const menu1 = (
    <Menu className={styles['custom-menu']}>
      <Menu.Item key="1" className={styles['menu-item']}>
        Quản lý thông báo
      </Menu.Item>
      <Menu.Item key="2" className={styles['menu-item']}>
        Bỏ theo dõi nhóm
      </Menu.Item>
      <Menu.Item key="3" className={styles['menu-item']}>
        Rời nhóm
      </Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu className={styles['custom-menu']}>
      <Menu.Item key="1" className={styles['menu-item']}>
        Chế độ xem
      </Menu.Item>
      <Menu.Item key="2" className={styles['menu-item']}>
        Tìm kiếm
      </Menu.Item>
      <Menu.Item key="3" className={styles['menu-item']}>
        Trạng thái trang cá nhân
      </Menu.Item>
      <Menu.Item key="4" className={styles['menu-item']}>
        Kho lưu trữ
      </Menu.Item>
      <Menu.Item key="5" className={styles['menu-item']}>
        Kho lưu trữ tin
      </Menu.Item>
      <Menu.Item key="6" className={styles['menu-item']}>
        Nhật ký hoạt động
      </Menu.Item>
      <Menu.Item key="7" className={styles['menu-item']}>
        Cài đặt trang cá nhân và gần thể
      </Menu.Item>
      <Menu.Item key="8" className={styles['menu-item']}>
        Khóa bảo vệ trang cá nhân
      </Menu.Item>
      <Menu.Item key="9" className={styles['menu-item']}>
        Bật chế độ chuyên nghiệp
      </Menu.Item>
      <Menu.Item key="10" className={styles['menu-item']}>
        Tạo trang cá nhân khác
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    // Hàm kiểm tra chiều rộng của container
    const checkContainerWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Kiểm tra nếu chiều rộng container < 1000px thì set width của header khác
        setHeaderWidth(containerWidth < 1300 ? '94%' : '70%');
      }
    };

    // Lắng nghe sự thay đổi kích thước của container
    const resizeObserver = new ResizeObserver(() => checkContainerWidth());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Dọn dẹp ResizeObserver khi component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Chạy 1 lần khi component mount

  return (
    <>
      <div className={styles['container']} ref={containerRef}>
        <div className={styles['header']} style={{ width: headerWidth }}>
          <div className={styles['wallpaper']}>
            <img className={styles['wallpaper-img']} src="https://imagev3.vietnamplus.vn/1200x630/Uploaded/2024/mzdic/2024_06_23/ronaldo-2306-8285.jpg.webp" alt="" />
          </div>
          <Row className={styles['info']} gutter={16}>
            <Col span={9} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '30px', fontWeight: 700, marginTop: '24px' }}>Hội Ricon Việt Nam</span>
              <div>
                <FaLock style={{ color: '#65686c' }} />
                <span style={{ color: '#65686c' }}> Nhóm riêng tư · </span>
                <a
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#65686c',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={e => (e.target.style.textDecoration = 'underline')}
                  onMouseLeave={e => (e.target.style.textDecoration = 'none')}
                >
                  392K thành viên
                </a>
              </div>
            </Col>
          </Row>
          <Row className={styles['info']} gutter={16}>
            <Col style={{ paddingRight: '0px' }} span={9}>
              <div className={styles['info-btn-container']} style={{ marginTop: '40px', textAlign: 'right' }}>
                <button className={styles['blue-button']}>
                  <IoMdAdd />
                  Mời
                </button>
                <button className={styles['white-button']}>
                  <FaShare />
                  Chia sẻ
                </button>
                <Dropdown overlay={menu1} trigger={['click']}>
                  <button style={{ alignItems: 'center', padding: '0 16px' }} className={styles['white-button']}>
                    <MdGroups />
                    Đã tham gia
                    <TiArrowSortedDown />
                  </button>
                </Dropdown>
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }} className={styles['small-button']} onClick={toggleFriendSuggestion}>
                  <IoIosArrowDown
                    className={`${styles.arrowIcon} ${isFriendSuggestionVisible ? styles.arrowIconRotated : ''}`} // Thêm lớp xoay mũi tên
                  />
                </button>
              </div>
            </Col>
          </Row>

          {isFriendSuggestionVisible && (
            <Row style={{ width: '100%' }}>
              <FriendSuggestion />
            </Row>
          )}

          <Row className={styles['tabs-select']} style={{ height: '49px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
              <Tabs.TabPane tab={<span className={styles.tab}>Giới thiệu</span>} key="1" />
              <Tabs.TabPane tab={<span className={styles.tab}>Thảo luận</span>} key="2" />
              <Tabs.TabPane tab={<span className={styles.tab}>Đáng chú ý</span>} key="3" />
              <Tabs.TabPane tab={<span className={styles.tab}>Thành viên</span>} key="4" />
              <Tabs.TabPane tab={<span className={styles.tab}>Sự kiện</span>} key="5" />
              <Tabs.TabPane tab={<span className={styles.tab}>File phương tiện</span>} key="6" />
              <Tabs.TabPane tab={<span className={styles.tab}>File</span>} key="7" />
            </Tabs>
            <Dropdown overlay={menu2} trigger={['click']}>
              <button style={{ alignItems: 'center', padding: '0 16px' }} className={styles['small-button']}>
                <EllipsisOutlined />
              </button>
            </Dropdown>
          </Row>
        </div>
      </div>

      <div className={styles['container-2']}>
        <div className={styles['content']} style={{ width: headerWidth }}>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default GroupProfile;
