/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Input, Tabs, Card, Row, Col, Button, Dropdown, Menu } from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { getUserIdFromLocalStorage } from "../../../../../utils/authUtils";
import { useNavigate } from "react-router-dom";
import { userListFriendService } from "../../../../../services/userService";

const { TabPane } = Tabs;

const Friends = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [friends, setFriends] = useState([]); // State lưu danh sách bạn bè
  const [loading, setLoading] = useState(true); // State loading
  const user_id = getUserIdFromLocalStorage(); // Lấy userId từ localStorage
  const navigate = useNavigate(); // Dùng để điều hướng

  // Hàm fetch bạn bè
  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await userListFriendService(user_id);
      setFriends(response?.data?.friends || []); // Lưu danh sách bạn bè
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý điều hướng tới trang cá nhân của bạn bè
  const handleImageClick = (id) => {
    navigate(`/friendprofile/${id}`);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const renderFriendCard = (friend) => (
    <Card style={{ width: "100%", marginBottom: "16px" }} key={friend.id}>
      <Row align="middle">
        <Col span={4}>
          {friend.avatar_url ? (
            <img
              src={friend.avatar_url}
              alt={friend.name}
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "8px",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "24px", color: "#fff" }}>
                {friend.name.charAt(0)}
              </span>
            </div>
          )}
        </Col>
        <Col span={16} style={{ paddingLeft: "16px" }}>
          <div style={{ fontWeight: "bold" }}>{friend.name}</div>
          <div style={{ color: "#888" }}>{friend.mutualFriends} bạn chung</div>
        </Col>
        <Col span={4} style={{ textAlign: "right" }}>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => handleImageClick(friend.id)}>
                  Xem hồ sơ
                </Menu.Item>
                <Menu.Item key="2">Hủy kết bạn</Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button icon={<EllipsisOutlined />} shape="circle" />
          </Dropdown>
        </Col>
      </Row>
    </Card>
  );

  return (
    <div style={{ padding: "20px", width: "100%", margin: "auto" }}>
      <h2>Bạn bè</h2>
      <Input
        placeholder="Tìm kiếm"
        prefix={<SearchOutlined />}
        style={{ marginBottom: "16px" }}
      />
      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả bạn bè" key="all">
          <Row gutter={16}>
            {friends.map((friend) => (
              <Col span={12} key={friend.id}>
                {renderFriendCard(friend)}
              </Col>
            ))}
          </Row>
        </TabPane>
        <TabPane tab="Đã thêm gần đây" key="recent">
          {/* Data for "Đã thêm gần đây" */}
        </TabPane>
        <TabPane tab="Sinh nhật" key="birthday">
          {/* Data for "Sinh nhật" */}
        </TabPane>
        <TabPane tab="Đại học" key="university">
          {/* Data for "Đại học" */}
        </TabPane>
        <TabPane tab="Trường trung học" key="highschool">
          {/* Data for "Trường trung học" */}
        </TabPane>
        <TabPane tab="Tỉnh/Thành phố hiện tại" key="currentCity">
          {/* Data for "Tỉnh/Thành phố hiện tại" */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Friends;
