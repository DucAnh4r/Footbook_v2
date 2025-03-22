import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import styles from "./AllFriends.module.scss";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import FriendItem from "../../Components/FriendItem";
import { userListFriendService } from "../../../../services/userService";
import { getUserIdFromLocalStorage } from "../../../../utils/authUtils";

const AllFriends = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]); // Lưu danh sách bạn bè
  const [filteredUsers, setFilteredUsers] = useState([]); // Lưu danh sách bạn bè đã lọc
  const [selectedUserId, setSelectedUserId] = useState(null); // Người dùng được chọn
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [searchQuery, setSearchQuery] = useState(""); // Lưu giá trị tìm kiếm
  const navigate = useNavigate();

  const user_id = getUserIdFromLocalStorage();

  const handleBack = () => {
    navigate("/friends");
  };

  const handleSelectUser = (senderId) => {
    setSelectedUserId(senderId);
    if (onSelectUser) {
      onSelectUser(senderId);
    }
  };

  useEffect(() => {
    const fetchListFriend = async () => {
      try {
        const response = await userListFriendService(user_id);
        if (response.data.success) {
          setUsers(
            Array.isArray(response.data.data.friends)
              ? response.data.data.friends
              : []
          );
          setFilteredUsers(
            Array.isArray(response.data.data.friends)
              ? response.data.data.friends
              : []
          );
        } else {
          console.error(response.data.message);
          setUsers([]);
          setFilteredUsers([]);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        setUsers([]);
        setFilteredUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListFriend();
  }, [user_id]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users); // Nếu không có giá trị tìm kiếm, hiển thị toàn bộ bạn bè
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user && // Đảm bảo `user` không phải là null hoặc undefined
            user?.fullName && // Đảm bảo `allName` tồn tại
            user?.fullName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, users]);
  

  return (
    <>
      <Row className={styles.headerRow}>
        <Col>
          <div className={styles.backButton}>
            <div className={styles.backIcon} onClick={handleBack}>
              <IoMdArrowRoundBack style={{ width: "30px", height: "30px" }} />
            </div>
          </div>
        </Col>
        <Col className={styles.titleCol}>
          <span className={styles.subTitle}>Bạn bè</span>
          <span className={styles.title}>Tất cả bạn bè</span>
          <div style={style.searchBoxContainer}>
            <span style={style.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm Bạn bè"
              style={style.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Cập nhật `searchQuery`
            />
          </div>
        </Col>
      </Row>
      <Row style={{ padding: "0 16px" }} className={styles.statsRow}>
        <span>{filteredUsers.length} người bạn</span>
      </Row>

      <Row style={{ marginTop: "16px" }}>
        {loading ? (
          <span>Đang tải...</span>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <FriendItem
              key={user.id}
              userId={user.id}
              user={user}
              onSelectUser={handleSelectUser}
              isSelected={user.id === selectedUserId}
            />
          ))
        ) : (
          <span style={{ marginLeft: "10px" }}>Không có kết quả phù hợp</span>
        )}
      </Row>
    </>
  );
};

const style = {
  searchBoxContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: "20px",
    padding: "5px 10px",
    width: "286px",
    marginTop: "10px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  searchIcon: {
    marginRight: "8px",
    color: "#888",
  },
  searchInput: {
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    width: "100%",
  },
};

export default AllFriends;
