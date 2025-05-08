/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Layout, Input, Avatar, Row, Col, Tooltip, Popover } from "antd";
import { GoSearch } from "react-icons/go";
import SearchBar from "../Components/SearchBar.jsx";
import NavItem from "./NavItem";
import ProfileContent from "./ProfileContent";
import NotificationContent from "./NotificationContent";
import AppStoreContent from "./AppStoreContent.jsx";
import { navItems, iconData } from "../assets/icons.jsx";
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import MessageContent from "./Message/MessageContent.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImg from "../assets/image/Header/logo.png";
import styles from "./Header.module.scss";
import { HeaderContext } from "../Context/HeaderContext.jsx";
import { userFindByIdService } from "../services/userService.jsx";
import { getUserIdFromLocalStorage } from "../utils/authUtils.jsx";

const { Header: AntHeader } = Layout;

const Header = ({ onMessageClick }) => {
  const { showHeader } = useContext(HeaderContext); // Lấy trạng thái showHeader từ Context
  const [selected, setSelected] = useState("home");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
  const location = useLocation();
  const [loading, setLoading] = useState(true); 
  const [userInfo, setUserInfo] = useState([]);
  const user_id = getUserIdFromLocalStorage();

  const handleLogoClick = () => {
    navigate("/"); // Điều hướng đến URL với tham số type
  };

  const handleSelect = (key, path) => {
    setSelected(key); // Cập nhật trạng thái selected trước khi navigate
    if (path) {
      navigate(path); // Navigate to the specified path
    }
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(user_id);
      setUserInfo(response?.data?.user || []); 
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    setSelectedIcon(null); // Close any open popover on navigation
  }, [location.pathname]);

  useEffect(() => {
    const allowedPaths = ["/", "/friends", "/groups"];
    if (!allowedPaths.includes(location.pathname)) {
      setSelected(""); // Reset selected item when on non-allowed path
    }
  }, [location.pathname]);

  // Cập nhật trạng thái selected dựa trên location.pathname
  useEffect(() => {
    const pathMapping = {
      "/": "home",
      "/friends": "friends",
      "/friends/": "friends",
      "/friends/requests": "friends",
      "/friends/suggested": "friends",
      "/friends/allFriends": "friends",
      "/groups": "groups",
    };

    // Cập nhật trạng thái selected khi pathname thay đổi
    const currentPage = pathMapping[location.pathname] || "home";
    setSelected(currentPage);
  }, [location.pathname]);

  const handleIconClick = (iconName) => {
    setSelectedIcon((prev) => (prev === iconName ? null : iconName));
  };

  const getPopoverContent = (name) => {
    switch (name) {
      case "notifications":
        return <NotificationContent />;
      case "messages":
        return (
          <MessageContent
            onMessageClick={onMessageClick}
            onClose={() => setSelectedIcon(null)} // Đóng Popover khi click
          />
        );
      case "appStore":
        return <AppStoreContent />;
      default:
        return null;
    }
  };

  // Nếu `showHeader` là `false`, không render Header
  if (!showHeader) return null;

  return (
    <AntHeader className={styles.header}>
      <Row
        align="middle"
        justify="space-between"
        className={styles["header-row"]}
      >
        <Col className={styles["header-logo"]}>
          <img
            src={LogoImg}
            className={styles["logo-img"]}
            onClick={handleLogoClick}
            alt="Footbook"
          />
          {/* <Input
            placeholder="Tìm kiếm trên Footbook"
            prefix={<FaSearch style={{ fontSize: "18px", color: "#65686c", marginRight: "4px" }} />}
            className={styles["search-input"]}
          /> */}
          <SearchBar />
        </Col>

        <Col className={styles["nav-items-container"]}>
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              selected={selected}
              handleSelect={() => handleSelect(item.key, item.path)} // Pass path to handleSelect
            />
          ))}
        </Col>

        <Col>
          <Row gutter={16} style={{ marginRight: "8px" }}>
            {iconData.map(({ name, icon, tooltip }) => (
              <Col
                key={name}
                style={{ padding: "0 4px" }}
                className={styles["icon-container"]}
              >
                <Tooltip title={tooltip}>
                  {["notifications", "messages", "appStore"].includes(name) ? (
                    <Popover
                      style={{ padding: 0 }}
                      content={getPopoverContent(name)}
                      trigger="click"
                      placement="bottomRight"
                      open={selectedIcon === name}
                      onOpenChange={(visible) =>
                        handleIconClick(visible ? name : null)
                      }
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <div
                        className={`${styles["icon-wrapper"]} ${
                          selectedIcon === name ? styles["icon-selected"] : ""
                        }`}
                      >
                        {icon}
                      </div>
                    </Popover>
                  ) : (
                    <div
                      className={`${styles["icon-wrapper"]} ${
                        selectedIcon === name ? styles["icon-selected"] : ""
                      }`}
                      onClick={() => handleIconClick(name)}
                    >
                      {icon}
                    </div>
                  )}
                </Tooltip>
              </Col>
            ))}

            <Col
              style={{ padding: "0 4px" }}
              className={styles["icon-container"]}
            >
              <Popover
                content={<ProfileContent 
                  userName={userInfo?.name}
                  UserAvatar={userInfo?.avatar_url}
                />}
                trigger="click"
                placement="bottomRight"
                open={selectedIcon === "profile"}
                onOpenChange={(visible) =>
                  handleIconClick(visible ? "profile" : null)
                }
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                
              >
                <div className={styles["avatar-wrapper"]}>
                  <img
                    className={styles["avatar"]}
                    src={userInfo?.avatar_url}
                    alt=""
                  />
                </div>
              </Popover>
            </Col>
          </Row>
        </Col>
      </Row>
    </AntHeader>
  );
};

export default Header;
