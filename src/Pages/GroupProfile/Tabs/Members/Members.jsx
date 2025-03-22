import React from "react";
import styles from "./Members.module.scss";
import { Col, Input, Row } from "antd";
import { GoSearch } from "react-icons/go";

const Members = () => {
  return (
    <div className={styles.membersContainer}>
      <div className={styles.header}>
        <h1>Thành viên · 1.814.272</h1>
        <p>
          Người và Trang mới tham gia nhóm này sẽ hiển thị tại đây.{" "}
          <a href="/">Tìm hiểu thêm</a>
        </p>
        <Input
          type="text"
          placeholder="Tìm thành viên"
          prefix={<GoSearch style={{ fontSize: "20px" }} />}
          className={styles.searchBox}
        />
      </div>
      <div className={styles.memberList}>
        <div className={styles.member}>
          <img
            src="https://via.placeholder.com/50"
            alt="Minh Hoàng"
            className={styles.avatar}
          />
          <div>
            <h3>Minh Hoàng</h3>
            <p>THPT Trần Nhân Tông - Hà Nội</p>
          </div>
        </div>
        <h2>Quản trị viên & người kiểm duyệt · 18</h2>
        <div className={styles.adminList}>
          <div className={styles.admin}>
            <img
              src="https://via.placeholder.com/50"
              alt="Đào Mèo"
              className={styles.avatar}
            />
            <div>
              <h3>
                Đào Mèo <span className={styles.role}>Quản trị viên</span>
              </h3>
              <p>Người đóng góp nhiều nhất</p>
            </div>
          </div>
          <div className={styles.admin}>
            <img
              src="https://via.placeholder.com/50"
              alt="Đào Chó"
              className={styles.avatar}
            />
            <div>
              <h3>
                Đào Chó <span className={styles.role}>Quản trị viên</span>
              </h3>
              <p>Người đóng góp nổi bật</p>
            </div>
          </div>
          <div className={styles.admin}>
            <img
              src="https://via.placeholder.com/50"
              alt="Toàn Dương"
              className={styles.avatar}
            />
            <div>
              <h3>
                Toàn Dương <span className={styles.role}>Quản trị viên</span>
              </h3>
              <p>Admin tại Đào Mèo</p>
            </div>
            <button className={styles.addFriendButton}>Thêm bạn bè</button>
          </div>
        </div>
        <button className={styles.viewAllButton}>Xem tất cả</button>
      </div>
    </div>
  );
};

export default Members;
