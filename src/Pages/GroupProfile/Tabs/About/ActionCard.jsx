import React from 'react';
import styles from './ActionCard.module.scss';
import { Row, Col } from 'antd';
import { IoTimeOutline } from 'react-icons/io5';

const ActionCard = () => {
    const actions = [
        { id: 1, title: 'Hôm nay có 763 bài viết mới', description: '10,000 trong tháng trước' },
        { id: 2, title: 'Tổng cộng 420,077 thành viên', description: '2,604 trong tuần qua' },
        { id: 3, title: 'Ngày tạo: 3 năm trước', description: '' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.sectionHeader}>
                <span>Hoạt động</span>
            </div>
            <div className={styles.infoList}>
                {actions.map((action) => (
                    <Row key={action.id} className={styles.infoItem}>
                        <Col span={2} className={styles.iconWrapper}>
                            <IoTimeOutline />
                        </Col>
                        <Col span={22} className={styles.infoText}>
                            <span className={styles.title}>{action.title}</span>
                            {action.description && <span className={styles.description}>{action.description}</span>}
                        </Col>
                    </Row>
                ))}
            </div>
        </div>
    );
};

export default ActionCard;
