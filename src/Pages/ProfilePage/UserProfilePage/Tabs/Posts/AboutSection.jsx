import React, { useState } from 'react';
import styles from './AboutSection.module.scss';
import { IoSchool, IoHome, IoEarth } from 'react-icons/io5';
import { FaBirthdayCake } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import EditFeaturedModal from '../../../../../Modal/EditFeaturedModal';
import { getUserIdFromLocalStorage } from '../../../../../utils/authUtils';

const AboutSection = ({ userInfo }) => {
  // Mảng chứa các đối tượng với URL hình ảnh và tên bộ sưu tập
  const galleryImages = [
    // {
    //   url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXRsEwpFFX0OKKI2dQwdnS3hsLq_2Bogf2g&s",
    //   label: "Bộ sưu tập 1"
    // },
    // {
    //   url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXRsEwpFFX0OKKI2dQwdnS3hsLq_2Bogf2g&s",
    //   label: "Bộ sưu tập 2"
    // },
    // {
    //   url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXRsEwpFFX0OKKI2dQwdnS3hsLq_2Bogf2g&s",
    //   label: "Bộ sưu tập 3"
    // },
    // {
    //   url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwXRsEwpFFX0OKKI2dQwdnS3hsLq_2Bogf2g&s",
    //   label: "Bộ sưu tập 4"
    // }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const userId = getUserIdFromLocalStorage();

  // Hiển thị 3 hình ảnh mỗi lần
  const visibleImages = galleryImages.slice(startIndex, startIndex + 3);

  const handleNext = () => {
    if (startIndex + 3 < galleryImages.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <span>Giới thiệu</span>
      </div>
      <div className={styles.infoList}>
        <button className={styles.editQuoteButton}>Thêm tiểu sử</button>
        <div className={styles.infoItem}>
          <FaBirthdayCake size={20} className={styles.icon} />
          <span>Sinh năm <strong>{userInfo.birth_year}</strong></span>
        </div>
        <div className={styles.infoItem}>
          <MdWork size={20} className={styles.icon} />
          <span><strong>{userInfo.profession}</strong></span>
        </div>
        <div className={styles.infoItem}>
          <IoHome size={20} className={styles.icon} />
          <span>Sống tại <strong>{userInfo.address}</strong></span>
        </div>
      </div>
      <button className={styles.editDetailButton}>Chỉnh sửa chi tiết</button>
      <div className={styles.gallery}>
        {startIndex > 0 && (
          <button onClick={handlePrev} className={styles.arrowButton}>{"<"}</button>
        )}
        {visibleImages.map((item, index) => (
          <>
            <div key={index} className={styles.galleryItem}>
              <img src={item.url} alt={`Gallery item ${index + startIndex + 1}`} />
              <span>{item.label}</span>
            </div>
            <button className={styles.editHighlightButton}>Chỉnh sửa phần Đáng chú ý</button>
          </>
        ))}
        {startIndex + 3 < galleryImages.length && (
          <button onClick={handleNext} className={styles.arrowButton}>{">"}</button>
        )}
      </div>
      <button className={styles.editHighlightButton} onClick={handleOpenModal}>Thêm phần Đáng chú ý</button>
      <EditFeaturedModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        userId={userId}
      />
    </div>
  );
};

export default AboutSection;
