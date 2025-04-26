// MessageRightSidebar.js
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  Space,
  Tooltip,
  Typography,
  Switch,
  Tabs,
  Image,
  List,
  Input,
} from "antd";
import {
  BellOutlined,
  SearchOutlined,
  EditOutlined,
  FileImageOutlined,
  FileOutlined,
  LinkOutlined,
  SmileOutlined,
  FontSizeOutlined,
  TeamOutlined,
  LeftOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  MdPushPin,
  MdBlockFlipped,
  MdReportProblem,
  MdCommentsDisabled,
} from "react-icons/md";
import { BiExit } from "react-icons/bi";
import { AiOutlineWarning } from "react-icons/ai";
import { FaRegUserCircle, FaThumbsUp } from "react-icons/fa";
import PinnedMessagesModal from "../../../Modal/PinnedMessagesModal";
import ThemePickerModal from "../../../Modal/ThemePickerModal";
import EmojiPickerModal from "../../../Modal/EmojiPickerModal";
import NicknameModal from "../../../Modal/NicknameModal";
import NotificationMuteModal from "../../../Modal/NotificationMuteModal";
import { PiClockCountdownLight } from "react-icons/pi";
import SelfDestructMessageModal from "../../../Modal/SelfDestructMessageModal";
import RestrictUserModal from "../../../Modal/RestrictUserModal";
import BlockUserModal from "../../../Modal/BlockUserModal";
import ReportUserModal from "../../../Modal/ReportUserModal";

const { Text, Title } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const pinnedMessages = [
  {
    id: 1,
    sender: "Anh",
    content: "63k+27k=90k",
    time: "T6",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 2,
    sender: "Anh",
    content: "527k",
    time: "T5",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 3,
    sender: "Anh",
    content: "125.5 + 72k = 197.5k",
    time: "21 Tháng 10",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 4,
    sender: "Bạn",
    content: "28/10 lấy bằng",
    time: "17 Tháng 8",
    avatar: "https://via.placeholder.com/40",
  },
  {
    id: 5,
    sender: "Bạn",
    content: "16/9 lấy cmt",
    time: "17 Tháng 8",
    avatar: "https://via.placeholder.com/40",
  },
];

// Color options for theme picker
const colors = [
  "#4D4D4D",
  "#999999",
  "#333333",
  "#000000",
  "#E60000",
  "#FF9900",
  "#FFFF00",
  "#33CC33",
  "#3399FF",
  "#CC33FF",
];

const participants = [
  {
    id: 1,
    name: "Nguyễn Đức Anh",
    avatar: "https://via.placeholder.com/40",
    nickname: "Đặt biệt danh",
  },
  {
    id: 2,
    name: "Duc Manh",
    avatar: "https://via.placeholder.com/40",
    nickname: "Đặt biệt danh",
  },
];

const mediaFiles = [
  { id: 1, src: "https://via.placeholder.com/150", type: "image" },
  { id: 2, src: "https://via.placeholder.com/150", type: "image" },
  // Thêm nhiều ảnh hoặc tệp khác
];

const fileList = [
  { id: 1, name: "Tài liệu 1.pdf", type: "file" },
  { id: 2, name: "Báo cáo 2.docx", type: "file" },
  // Thêm nhiều tệp khác
];

const MessageRightSidebar = ({ selectedChat }) => {
  const [isPinnedMessagesVisible, setPinnedMessagesVisible] = useState(false);
  const [isThemePickerVisible, setThemePickerVisible] = useState(false);
  const [isNotificationMuteVisible, setNotificationMuteVisible] =
    useState(false);
  const [isSelfDestructVisible, setSelfDestructVisible] = useState(false);
  const [isRestrictUserVisible, setRestrictUserVisible] = useState(false);
  const [isBlockUserVisible, setBlockUserVisible] = useState(false);
  const [isReportUserVisible, setReportUserVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4D4D4D");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("default");
  const showMainView = () => setViewMode("default");
  const showMediaFilesView = () => setViewMode("mediaFiles");
  const showFileListView = () => setViewMode("fileList");
  const showSearchView = () => setViewMode("search");

  const handleThemeChange = (color) => {
    setSelectedColor(color);
    setThemePickerVisible(false);
  };

  const handleEmojiSelect = (emoji) => {
    console.log("Selected emoji:", emoji.native);
    setEmojiPickerVisible(false);
  };

  const handleMuteNotifications = () => {
    console.log("Notifications muted");
    setNotificationMuteVisible(false);
  };

  const handleSaveSelfDestruct = (option) => {
    console.log("Self-destruct option selected:", option);
    setSelfDestructVisible(false);
  };

  const handleRestrictUser = () => {
    console.log("User has been restricted");
    setRestrictUserVisible(false);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log(`Searching for: ${searchQuery}`);
      // Thực hiện tìm kiếm dựa trên `searchQuery`
    }
  };

  return (
    <div style={styles.sidebar}>
      {viewMode === "default" ? (
        <>
          {/* Profile Section */}
          <div style={styles.profileSection}>
            <Avatar src={selectedChat?.other_user.avatar_url} size={80} />
            <Title level={5} style={styles.profileName}>
              {selectedChat?.other_user.name}
            </Title>
            <Text type="secondary">Đang hoạt động</Text>
            <Space size="middle">
              {!selectedChat?.isGroup && (
                <Tooltip title="Trang cá nhân">
                  <div style={styles.threeIcon}>
                    <Button shape="circle" icon={<FaRegUserCircle />} /> Trang
                    cá nhân
                  </div>
                </Tooltip>
              )}
              <Tooltip title="Tắt thông báo">
                <div style={styles.threeIcon}>
                  <Button
                    shape="circle"
                    onClick={() => setNotificationMuteVisible(true)}
                    icon={<BellOutlined />}
                  />{" "}
                  Tắt thông báo
                </div>
              </Tooltip>
              <Tooltip title="Tìm kiếm">
                <div style={styles.threeIcon}>
                  <Button
                    shape="circle"
                    onClick={() => {
                      showSearchView();
                      setSearchQuery("");
                    }}
                    icon={<SearchOutlined />}
                  />{" "}
                  Tìm kiếm
                </div>
              </Tooltip>
            </Space>
          </div>

          <Divider />

          {/* Dynamic Information Section */}
          <Collapse
            bordered={false}
            expandIconPosition="end"
            style={{ backgroundColor: "white" }}
          >
            <Panel header="Thông tin về đoạn chat" key="1">
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<MdPushPin style={styles.icon} />}
                  style={styles.linkButton}
                  onClick={() => setPinnedMessagesVisible(true)}
                >
                  Xem tin nhắn đã ghim
                </Button>
              </Space>
            </Panel>

            <Panel header="Tùy chỉnh đoạn chat" key="2">
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                {selectedChat?.isGroup && (
                  <>
                    <Button
                      type="text"
                      icon={<EditOutlined style={styles.icon} />}
                      style={styles.linkButton}
                    >
                      Đổi tên đoạn chat
                    </Button>
                    <Button
                      type="text"
                      icon={<FileImageOutlined style={styles.icon} />}
                      style={styles.linkButton}
                    >
                      Thay đổi ảnh
                    </Button>
                  </>
                )}
                <Button
                  type="text"
                  onClick={() => setThemePickerVisible(true)}
                  icon={<FaThumbsUp style={styles.icon} />}
                  style={styles.linkButton}
                >
                  Đổi chủ đề
                </Button>
                <ThemePickerModal
                  visible={isThemePickerVisible}
                  onClose={() => setThemePickerVisible(false)}
                  onSave={handleThemeChange}
                />
                <Button
                  type="text"
                  onClick={() => setEmojiPickerVisible(true)}
                  icon={<SmileOutlined style={styles.icon} />}
                  style={styles.linkButton}
                >
                  Thay đổi biểu tượng cảm xúc
                </Button>
                <Button
                  type="text"
                  icon={<FontSizeOutlined style={styles.icon} />}
                  onClick={() => setNicknameModalVisible(true)}
                  style={styles.linkButton}
                >
                  Chỉnh sửa biệt danh
                </Button>
                <NicknameModal
                  visible={isNicknameModalVisible}
                  onClose={() => setNicknameModalVisible(false)}
                />
              </Space>
            </Panel>

            {selectedChat?.isGroup && (
              <Panel header="Tùy chọn nhóm" key="3">
                <Space
                  direction="vertical"
                  align="start"
                  style={{ width: "100%" }}
                >
                  <Text type="secondary">Cần quản trị viên phê duyệt</Text>
                  <Switch defaultChecked={false} style={styles.switch} />
                  <Text type="secondary" style={styles.helperText}>
                    Quản trị viên cần phê duyệt tất cả yêu cầu tham gia nhóm
                    chat.
                  </Text>
                </Space>
              </Panel>
            )}

            {selectedChat?.isGroup && (
              <Panel header="Thành viên trong đoạn chat" key="4">
                <Button
                  type="text"
                  icon={<TeamOutlined style={styles.icon} />}
                  style={styles.linkButton}
                >
                  Quản lý thành viên
                </Button>
              </Panel>
            )}

            <Panel
              header={`File phương tiện, file${
                selectedChat?.isGroup ? " và liên kết" : ""
              }`}
              key="5"
            >
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<FileImageOutlined style={styles.icon} />}
                  onClick={showMediaFilesView}
                  style={styles.linkButton}
                >
                  File phương tiện
                </Button>
                <Button
                  type="text"
                  icon={<FileOutlined style={styles.icon} />}
                  onClick={showFileListView}
                  style={styles.linkButton}
                >
                  File
                </Button>
                {selectedChat?.isGroup && (
                  <Button
                    type="text"
                    icon={<LinkOutlined style={styles.icon} />}
                    style={styles.linkButton}
                  >
                    Liên kết
                  </Button>
                )}
              </Space>
            </Panel>

            <Panel header="Quyền riêng tư & hỗ trợ" key="6">
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<BellOutlined style={styles.icon} />}
                  onClick={() => setNotificationMuteVisible(true)}
                  style={styles.linkButton}
                >
                  Tắt thông báo
                </Button>
                {selectedChat?.isGroup ? (
                  <>
                    <Button
                      type="text"
                      icon={<AiOutlineWarning style={styles.icon} />}
                      style={styles.linkButton}
                    >
                      Báo cáo
                    </Button>
                    <Text type="secondary" style={styles.helperText}>
                      Đóng góp ý kiến và báo cáo cuộc trò chuyện
                    </Text>
                    <Button
                      type="text"
                      icon={<BiExit style={styles.icon} />}
                      style={styles.linkButton}
                    >
                      Rời nhóm
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="text"
                      icon={<PiClockCountdownLight style={styles.icon} />}
                      onClick={() => setSelfDestructVisible(true)}
                      style={styles.linkButton}
                    >
                      Tin nhắn tự hủy
                    </Button>
                    <Button
                      type="text"
                      icon={<MdCommentsDisabled style={styles.icon} />}
                      onClick={() => setRestrictUserVisible(true)}
                      style={styles.linkButton}
                    >
                      Hạn chế
                    </Button>
                    <Button
                      type="text"
                      icon={<MdBlockFlipped style={styles.icon} />}
                      onClick={() => setBlockUserVisible(true)}
                      style={styles.linkButton}
                    >
                      Chặn
                    </Button>
                    <Button
                      type="text"
                      icon={<MdReportProblem style={styles.icon} />}
                      onClick={() => setReportUserVisible(true)}
                      style={styles.linkButton}
                    >
                      Báo cáo
                    </Button>
                  </>
                )}
              </Space>
            </Panel>
          </Collapse>
        </>
      ) : viewMode === "mediaFiles" ? (
        <>
          <div style={styles.header}>
            <LeftOutlined
              onClick={showMainView}
              style={{ cursor: "pointer", fontSize: "18px" }}
            />
            <Title level={5} style={{ margin: "0 16px" }}>
              File phương tiện và file
            </Title>
          </div>
          <Tabs defaultActiveKey="media" style={{ marginTop: "16px" }}>
            <TabPane tab="File phương tiện" key="media">
              <div style={styles.mediaGrid}>
                {mediaFiles.map((file) => (
                  <Image
                    key={file.id}
                    src={file.src}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      padding: "2px",
                    }}
                    alt="Media"
                  />
                ))}
              </div>
            </TabPane>
            <TabPane tab="File" key="file">
              <List
                dataSource={fileList}
                renderItem={(file) => (
                  <List.Item key={file.id}>
                    <List.Item.Meta title={file.name} />
                  </List.Item>
                )}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              />
            </TabPane>
          </Tabs>
        </>
      ) : viewMode === "fileList" ? (
        <>
          <div style={styles.header}>
            <LeftOutlined
              onClick={showMainView}
              style={{ cursor: "pointer", fontSize: "18px" }}
            />
            <Title level={5} style={{ margin: "0 16px" }}>
              File phương tiện và file
            </Title>
          </div>
          <Tabs defaultActiveKey="file" style={{ marginTop: "16px" }}>
            <TabPane tab="File phương tiện" key="media">
              <div style={styles.mediaGrid}>
                {mediaFiles.map((file) => (
                  <Image
                    key={file.id}
                    src={file.src}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      padding: "2px",
                    }}
                    alt="Media"
                  />
                ))}
              </div>
            </TabPane>
            <TabPane tab="File" key="file">
              <List
                dataSource={fileList}
                renderItem={(file) => (
                  <List.Item key={file.id}>
                    <List.Item.Meta title={file.name} />
                  </List.Item>
                )}
                style={{ maxHeight: "400px", overflowY: "auto" }}
              />
            </TabPane>
          </Tabs>
        </>
      ) : (
        <div style={styles.container}>
          {/* Header */}
          <Space align="center" style={styles.header}>
            <Button
              type="text"
              icon={<LeftOutlined style={styles.icon} />}
              onClick={showMainView}
              style={{ fontSize: "16px" }}
            />
            <Title level={5} style={{ margin: "0" }}>
              Tìm kiếm
            </Title>
          </Space>

          {/* Search Input */}
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            suffix={
              searchQuery && (
                <CloseOutlined
                  onClick={() => setSearchQuery("")}
                  style={{ cursor: "pointer" }}
                />
              )
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            style={styles.searchInput}
          />

          {/* Hint */}
          {searchQuery && (
            <div style={styles.hintContainer}>
              <Text type="secondary">Nhấn "Enter" để tìm kiếm.</Text>
            </div>
          )}
        </div>
      )}

      <PinnedMessagesModal
        visible={isPinnedMessagesVisible}
        onClose={() => setPinnedMessagesVisible(false)}
        pinnedMessages={pinnedMessages}
        selectedColor={selectedColor}
      />
      <ThemePickerModal
        visible={isThemePickerVisible}
        onClose={() => setThemePickerVisible(false)}
        onSave={handleThemeChange}
        colors={colors}
      />
      <EmojiPickerModal
        visible={isEmojiPickerVisible}
        onClose={() => setEmojiPickerVisible(false)}
        onEmojiSelect={handleEmojiSelect}
      />
      <NicknameModal
        visible={isNicknameModalVisible}
        onClose={() => setNicknameModalVisible(false)}
        participants={participants}
      />
      <NotificationMuteModal
        visible={isNotificationMuteVisible}
        onClose={() => setNotificationMuteVisible(false)}
        onMute={handleMuteNotifications}
      />
      <SelfDestructMessageModal
        visible={isSelfDestructVisible}
        onClose={() => setSelfDestructVisible(false)}
        onSave={handleSaveSelfDestruct}
      />
      <RestrictUserModal
        visible={isRestrictUserVisible}
        onClose={() => setRestrictUserVisible(false)}
        onRestrict={handleRestrictUser}
        avatar={selectedChat?.avatar}
        name={selectedChat?.name}
      />
      <BlockUserModal
        visible={isBlockUserVisible}
        onClose={() => setBlockUserVisible(false)}
        name={selectedChat?.name}
      />
      <ReportUserModal
        visible={isReportUserVisible}
        onClose={() => setReportUserVisible(false)}
        name={selectedChat?.name}
      />
    </div>
  );
};

const styles = {
  sidebar: {
    width: "380px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    maxHeight: "93vh",
    overflowY: "auto",
    height: "inherit",
    scrollbarWidth: "none",
  },
  colorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "10px",
  },
  colorCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "1px solid #d9d9d9",
  },
  profileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  profileName: {
    margin: 0,
    textAlign: "center",
  },
  linkButton: {
    width: "100%",
    textAlign: "left",
  },
  switch: {
    marginTop: "10px",
  },
  helperText: {
    fontSize: "12px",
    color: "gray",
    paddingTop: "8px",
  },
  container: {
    padding: "16px",
    width: "100%",
    maxWidth: "390px",
    margin: "0 auto",
    backgroundColor: "#fff",
    height: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  searchInput: {
    borderRadius: "20px",
    padding: "8px",
    fontSize: "16px",
    marginBottom: "16px",
  },
  hintContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  icon: {
    color: "0084ff",
  },
  threeIcon: {
    display: "grid",
    justifyItems: "center",
    alignItems: "center",
    fontWeight: "normal",
    width: "90px",
  },
};

export default MessageRightSidebar;
