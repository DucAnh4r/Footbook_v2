import React from 'react';
import styles from "./HighLightStoryViewer.module.scss";
import CancelIcon from "../assets/image/PhotoPage/CancelButton.png";
import { FaAngleLeft, FaAngleRight, FaEarthAmericas } from 'react-icons/fa6';
import { Avatar } from 'antd';



const HighLightStoryViewer = () => {
  return (
    <div className={styles.container}>
        <div
            className={`${styles['round-button-container']} ${styles['cancel-button-container']}`}
            onClick={() => {
            if (window.history.length > 2) {
                navigate(-1); // Navigate to previous page if available
            } else {
                navigate("/"); // Navigate to homepage if no previous page
            }
            }}
        >
            <img style={{ width: '80%', height: '80%' }} src={CancelIcon} alt="" />
        </div>

        <div className={styles['image-container']}>
            <img className={styles['image']} src="https://cdn.pixabay.com/photo/2017/12/22/14/42/girl-3033718_640.jpg" alt="" />
        </div>

        <div className={styles.header}>
          <Avatar src="https://cdn.pixabay.com/photo/2017/12/22/14/42/girl-3033718_640.jpg" className={styles.avatar} />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Anh Đức Nguyễn</span>
            <span className={styles.time}>
              4h
              <FaEarthAmericas style={{ marginLeft: "4px" }} />
            </span>
          </div>
        </div>

        <div className={styles.numberCount}>
            1/3
        </div>
        <div className={`${styles['round-button-container']} ${styles['left-button-container']}`}>
            <FaAngleLeft 
            div/>
        </div>
        <div className={`${styles['round-button-container']} ${styles['right-button-container']}`}>
            <FaAngleRight />
        </div>
    </div>
  );
};

export default HighLightStoryViewer;
