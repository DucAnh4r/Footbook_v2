import React, { useState } from "react";
import { Modal, Avatar, Input, Checkbox, Button } from "antd";
import styles from "./SendToModal.module.scss";

const SendToModal = ({ isModalOpen, onCancel }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchText, setSearchText] = useState("");

    const users = [
        { id: 1, name: "Trí Dũng", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
        { id: 2, name: "1111111111111111111111111111111", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 3, name: "Ninh bình", avatar: "https://randomuser.me/api/portraits/men/3.jpg" },
        { id: 4, name: "Fordeer Life Style", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
        { id: 5, name: "IT4", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        { id: 6, name: "dm", avatar: "https://randomuser.me/api/portraits/women/6.jpg" },
        { id: 7, name: "Đỗ Hùng Minh", avatar: "https://randomuser.me/api/portraits/men/7.jpg" },
        { id: 8, name: "Quan trọng nó là...?", avatar: "https://randomuser.me/api/portraits/women/8.jpg" },
        { id: 9, name: "hội khó đi chơi vl", avatar: "https://randomuser.me/api/portraits/men/9.jpg" },
    ];

    const handleCheckboxChange = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
        );
    };

    const handleSend = () => {
        console.log("Selected users:", selectedUsers);
        onCancel(); // Đóng modal sau khi gửi
    };

    return (
        <Modal
            open={isModalOpen}
            onCancel={onCancel}
            footer={null}
            width="500px"
            title="Gửi tới"
            className={styles.sendToModal}
        >
            <div className={styles.container}>
                <Input
                    placeholder="Tìm kiếm người và nhóm"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className={styles.searchInput}
                />
                <div className={styles.userList}>
                    {users
                        .filter((user) => user.name.toLowerCase().includes(searchText.toLowerCase()))
                        .map((user) => (
                            <div key={user.id} className={styles.userItem}>
                                <Avatar src={user.avatar} />
                                <span >{user.name}</span>
                                <Checkbox
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleCheckboxChange(user.id)}
                                />
                            </div>
                        ))}
                </div>
                <Input.TextArea
                    placeholder="Thêm tin nhắn tại đây (không bắt buộc)"
                    className={styles.messageInput}
                />
                <Button
                    type="primary"
                    block
                    onClick={handleSend}
                    disabled={selectedUsers.length === 0}
                >
                    Gửi
                </Button>
            </div>
        </Modal>
    );
};

export default SendToModal;
