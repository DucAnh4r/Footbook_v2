/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Tabs, Dropdown, Menu } from "antd";
import styles from "./ProfilePage.module.scss";
import { IoIosCamera, IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { FaPen } from "react-icons/fa6";
import { EllipsisOutlined } from "@ant-design/icons";
import Posts from "./Tabs/Posts/Posts.jsx";
import Introduction from "./Tabs/Introduction/Introduction.jsx";
import Friends from "./Tabs/Friends/Friends.jsx";
import Photos from "./Tabs/Photos/Photos.jsx";
import Videos from "./Tabs/Videos/Videos.jsx";
import FriendSuggestion from "./SuggestedFriends.jsx";
import { useAuthCheck } from "../../../utils/checkAuth.jsx";
import { getUserIdFromLocalStorage } from "../../../utils/authUtils.jsx";
import { countFriendService } from "../../../services/friendService.jsx";
import {
  updateCoverService,
  updateProfileService,
  userFindByIdService,
} from "../../../services/userService.jsx";
import { toast } from "react-toastify";

const ProfilePage = () => {
  useAuthCheck();
  const [activeTab, setActiveTab] = useState("1");
  const [isFriendSuggestionVisible, setFriendSuggestionVisible] =
    useState(false);
  const [headerWidth, setHeaderWidth] = useState("70%");
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const [userInfo, setUserInfo] = useState([]);
  const [friendCount, setFriendCount] = useState([]);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const userId = getUserIdFromLocalStorage();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await userFindByIdService(userId);
      setUserInfo(response?.data?.user || []);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const countFriend = async () => {
    try {
      setIsLoading(true);
      const response = await countFriendService(userId);
      setFriendCount(response?.data?.friends_count || 0);
    } catch (error) {
      console.error("Error count friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (type) => {
    if (type === "avatar") {
      avatarInputRef.current.click();
    } else {
      coverInputRef.current.click();
    }
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);

    try {
      if (type === "avatar") {
        const formData = { profilePicture: file };
        await updateProfileService(formData, userId);
        toast.success("Ảnh đại diện đã được cập nhật!");
      } else if (type === "cover") {
        const formData = { coverPicture: file };
        await updateCoverService(formData, userId);
        toast.success("Ảnh bìa đã được cập nhật!");
      }
      fetchUser();
    } catch (error) {
      toast.error("Cập nhật ảnh thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    countFriend();
  }, []); // Chạy một lần khi component được render

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const toggleFriendSuggestion = () => {
    setFriendSuggestionVisible(!isFriendSuggestionVisible);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return <Posts userName={userInfo.name} />;
      case "2":
        return <Introduction />;
      case "3":
        return <Friends />;
      case "4":
        return <Photos />;
      case "5":
        return <Videos />;
      case "6":
        return (
          <div style={{ minHeight: "1000px" }}>Nội dung của tab Reels</div>
        );
      case "7":
        return (
          <div style={{ minHeight: "1000px" }}>Nội dung của tab Xem thêm</div>
        );
      default:
        return null;
    }
  };

  const menu = (
    <Menu className={styles["custom-menu"]}>
      <Menu.Item key="1" className={styles["menu-item"]}>
        Chế độ xem
      </Menu.Item>
      <Menu.Item key="2" className={styles["menu-item"]}>
        Tìm kiếm
      </Menu.Item>
      <Menu.Item key="3" className={styles["menu-item"]}>
        Trạng thái trang cá nhân
      </Menu.Item>
      <Menu.Item key="4" className={styles["menu-item"]}>
        Kho lưu trữ
      </Menu.Item>
      <Menu.Item key="5" className={styles["menu-item"]}>
        Kho lưu trữ tin
      </Menu.Item>
      <Menu.Item key="6" className={styles["menu-item"]}>
        Nhật ký hoạt động
      </Menu.Item>
      <Menu.Item key="7" className={styles["menu-item"]}>
        Cài đặt trang cá nhân và gần thể
      </Menu.Item>
      <Menu.Item key="8" className={styles["menu-item"]}>
        Khóa bảo vệ trang cá nhân
      </Menu.Item>
      <Menu.Item key="9" className={styles["menu-item"]}>
        Bật chế độ chuyên nghiệp
      </Menu.Item>
      <Menu.Item key="10" className={styles["menu-item"]}>
        Tạo trang cá nhân khác
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    // Hàm kiểm tra chiều rộng của container
    const checkContainerWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Kiểm tra nếu chiều rộng container < 1000px thì set width của header khác
        setHeaderWidth(containerWidth < 1300 ? "94%" : "70%");
      }
    };

    // Lắng nghe sự thay đổi kích thước của container
    const resizeObserver = new ResizeObserver(() => checkContainerWidth());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Dọn dẹp ResizeObserver khi component unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []); // Chạy 1 lần khi component mount

  return (
    <>
      <div className={styles["container"]} ref={containerRef}>
        <div className={styles["header"]} style={{ width: headerWidth }}>
          <div
            className={styles["wallpaper"]}
            onClick={() => handleImageClick("cover")}
          >
            <img
              className={styles["wallpaper-img"]}
              src={userInfo.cover_photo_url}
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              ref={coverInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e, "cover")}
            />
            <div className={styles["add-wallpaper"]}>
              <IoIosCamera style={{ width: "25px", height: "25px" }} />
              <span style={{ fontSize: "16px", fontWeight: 500 }}>
                Thêm ảnh bìa
              </span>
            </div>
          </div>
          <Row className={styles["info"]} gutter={16}>
            <Col span={6}>
              <div
                className={styles["avatar"]}
                onClick={() => handleImageClick("avatar")}
              >
                <img
                  className={styles["avatar-img"]}
                  src={
                    userInfo.avatar_url
                  }
                  alt="Avatar"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={avatarInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => handleImageChange(e, "avatar")}
                />
              </div>
              <div
                className={styles["add-avatar"]}
                onClick={() => handleImageClick("avatar")}
              >
                <IoIosCamera style={{ width: "25px", height: "25px" }} />
              </div>
            </Col>
            <Col span={9} style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "30px", fontWeight: 700, marginTop: "24px" }}
              >
                {userInfo.name}
              </span>
              <a
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#65686c",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.textDecoration = "underline")
                }
                onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              >
                {friendCount} người bạn
              </a>
            </Col>
            <Col style={{ paddingRight: "0px" }} span={9}>
              <div style={{ marginTop: "40px", textAlign: "right" }}>
                <button className={styles["blue-button"]}>
                  <IoMdAdd />
                  Thêm vào tin
                </button>
                <button className={styles["white-button"]}>
                  <FaPen />
                  Chỉnh sửa trang cá nhân
                </button>
              </div>
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 16px",
                  }}
                  className={styles["small-button"]}
                  onClick={toggleFriendSuggestion}
                >
                  <IoIosArrowDown
                    className={`${styles.arrowIcon} ${
                      isFriendSuggestionVisible ? styles.arrowIconRotated : ""
                    }`} // Thêm lớp xoay mũi tên
                  />
                </button>
              </div>
            </Col>
          </Row>

          {isFriendSuggestionVisible && (
            <Row style={{ width: "100%" }}>
              <FriendSuggestion />
            </Row>
          )}

          <Row
            className={styles["tabs-select"]}
            style={{
              overflow: "hidden",
              height: "49px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Tabs defaultActiveKey="1" centered onChange={handleTabChange}>
              <Tabs.TabPane
                tab={<span className={styles.tab}>Bài viết</span>}
                key="1"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Giới thiệu</span>}
                key="2"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Bạn bè</span>}
                key="3"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Ảnh</span>}
                key="4"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Video</span>}
                key="5"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Reels</span>}
                key="6"
              />
              <Tabs.TabPane
                tab={<span className={styles.tab}>Xem thêm</span>}
                key="7"
              />
            </Tabs>
            <Dropdown overlay={menu} trigger={["click"]}>
              <button
                style={{ alignItems: "center", padding: "0 16px" }}
                className={styles["small-button"]}
              >
                <EllipsisOutlined />
              </button>
            </Dropdown>
          </Row>
        </div>
      </div>

      <div className={styles["container-2"]}>
        <div className={styles["content"]} style={{ width: headerWidth }}>
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
