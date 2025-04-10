/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Tabs, Dropdown, Menu } from "antd";
import styles from "./FriendProfilePage.module.scss";
import { IoIosArrowDown, IoMdAdd } from "react-icons/io";
import { AiFillMessage } from "react-icons/ai";
import { EllipsisOutlined } from "@ant-design/icons";
import SuggestedFriends from "../UserProfilePage/SuggestedFriends.jsx";
import { useAuthCheck } from "../../../utils/checkAuth.jsx";
import {
  countFriendService,
  createFriendshipService,
  getFriendshipStatusService,
  deleteFriendshipService,
  acceptFriendshipService,
} from "../../../services/friendService.jsx";
import { useParams } from "react-router-dom";
import { getUserIdFromLocalStorage } from "../../../utils/authUtils.jsx";
import { userFindByIdService } from "../../../services/userService.jsx";
import Posts from "./Tabs/Posts/Posts.jsx";
import Photos from "./Tabs/Photos/Photos.jsx";
import { useChat } from "../../../utils/ChatContext.jsx";

const FriendProfilePage = ({ userId2: propUserId2, type }) => {
  useAuthCheck();

  // Lấy userId2 từ param nếu type là 'param', nếu không lấy từ prop
  const { userId2: paramUserId2 } = useParams();
  const userId2 = type === "prop" ? propUserId2 : paramUserId2;

  const [headerWidth, setHeaderWidth] = useState("70%");
  const containerRef = useRef(null);

  const [friendInfo, setFriendInfo] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [isFriendSuggestionVisible, setFriendSuggestionVisible] =
    useState(false);
  const [friendshipStatus, setFriendshipStatus] = useState(null); // Lưu trạng thái kết bạn
  const [sender, setSender] = useState(null);
  const [friendsCount, setFriendsCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
  const { addChat } = useChat();

  const userId1 = getUserIdFromLocalStorage(); // Lấy userId1 từ localStorage

  const fetchFriendProfile = async () => {
    try {
      const response = await userFindByIdService(userId2);
      console.log("RESPONSE: ", response);
      setFriendInfo(response?.data?.user || []);
      console.log("FRIENDINFO: ", friendInfo);
      console.log("Tên: ", response.data.user.address);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu bạn bè:", error);
    }
  };

  const fetchFriendshipStatus = async () => {
    try {
      const response = await getFriendshipStatusService({ userId1, userId2 });
      setFriendshipStatus(response?.data?.data?.status || null);
      setSender(response?.data?.data?.usent);
    } catch (error) {
      console.error("Lỗi khi lấy trạng thái bạn bè:", error);
    }
  };

  const countFriend = async () => {
    try {
      setIsLoading(true);
      const response = await countFriendService(userId2);
      setFriendsCount(response?.data?.friends_count || 0);
    } catch (error) {
      console.error("Error count friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      await createFriendshipService({ userId1, userId2 });

      fetchFriendshipStatus(); // Cập nhật trạng thái
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
    }
  };

  const handleAcceptFriend = async () => {
    try {
      await acceptFriendshipService({ userId1: userId2, userId2: userId1 });
      fetchFriendshipStatus(); // Cập nhật trạng thái
    } catch (error) {
      console.error("Lỗi khi gửi lời mời kết bạn:", error);
    }
  };

  const handleDeleteFriend = async () => {
    try {
      const data = {
        userId1: userId1, // ID của bạn
        userId2: userId2, // ID của người bạn muốn xóa
      };
      await deleteFriendshipService(data); // Gọi API
      setFriendshipStatus(null); // Cập nhật trạng thái thành không phải bạn bè
      countFriend(); // Cập nhật số lượng bạn bè
    } catch (error) {
      console.error("Lỗi khi xóa bạn bè:", error);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const toggleFriendSuggestion = () => {
    setFriendSuggestionVisible(!isFriendSuggestionVisible);
  };

  const handleSendMessage = () => {
    const message = {
      userId: userId2,
      name: friendInfo.name || "Unknown User", // Lấy tên từ `friendInfo`
      message: "Nhắn tin mới",
    };
    console.log("handleSendMessage called with message:", message);
    addChat(message);
  };

  const renderButton = () => {
    if (friendshipStatus === "PENDING") {
      if (userId1 !== sender) {
        return (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "column",
                marginBottom: "10px",
              }}
            >
              <div style={{ fontSize: "20px", fontWeight: "600" }}>
                {friendInfo.name} sent you a friend request
              </div>
              <div>
                <button
                  className={styles["blue-button"]}
                  onClick={handleAcceptFriend}
                >
                  Chấp nhận
                </button>
                <button
                  className={styles["white-button"]}
                  onClick={handleDeleteFriend}
                >
                  Từ chối
                </button>
              </div>
            </div>
          </>
        );
      } else {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={handleDeleteFriend}>
                  Hủy lời mời
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <button className={styles["blue-button"]}>
              Đã gửi lời mời kết bạn
            </button>
          </Dropdown>
        );
      }
    } else if (friendshipStatus === "ACCEPTED") {
      return (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1" onClick={handleDeleteFriend}>
                Hủy kết bạn
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <button className={styles["blue-button"]}>Bạn bè</button>
        </Dropdown>
      );
    } else {
      return (
        <button className={styles["blue-button"]} onClick={handleAddFriend}>
          <IoMdAdd /> Thêm bạn bè
        </button>
      );
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "1":
        return <Posts friendId={userId2} />;
      // case "2":
      //   return <Introduction />;
      // case "3":
      //   return <Friends />;
      case "4":
        return <Photos />;
      // case "5":
      //   return <Videos />;
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

  useEffect(() => {
    fetchFriendProfile();
    fetchFriendshipStatus();
    countFriend();
  }, [userId2]);

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
          <div className={styles["wallpaper"]}>
            <img
              className={styles["wallpaper-img"]}
              src={friendInfo.cover_photo_url}
              alt=""
            />
          </div>
          <Row className={styles["info"]} gutter={16}>
            <Col span={6}>
              <div className={styles["avatar"]}>
                <img
                  className={styles["avatar-img"]}
                  src={friendInfo.avatar_url}
                  alt=""
                />
              </div>
            </Col>
            <Col span={9} style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{ fontSize: "30px", fontWeight: 700, marginTop: "24px" }}
              >
                {friendInfo.name}
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#65686c",
                  textDecoration: "none",
                }}
              >
                {friendsCount} người bạn
              </span>
            </Col>
            <Col style={{ paddingRight: "0px" }} span={9}>
              <div style={{ marginTop: "40px", textAlign: "right" }}>
                {renderButton()}
                <button
                  className={styles["white-button"]}
                  onClick={handleSendMessage}
                >
                  <AiFillMessage />
                  Nhắn tin
                </button>
                <button
                  style={{ alignItems: "center", padding: "0 16px" }}
                  className={styles["small-button"]}
                  onClick={toggleFriendSuggestion}
                >
                  <IoIosArrowDown
                    className={`${styles.arrowIcon} ${
                      isFriendSuggestionVisible ? styles.arrowIconRotated : ""
                    }`}
                  />
                </button>
              </div>
            </Col>
          </Row>

          {isFriendSuggestionVisible && (
            <Row style={{ width: "100%" }}>
              <SuggestedFriends />
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
            <Dropdown trigger={["click"]}>
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
          {/* Nội dung tab */}
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default FriendProfilePage;
