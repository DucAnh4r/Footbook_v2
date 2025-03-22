import React from 'react';
import styles from './AboutCard.module.scss';
import { FaGlobe, FaEye, FaClock } from "react-icons/fa"; // Thêm icon phù hợp
import { Row, Col } from 'antd';

const AboutCard = () => {
    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <span>Giới thiệu về nhóm này</span>
            </div>
            <div className={styles.infoList}>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FaGlobe />
                    </Col>
                    <Col style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Công khai</span>
                        <span>Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng.</span>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FaEye />
                    </Col>
                    <Col style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Hiển thị</span>
                        <span>Ai cũng có thể tìm thấy nhóm này.</span>
                    </Col>
                </Row>
                <Row style={{ marginBottom: '10px' }}>
                    <Col span={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FaClock />
                    </Col>
                    <Col style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold' }}>Lịch sử</span>
                        <span>Đã tạo nhóm vào 7 tháng 4, 2021. Lần gần nhất đổi tên là vào 19 tháng 8, 2022.</span>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default AboutCard;
