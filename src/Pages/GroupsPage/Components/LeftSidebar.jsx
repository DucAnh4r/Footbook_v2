import React, { useState } from 'react';
import styles from './LeftSidebar.module.scss';
import FeedImg from '../../../assets/image/Homepage/LeftSidebar/feed.png';
import ExploreImg from '../../../assets/image/Homepage/LeftSidebar/explore.png';
import GroupsImg from '../../../assets/image/Homepage/LeftSidebar/groups.png';
import CreateGroupModal from '../../../Modal/CreateGroupModal'; // Import modal

const LeftSidebar = ({ setActivePage }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Hàm mở modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Hàm xử lý khi tạo nhóm mới
  const handleCreateGroup = (groupName, groupDescription) => {
    console.log('Tạo nhóm mới:', groupName, groupDescription);
    // Bạn có thể xử lý việc tạo nhóm tại đây (ví dụ: gửi yêu cầu API để tạo nhóm)
  };

  // Danh sách nhóm người dùng đã tham gia
  const groups = [
    { name: 'Hội Ricon Việt Nam', lastActive: '5 giờ trước', pinned: true },
    { name: '66IT4 HUCE', lastActive: '1 năm trước', pinned: true },
    { name: 'GIAO THÔNG ĐƯỜNG BỘ 24h', lastActive: '2 tuần trước', pinned: true },
    { name: 'Sinh Viên Đại học Xây Dựng Hà Nội (HUCE)', lastActive: 'khoảng 1 tuần trước', pinned: false },
    { name: 'Brawlhalla Việt Nam 2024', lastActive: '2 giờ trước', pinned: false },

  ];

  return (
    <div className={styles['container']}>
      {/* Phần tiêu đề */}
      <div className={styles['header']}>
        <h1 style={{ marginLeft: '20px', marginBottom: '20px', fontSize: '24px' }}>Nhóm</h1>
      </div>

      {/* Danh sách mục điều hướng */}
      <ul className={styles['list-container']}>
        <li
          className={styles['list-item']}
          onClick={() => setActivePage('page1')} // Điều hướng đến trang feed
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={FeedImg} alt="" />
            </div>
            <span className={styles['text']}>Bảng feed của bạn</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => setActivePage('page2')} // Điều hướng đến trang khám phá
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img className={styles['icon']} src={ExploreImg} alt="" />
            </div>
            <span className={styles['text']}>Khám phá</span>
          </div>
        </li>
        <li
          className={styles['list-item']}
          onClick={() => setActivePage('page3')} // Điều hướng đến danh sách nhóm
        >
          <div className={styles['element-container']}>
            <div className={styles['image-container']}>
              <img
                className={styles['icon']}
                style={{ width: '30px', height: '30px', marginLeft: '3px' }}
                src={GroupsImg}
                alt=""
              />
            </div>
            <span className={styles['text']}>Nhóm của bạn</span>
          </div>
        </li>
      </ul>

      {/* Nút tạo nhóm mới, khi nhấn sẽ mở modal */}
      <button className={styles.editHighlightButton} onClick={showModal}>+ Tạo nhóm mới</button>
      <div><hr className={styles['divider']} /></div>

      {/* Danh sách nhóm đã tham gia */}
      <div >
        <div className={styles['group-name']}>
          <h2>Nhóm bạn đã tham gia</h2>
          <button className={styles['view-all-button']}>Xem tất cả</button>
        </div>

        <ul className={styles['group-list']}>
          {groups.map((group, index) => (
            <li key={index} className={styles['group-item']}>
              <div className={styles['group-element-container']}>
                <div className={styles['group-image-container']}>
                  {/* Placeholder cho hình ảnh nhóm */}
                  <div className={styles['group-icon-placeholder']}></div>
                </div>
                <div className={styles['group-info-container']}>
                  <span className={styles['group-name']}>{group.name}</span>
                  <span className={styles['last-active']}>Lần hoạt động gần nhất: {group.lastActive}</span>
                </div>
                {group.pinned && <div className={styles['pinned']}>📌</div>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal tạo nhóm mới */}
      <CreateGroupModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onCreateGroup={handleCreateGroup} // Gửi hàm xử lý việc tạo nhóm
      />
    </div>
  );
};

export default LeftSidebar;
