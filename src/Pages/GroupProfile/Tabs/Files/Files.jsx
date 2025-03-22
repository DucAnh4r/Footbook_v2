import React from "react";
import styles from "./Files.module.scss";
import { Input } from "antd";
import { GoSearch } from "react-icons/go";

const Files = () => {
    return (
        <div className={styles.filesContainer}>
            <div className={styles.header}>
                <h2>File</h2>
                <div className={styles.searchUpload}>
                    <Input
                        type="text"
                        placeholder="Tìm kiếm file"
                        prefix={<GoSearch style={{ fontSize: "20px" }} />}
                        className={styles.searchInput}
                    />
                    <button className={styles.uploadButton}>Tải file lên</button>
                </div>
            </div>
            <div><hr className={styles['divider']} /></div>
            <div className={styles.fileTable}>
                <div className={styles.tableHeader}>
                    <button className={styles.columnButton}>Tên file</button>
                    <button className={styles.columnButton}>Loại</button>
                    <button className={styles.columnButton}>
                        Lần sửa đổi gần nhất <span>▼</span>
                    </button>
                </div>
                {/* Thêm nội dung file tại đây */}
            </div>
        </div>
    );
};

export default Files;
