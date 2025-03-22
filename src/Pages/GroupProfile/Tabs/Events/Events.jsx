import React from "react";
import styles from "./Events.module.scss";

const Events = () => {
  return (
    <div className={styles.eventsContainer}>
      <div className={styles.header}>
        <h2>Sự kiện sắp tới</h2>
        <div className={styles.buttons}>
          <button className={styles.searchEvent}>Tìm sự kiện</button>
          <button className={styles.createEvent}>Tạo sự kiện</button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.icon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 6v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6H1z" />
          </svg>
        </div>
        <p>Không có sự kiện nào sắp diễn ra.</p>
      </div>
    </div>
  );
};

export default Events;
