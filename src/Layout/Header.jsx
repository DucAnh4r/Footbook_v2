/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useMemo } from "react";
import { Layout, Row, Col, Tooltip, Popover } from "antd";
import SearchBar from "../Components/SearchBar.jsx";
import NavItem from "./NavItem";
import { navItems, iconData } from "../assets/icons.jsx";
import ProfileContent from "./ProfileContent";
import NotificationContent from "./NotificationContent";
import MessageContent from "./Message/MessageContent.jsx";
import AppStoreContent from "./AppStoreContent.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import LogoImg from "../assets/image/Header/logo.png";
import styles from "./Header.module.scss";
import { HeaderContext } from "../Context/HeaderContext.jsx";
import { userFindByIdService } from "../services/userService.jsx";
import { getUserIdFromLocalStorage } from "../utils/authUtils.jsx";

const { Header: AntHeader } = Layout;

// Path mapping configuration for navigation
const PATH_MAPPING = {
  "/": "home",
  "/friends": "friends",
  "/friends/": "friends",
  "/friends/requests": "friends",
  "/friends/suggested": "friends",
  "/friends/allFriends": "friends",
  "/groups": "groups",
};

// Component for popover content rendering
const PopoverContentMap = {
  notifications: NotificationContent,
  messages: MessageContent,
  appStore: AppStoreContent,
};

const Header = ({ onMessageClick }) => {
  const { showHeader } = useContext(HeaderContext);
  const [selected, setSelected] = useState("home");
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();
  const userId = getUserIdFromLocalStorage();

  // Fetch user info only once when component mounts or userId changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await userFindByIdService(userId);
        if (response?.data?.user) {
          setUserInfo(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // Update selected state based on location.pathname
  useEffect(() => {
    const currentPage = PATH_MAPPING[location.pathname] || "";
    setSelected(currentPage);
    setSelectedIcon(null); // Close any open popover on navigation
  }, [location.pathname]);

  const handleLogoClick = () => navigate("/");

  const handleSelect = (key, path) => {
    setSelected(key);
    if (path) {
      navigate(path);
    }
  };

  const handleIconClick = (iconName) => {
    setSelectedIcon(prev => prev === iconName ? null : iconName);
  };

  // Memoize popover content to prevent unnecessary re-renders
  const getPopoverContent = useMemo(() => (name) => {
    const ContentComponent = PopoverContentMap[name];
    
    if (!ContentComponent) return null;
    
    if (name === "messages") {
      return (
        <ContentComponent
          onMessageClick={onMessageClick}
          onClose={() => setSelectedIcon(null)}
        />
      );
    }
    
    return <ContentComponent />;
  }, [onMessageClick]);

  // Don't render if header shouldn't be shown
  if (!showHeader) return null;

  return (
    <AntHeader className={styles.header}>
      <Row
        align="middle"
        justify="space-between"
        className={styles["header-row"]}
      >
        {/* Logo and Search Section */}
        <Col className={styles["header-logo"]}>
          <img
            src={LogoImg}
            className={styles["logo-img"]}
            onClick={handleLogoClick}
            alt="Footbook"
          />
          <SearchBar />
        </Col>

        {/* Navigation Section */}
        <Col className={styles["nav-items-container"]}>
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              selected={selected}
              handleSelect={() => handleSelect(item.key, item.path)}
            />
          ))}
        </Col>

        {/* Icons and Profile Section */}
        <Col>
          <Row gutter={16} style={{ marginRight: "8px" }}>
            {/* Render icon buttons */}
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
                      onOpenChange={(visible) => handleIconClick(visible ? name : null)}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
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

            {/* Profile avatar */}
            <Col
              style={{ padding: "0 4px" }}
              className={styles["icon-container"]}
            >
              <Popover
                content={
                  <ProfileContent
                    userName={userInfo?.name}
                    UserAvatar={userInfo?.avatar_url}
                  />
                }
                trigger="click"
                placement="bottomRight"
                open={selectedIcon === "profile"}
                onOpenChange={(visible) => handleIconClick(visible ? "profile" : null)}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <div className={styles["avatar-wrapper"]}>
                  <img
                    className={styles["avatar"]}
                    src={userInfo?.avatar_url}
                    alt={userInfo?.name || "User avatar"}
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

export default React.memo(Header);