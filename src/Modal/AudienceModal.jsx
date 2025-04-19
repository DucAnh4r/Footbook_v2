import React, { useState } from "react";
import { Modal, Button, Radio, Space, Checkbox, Input } from "antd";
import "./AudienceModal.scss";

const audienceOptions = [
    { id: 1, value: "public", description: "Anyone on or off Facebook" },
    { id: 2, value: "friends", description: "Your friends on Facebook" },
    { id: 3, value: "Friends except...", description: "Don't show to some friends" },
    { id: 4, value: "Specific friends", description: "Only show to some friends" },
    { id: 5, value: "secret", description: "Only you can see your post" },
];

const friendsList = [
    { id: 1, name: "Bùi Tuấn Kiệt", location: "Hanoi, Vietnam" },
    { id: 2, name: "Đặng Việt Khôi Nguyên", location: "Hanoi, Vietnam" },
    { id: 3, name: "Đỗ Hùng Minh", location: "Hanoi, Vietnam" },
    { id: 4, name: "Đỗ Minh", location: "Ha Long" },
    { id: 5, name: "Do Nguyen", location: "Hanoi, Vietnam" },
];

const AudienceModal = ({ isModalOpen, onClose, onSelect, defaultAudience }) => {
    const [selectedAudience, setSelectedAudience] = useState(defaultAudience);
    const [view, setView] = useState("main"); // "main" hoặc "friends"
    const [friendsExcept, setFriendsExcept] = useState([]);
    const [specificFriends, setSpecificFriends] = useState([]);
    const [temporaryFriends, setTemporaryFriends] = useState([]);

    const handleSaveFriends = () => {
        if (selectedAudience === "Friends except...") {
            setFriendsExcept(temporaryFriends);
        } else if (selectedAudience === "Specific friends") {
            setSpecificFriends(temporaryFriends);
        }
        setView("main");
    };

    const renderHelpText = (option) => {
        if (option.value === "Friends except...") {
            return friendsExcept.length > 0
                ? `Don't show to: ${friendsExcept.map((id) => friendsList.find((f) => f.id === id).name).join(", ")}`
                : "Don't show to some friends";
        }
        if (option.value === "Specific friends") {
            return specificFriends.length > 0
                ? `${specificFriends.map((id) => friendsList.find((f) => f.id === id).name).join(", ")}`
                : "Only show to some friends";
        }
        return option.description || "";
    };

    return (
        <Modal
            title={
                <div className="modal-title">
                    {view === "main" ? "Post audience" : "Select Friends"}
                </div>
            }
            open={isModalOpen}
            onCancel={onClose}
            footer={
                view === "main"
                    ? [
                          <Button key="cancel" onClick={onClose}>
                              Cancel
                          </Button>,
                          <Button key="done" type="primary" onClick={() => {
                                onSelect(selectedAudience); // Thực hiện chọn lựa
                                onClose(); // Đóng modal
                            }}>
                              Done
                          </Button>,
                      ]
                    : [
                          <Button key="back" onClick={() => setView("main")}>
                              Back
                          </Button>,
                          <Button key="save" type="primary" onClick={handleSaveFriends}>
                              Save changes
                          </Button>,
                      ]
            }
        >
            <div className="view-container">
                <div
                    className={`view-main ${view === "main" ? "active" : "hidden"}`}
                >
                    <p>Who can see your post?</p>
                    <p>Your post will appear in Feed, on your profile, and in search results.</p>
                    <br />
                    <Radio.Group
                        onChange={(e) => {
                            const value = e.target.value;
                            setSelectedAudience(value);
                            if (["Friends except...", "Specific friends"].includes(value)) {
                                setTemporaryFriends(
                                    value === "Friends except..." ? friendsExcept : specificFriends
                                );
                                setView("friends");
                            }
                        }}
                        value={selectedAudience}
                        style={{ width: "100%" }}
                    >
                        <Space direction="vertical" style={{ width: "100%" }}>
                            {audienceOptions.map((option) => (
                                <Radio key={option.id} value={option.value} style={{ width: "100%" }}>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <span style={{ fontWeight: "bold" }}>{option.value}</span>
                                        <span style={{ fontSize: "12px", color: "#888" }}>
                                            {renderHelpText(option)}
                                        </span>
                                    </div>
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                </div>
                <div
                    className={`view-friends ${view === "friends" ? "active" : "hidden"}`}
                >
                    <Input.Search placeholder="Search for a friend or list..." style={{ marginBottom: "16px" }} />
                    <div style={{ maxHeight: "405px", overflowY: "auto" }}>
                        {friendsList.map((friend) => (
                            <div
                                key={friend.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px 0",
                                }}
                            >
                                <div>
                                    <span style={{ fontWeight: "bold" }}>{friend.name}</span>
                                    <br />
                                    <span style={{ fontSize: "12px", color: "#888" }}>{friend.location}</span>
                                </div>
                                <Checkbox
                                    checked={temporaryFriends.includes(friend.id)}
                                    onChange={() => {
                                        setTemporaryFriends((prev) =>
                                            prev.includes(friend.id)
                                                ? prev.filter((id) => id !== friend.id)
                                                : [...prev, friend.id]
                                        );
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default AudienceModal;
