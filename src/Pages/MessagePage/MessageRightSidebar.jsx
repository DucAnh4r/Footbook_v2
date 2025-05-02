// MessageRightSidebar.jsx
import React, { useState, useEffect } from "react";
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
  Badge,
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
  UserAddOutlined,
  CrownOutlined,
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
import PinnedMessagesModal from "../../Modal/PinnedMessagesModal";
import ThemePickerModal from "../../Modal/ThemePickerModal";
import EmojiPickerModal from "../../Modal/EmojiPickerModal";
import NicknameModal from "../../Modal/NicknameModal";
import NotificationMuteModal from "../../Modal/NotificationMuteModal";
import { PiClockCountdownLight } from "react-icons/pi";
import SelfDestructMessageModal from "../../Modal/SelfDestructMessageModal";
import RestrictUserModal from "../../Modal/RestrictUserModal";
import BlockUserModal from "../../Modal/BlockUserModal";
import ReportUserModal from "../../Modal/ReportUserModal";
import styles from "./MessageRightSidebar.module.scss";

const { Text, Title, Paragraph } = Typography;
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
  const [isNotificationMuteVisible, setNotificationMuteVisible] = useState(false);
  const [isSelfDestructVisible, setSelfDestructVisible] = useState(false);
  const [isRestrictUserVisible, setRestrictUserVisible] = useState(false);
  const [isBlockUserVisible, setBlockUserVisible] = useState(false);
  const [isReportUserVisible, setReportUserVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4D4D4D");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isNicknameModalVisible, setNicknameModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState("default");
  const [groupMembers, setGroupMembers] = useState([]);
  
  const showMainView = () => setViewMode("default");
  const showMediaFilesView = () => setViewMode("mediaFiles");
  const showFileListView = () => setViewMode("fileList");
  const showSearchView = () => setViewMode("search");
  const showGroupMembersView = () => setViewMode("groupMembers");

  useEffect(() => {
    // Determine if this is a group chat
    if (selectedChat?.type === 'group' && selectedChat?.members) {
      setGroupMembers(selectedChat.members);
    } else if (selectedChat?.type === 'group') {
      // If it's a group but no members are provided, set dummy members
      setGroupMembers([
        { 
          id: 1, 
          name: "Nguyễn Đức Anh", 
          avatar_url: "https://via.placeholder.com/40",
          role: "admin",
          status: "available"
        },
        { 
          id: 2, 
          name: "Duc Manh", 
          avatar_url: "https://via.placeholder.com/40",
          role: "member",
          status: "away"
        },
        { 
          id: 3, 
          name: "Hoàng Thị Lan", 
          avatar_url: "https://via.placeholder.com/40",
          role: "member",
          status: "offline"
        },
      ]);
    }
  }, [selectedChat]);

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

  const isGroupChat = selectedChat?.type === 'group';
  
  const renderGroupMemberStatus = (status) => {
    if (status === 'available') {
      return <Badge status="success" text="Đang hoạt động" />;
    } else if (status === 'away') {
      return <Badge status="warning" text="Đang bận" />;
    } else {
      return <Badge status="default" text="Ngoại tuyến" />;
    }
  };

  return (
    <div className={styles.sidebar}>
      {viewMode === "default" ? (
        <>
          {/* Profile Section */}
          <div className={styles.profileSection}>
            <Avatar 
              src={isGroupChat ? selectedChat?.avatar_url : selectedChat?.other_user?.avatar_url} 
              size={80} 
            />
            <Title level={5} className={styles.profileName}>
              {isGroupChat ? selectedChat?.name : selectedChat?.other_user?.name}
            </Title>
            {!isGroupChat && <Text type="secondary">Đang hoạt động</Text>}
            {isGroupChat && (
              <Text type="secondary">{groupMembers.length} thành viên</Text>
            )}
            <Space size="middle">
              {!isGroupChat && (
                <Tooltip title="Trang cá nhân">
                  <div className={styles.threeIcon}>
                    <Button shape="circle" icon={<FaRegUserCircle />} /> Trang
                    cá nhân
                  </div>
                </Tooltip>
              )}
              <Tooltip title="Tắt thông báo">
                <div className={styles.threeIcon}>
                  <Button
                    shape="circle"
                    onClick={() => setNotificationMuteVisible(true)}
                    icon={<BellOutlined />}
                  />{" "}
                  Tắt thông báo
                </div>
              </Tooltip>
              <Tooltip title="Tìm kiếm">
                <div className={styles.threeIcon}>
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
            defaultActiveKey={['1']}
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
                  icon={<MdPushPin className={styles.icon} />}
                  className={styles.linkButton}
                  onClick={() => setPinnedMessagesVisible(true)}
                >
                  Xem tin nhắn đã ghim
                </Button>
                
                {isGroupChat && (
                  <>
                    <Button
                      type="text"
                      icon={<TeamOutlined className={styles.icon} />}
                      className={styles.linkButton}
                      onClick={showGroupMembersView}
                    >
                      Xem thành viên nhóm ({groupMembers.length})
                    </Button>
                    <Paragraph className={styles.groupDescription}>
                      {selectedChat?.description || "Nhóm chat không có mô tả."}
                    </Paragraph>
                    <Text className={styles.groupSecondaryText}>
                      Nhóm được tạo ngày {selectedChat?.created_at 
                        ? new Date(selectedChat.created_at).toLocaleDateString() 
                        : "01/01/2025"}
                    </Text>
                  </>
                )}
              </Space>
            </Panel>

            <Panel header="Tùy chỉnh đoạn chat" key="2">
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                {isGroupChat && (
                  <>
                    <Button
                      type="text"
                      icon={<EditOutlined className={styles.icon} />}
                      className={styles.linkButton}
                    >
                      Đổi tên đoạn chat
                    </Button>
                    <Button
                      type="text"
                      icon={<FileImageOutlined className={styles.icon} />}
                      className={styles.linkButton}
                    >
                      Thay đổi ảnh
                    </Button>
                  </>
                )}
                <Button
                  type="text"
                  onClick={() => setThemePickerVisible(true)}
                  icon={<FaThumbsUp className={styles.icon} />}
                  className={styles.linkButton}
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
                  icon={<SmileOutlined className={styles.icon} />}
                  className={styles.linkButton}
                >
                  Thay đổi biểu tượng cảm xúc
                </Button>
                <Button
                  type="text"
                  icon={<FontSizeOutlined className={styles.icon} />}
                  onClick={() => setNicknameModalVisible(true)}
                  className={styles.linkButton}
                >
                  Chỉnh sửa biệt danh
                </Button>
                <NicknameModal
                  visible={isNicknameModalVisible}
                  onClose={() => setNicknameModalVisible(false)}
                />
              </Space>
            </Panel>

            {isGroupChat && (
              <Panel header="Tùy chọn nhóm" key="3">
                <Space
                  direction="vertical"
                  align="start"
                  style={{ width: "100%" }}
                >
                  <Text type="secondary">Cần quản trị viên phê duyệt</Text>
                  <Switch defaultChecked={false} className={styles.switch} />
                  <Text type="secondary" className={styles.helperText}>
                    Quản trị viên cần phê duyệt tất cả yêu cầu tham gia nhóm
                    chat.
                  </Text>
                  
                  <Divider />
                  
                  <Button
                    type="text"
                    icon={<UserAddOutlined className={styles.icon} />}
                    className={styles.linkButton}
                  >
                    Thêm thành viên
                  </Button>
                </Space>
              </Panel>
            )}

            <Panel
              header={`File phương tiện, file${
                isGroupChat ? " và liên kết" : ""
              }`}
              key="4"
            >
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<FileImageOutlined className={styles.icon} />}
                  onClick={showMediaFilesView}
                  className={styles.linkButton}
                >
                  File phương tiện
                </Button>
                <Button
                  type="text"
                  icon={<FileOutlined className={styles.icon} />}
                  onClick={showFileListView}
                  className={styles.linkButton}
                >
                  File
                </Button>
                {isGroupChat && (
                  <Button
                    type="text"
                    icon={<LinkOutlined className={styles.icon} />}
                    className={styles.linkButton}
                  >
                    Liên kết
                  </Button>
                )}
              </Space>
            </Panel>

            <Panel header="Quyền riêng tư & hỗ trợ" key="5">
              <Space
                direction="vertical"
                align="start"
                style={{ width: "100%" }}
              >
                <Button
                  type="text"
                  icon={<BellOutlined className={styles.icon} />}
                  onClick={() => setNotificationMuteVisible(true)}
                  className={styles.linkButton}
                >
                  Tắt thông báo
                </Button>
                {isGroupChat ? (
                  <>
                    <Button
                      type="text"
                      icon={<AiOutlineWarning className={styles.icon} />}
                      className={styles.linkButton}
                    >
                      Báo cáo
                    </Button>
                    <Text type="secondary" className={styles.helperText}>
                      Đóng góp ý kiến và báo cáo cuộc trò chuyện
                    </Text>
                    <Button
                      type="text"
                      icon={<BiExit className={styles.icon} />}
                      className={styles.linkButton}
                    >
                      Rời nhóm
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="text"
                      icon={<PiClockCountdownLight className={styles.icon} />}
                      onClick={() => setSelfDestructVisible(true)}
                      className={styles.linkButton}
                    >
                      Tin nhắn tự hủy
                    </Button>
                    <Button
                      type="text"
                      icon={<MdCommentsDisabled className={styles.icon} />}
                      onClick={() => setRestrictUserVisible(true)}
                      className={styles.linkButton}
                    >
                      Hạn chế
                    </Button>
                    <Button
                      type="text"
                      icon={<MdBlockFlipped className={styles.icon} />}
                      onClick={() => setBlockUserVisible(true)}
                      className={styles.linkButton}
                    >
                      Chặn
                    </Button>
                    <Button
                      type="text"
                      icon={<MdReportProblem className={styles.icon} />}
                      onClick={() => setReportUserVisible(true)}
                      className={styles.linkButton}
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
          <div className={styles.header}>
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
              <div className={styles.mediaGrid}>
                {mediaFiles.map((file) => (
                  <Image
                    key={file.id}
                    src={file.src}
                    className={styles.mediaItem}
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
          <div className={styles.header}>
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
              <div className={styles.mediaGrid}>
                {mediaFiles.map((file) => (
                  <Image
                    key={file.id}
                    src={file.src}
                    className={styles.mediaItem}
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
      ) : viewMode === "groupMembers" ? (
        <>
          <div className={styles.header}>
            <LeftOutlined
              onClick={showMainView}
              style={{ cursor: "pointer", fontSize: "18px" }}
            />
            <Title level={5} style={{ margin: "0 16px" }}>
              Thành viên nhóm
            </Title>
          </div>
          
          <List
            className={styles.participantsList}
            dataSource={groupMembers}
            renderItem={(member) => (
              <List.Item key={member.id} className={styles.participantItem}>
                <div className={styles.participantInfo}>
                  <Avatar src={member.avatar_url} />
                  <div>
                    <Text strong>
                      {member.name}
                      {member.role === 'admin' && (
                        <span className={styles.adminBadge}>
                          <CrownOutlined /> Quản trị viên
                        </span>
                      )}
                    </Text>
                    <div>{renderGroupMemberStatus(member.status)}</div>
                  </div>
                </div>
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setNicknameModalVisible(true);
                    // Set the selected member to edit
                  }}
                />
              </List.Item>
            )}
          />
          
          <Divider />
          
          <Button 
            type="primary" 
            icon={<UserAddOutlined />} 
            style={{ width: '100%' }}
          >
            Thêm thành viên
          </Button>
        </>
      ) : (
        <div className={styles.container}>
          {/* Header */}
          <Space align="center" className={styles.header}>
            <Button
              type="text"
              icon={<LeftOutlined className={styles.icon} />}
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
            className={styles.searchInput}
          />

          {/* Hint */}
          {searchQuery && (
            <div className={styles.hintContainer}>
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
        participants={isGroupChat ? groupMembers : []}
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
        avatar={selectedChat?.other_user?.avatar_url}
        name={selectedChat?.other_user?.name}
      />
      <BlockUserModal
        visible={isBlockUserVisible}
        onClose={() => setBlockUserVisible(false)}
        name={selectedChat?.other_user?.name}
      />
      <ReportUserModal
        visible={isReportUserVisible}
        onClose={() => setReportUserVisible(false)}
        name={selectedChat?.other_user?.name}
      />
    </div>
  );
};

export default MessageRightSidebar;