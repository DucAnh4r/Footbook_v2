/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Modal, Button, Avatar, Input, Checkbox, Tooltip } from "antd";
import { FaArrowLeft, FaEarthAmericas } from "react-icons/fa6";
import styles from "./ShareModal.module.scss";
import AudienceModal from "./AudienceModal";
import { IoSearchOutline } from "react-icons/io5";
import {
  FaFacebookMessenger,
  FaLink,
  FaRegFileAlt,
  FaUserFriends,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";
import { getUserIdFromLocalStorage } from "../utils/authUtils";
import { createPostService, sharePostService } from "../services/postService";
import Toastify from "../assets/Toastify";
import { ToastContainer } from "react-toastify";
import { userFindByIdService } from "../services/userService";

const ShareModal = ({ isModalOpen, onCancel, postId, userInfo, onClose }) => {
  const [view, setView] = useState("share");
  const [selectedAudience, setSelectedAudience] = useState("friends");
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  const userId = getUserIdFromLocalStorage();
  const [myUser, setMyUser] = useState([]);
  const fetchMyUser = async () => {
    try {
      setLoading(true);
      const response = await userFindByIdService(userId);
      setMyUser(response?.data?.user || []); // Lưu dữ liệu trả về
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const users = [
    {
      id: 1,
      name: "Trí Dũng",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      id: 2,
      name: "1111111111111111111111111111111",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Ninh bình",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    },
    {
      id: 4,
      name: "Fordeer Life Style",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    },
    {
      id: 5,
      name: "IT4",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    },
  ];

  const handleCheckboxChange = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleShare = async () => {
    try {
      setLoading(true);

      const postData = {
        userId: userId,
        postId: postId,
        content: postContent,
        privacy: selectedAudience,
      };

      // Gọi API chia sẻ bài đăng
      await sharePostService(postData);

      console.log("Post shared successfully!");
      onClose(); // Đóng modal
      Toastify("Chia sẻ bài viết thành công!", "success");
    } catch (error) {
      console.error("Failed to share post:", error);
      Toastify("Đã xảy ra lỗi khi chia sẻ bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const link = `http://localhost:5173/post/${postId}`;
    navigator.clipboard
      .writeText(link)
      .then(() => {
        Toastify("Sao chép liên kết bài viết thành công!", "success");
      })
      .catch(() => alert("Không thể sao chép liên kết. Vui lòng thử lại."));
  };

  const renderShareContent = () => (
    <>
      <ToastContainer />
      <div className={styles.shareContainer}>
        <div className={styles.content}>
          <div className={styles.header}>
            <Avatar src={myUser?.avatar_url} />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{myUser?.name}</span>
              <div className={styles.privacyContainer}>
                <div className={styles.underName}>
                  <span className={styles.privacy}>
                    Feed · <FaEarthAmericas />
                  </span>
                  <Button
                    size="small"
                    className={styles.friendsButton}
                    onClick={() => setIsAudienceModalOpen(true)}
                  >
                    {selectedAudience}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <Input.TextArea
            placeholder="Hãy nói gì đó về nội dung này (không bắt buộc)"
            autoSize={{ minRows: 1, maxRows: 100 }}
            className={styles.textArea}
            value={postContent} // Gắn giá trị từ state
            onChange={(e) => setPostContent(e.target.value)} // Cập nhật state khi thay đổi
          />
          <Button
            onClick={handleShare}
            type="primary"
            block
            className={styles.shareButton}
          >
            Chia sẻ ngay
          </Button>
        </div>
        <div className={styles.shareTo}>
          <div className={styles.messengerSection}>
            <h4>Gửi bằng Messenger</h4>
            <div className={styles.messengerUsers}>
              <Avatar src="https://randomuser.me/api/portraits/men/32.jpg" />
              <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" />
              <Avatar src="https://randomuser.me/api/portraits/men/47.jpg" />
              <Avatar src="https://randomuser.me/api/portraits/women/30.jpg" />
              <Button
                className={styles.moreButton}
                onClick={() => setView("sendTo")}
              >
                ...
              </Button>
            </div>
          </div>
          <div className={styles.shareOptions}>
            <h4>Chia sẻ lên</h4>
            <div className={styles.options}>
              {[
                "Messenger",
                "WhatsApp",
                "Tin",
                "Liên kết",
                "Nhóm",
                "Bạn bè",
              ].map((option, idx) => (
                <Tooltip key={idx} title={option}>
                  <div
                    className={styles.option}
                    onClick={option === "Liên kết" ? handleCopyLink : undefined} // Thêm sự kiện nhấn cho "Liên kết"
                  >
                    <div className={styles.iconWrapper}>
                      {option === "Messenger" && <FaFacebookMessenger />}
                      {option === "WhatsApp" && <FaWhatsapp />}
                      {option === "Tin" && <FaRegFileAlt />}
                      {option === "Liên kết" && <FaLink />}
                      {option === "Nhóm" && <FaUsers />}
                      {option === "Bạn bè" && <FaUserFriends />}
                    </div>
                    <span>{option}</span>
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderSendToContent = () => (
    <div className={styles.sendToContainer}>
      <Button
        className={styles.backButton}
        type="text"
        onClick={() => setView("share")}
      >
        <FaArrowLeft />
      </Button>
      <h2>Gửi tới</h2>
      <Input
        placeholder="Tìm kiếm người và nhóm"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className={styles.searchInput}
        prefix={<IoSearchOutline />}
      />
      <div className={styles.userList}>
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((user) => (
            <div key={user.id} className={styles.userItem}>
              <Avatar src={user.avatar} />
              <span>{user.name}</span>
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
        autoSize={{ minRows: 1, maxRows: 100 }}
      />
      <Button
        type="primary"
        block
        onClick={() => {
          console.log("Send to:", selectedUsers);
          setView("share");
        }}
        disabled={selectedUsers.length === 0}
      >
        Gửi
      </Button>
    </div>
  );

  useEffect(() => {
      fetchMyUser();
    }, []); 

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={onCancel}
        footer={null}
        width="500px"
        title={view === "share" ? "Share" : "Send to"}
        className={styles.shareModal}
      >
        {view === "share" ? renderShareContent() : renderSendToContent()}
      </Modal>

      <AudienceModal
        isModalOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        onSelect={(value) => setSelectedAudience(value)}
        defaultAudience={selectedAudience}
      />
    </>
  );
};

export default ShareModal;
