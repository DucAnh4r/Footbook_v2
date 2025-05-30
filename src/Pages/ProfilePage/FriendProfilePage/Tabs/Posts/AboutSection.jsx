import React, { useState } from 'react';
import styles from './AboutSection.module.scss';
import { IoSchool, IoHome, IoEarth } from 'react-icons/io5';

const AboutSection = () => {
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
        <div className={styles.infoItem}>
          <IoSchool size={20} className={styles.icon} />
          <span>
            Học Công Nghệ Thông Tin tại <strong>Trường Đại học Xây dựng Hà Nội</strong> - Hanoi University of Civil Engineering
          </span>
        </div>
        <div className={styles.infoItem}>
          <IoSchool size={20} className={styles.icon} />
          <span>
            Đã học tại <strong>THPT Lý Thường Kiệt</strong>
          </span>
        </div>
        <div className={styles.infoItem}>
          <IoHome size={20} className={styles.icon} />
          <span>
            Sống tại <strong>Hà Nội</strong>
          </span>
        </div>
        {/* <div className={styles.infoItem}>
          <IoEarth size={20} className={styles.icon} />
          <span>
            Có <strong>171 người</strong> theo dõi
          </span>
        </div> */}
      </div>
      <div className={styles.gallery}>
        {startIndex > 0 && (
          <button onClick={handlePrev} className={styles.arrowButton}>
            {'<'}
          </button>
        )}
        {visibleImages.map((item, index) => (
          <div key={index} className={styles.galleryItem}>
            <img src={item.url} alt={`Gallery item ${index + startIndex + 1}`} />
            <span>{item.label}</span>
          </div>
        ))}
        {startIndex + 3 < galleryImages.length && (
          <button onClick={handleNext} className={styles.arrowButton}>
            {'>'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutSection;
