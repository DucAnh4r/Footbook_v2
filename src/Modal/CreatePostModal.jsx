import React, { useState } from "react";
import { Modal, Input, Button, Upload, Avatar, Card, Spin, Divider } from "antd";
import { SmileOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { MdInsertEmoticon, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { HiMiniGif } from "react-icons/hi2";
import "./CreatePostModal.scss";
import AudienceModal from "./AudienceModal";
import GifModal from "./GifModal";
import { createPostService } from "../services/postService";
import { getUserIdFromLocalStorage } from "../utils/authUtils";

const themes = [
  { id: 0, name: "Default", background: "white" },
  {
    id: 1,
    name: "Rainbow",
    background: "linear-gradient(to right, #ff9a9e, #fad0c4)",
  },
  {
    id: 2,
    name: "Sunset",
    background: "linear-gradient(to right, #ff758c, #ff7eb3)",
  },
  {
    id: 3,
    name: "Ocean",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
  },
];

const CreatePostModal = ({ isModalOpen, onClose, userName, onPostCreated }) => {
  const [postContent, setPostContent] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false);
  const [selectedAudience, setSelectedAudience] = useState("Friends");
  const [gifModalVisible, setGifModalVisible] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null); // URL của GIF đã chọn
  const userId = getUserIdFromLocalStorage();
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu

  const handleOk = async () => {
    // Kiểm tra điều kiện trước khi submit
    if (!postContent.trim() && uploadedFiles.length === 0) {
      console.error("Post content or images are required!");
      return;
    }

    try {
      setLoading(true);
      const postData = {
        userId: userId,
        content: postContent,
        privacy: selectedAudience,
        theme: selectedTheme.id,
        images: uploadedFiles.map((file) => file.originFileObj), // Chuyển fileList sang dạng File
        share: "",
      };

      // Gọi API tạo bài đăng
      await createPostService(postData);

      console.log("Post created successfully!");
      onPostCreated(); // Gọi callback để cập nhật danh sách bài viết
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
      
    }
  };

  const handleCloseUpload = (event) => {
    event.stopPropagation(); // Ngăn chặn sự kiện click từ nút đóng lan tới Upload
    setShowUpload(false); // Ẩn khu vực Upload
  };

  const isPostDisabled = !postContent.trim() && uploadedFiles.length === 0;

  return (
    <Modal
      title={<div className="modal-title">Create post</div>}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={onClose}
      footer={
        <div className="modal-footer">
        <Button
          key="post"
          type="primary"
          onClick={handleOk}
          className="post-button"
          disabled={isPostDisabled || loading}
        >
          Post
        </Button>
      </div>
      }
      style={{ padding: 0 }}
      className="scrollable-modal"
    >
      <div className="modal-content">
        {loading ? (
          <div className="loading-spinner">
            <Spin tip="Posting..." size="large" />
          </div>
        ) : (
          <>
            <div className="user-info">
              <Avatar size={40} icon={<UserOutlined />} />
              <div className="user-details">
                <div className="user-name">{userName}</div>
                <Button
                  size="small"
                  className="friends-button"
                  onClick={() => setIsAudienceModalOpen(true)}
                >
                  {selectedAudience}
                </Button>
              </div>
            </div>
            <div
              className="custom-textarea-container"
              style={{
                display: "flex",
                justifyContent: "center",
                height: "290px",
                background: selectedTheme.background,
                color: selectedTheme.id === 0 ? "#000" : "#111",
              }}
            >
              <Input.TextArea
                style={{ backgroundColor: "unset" }}
                autoSize={{ minRows: 1, maxRows: 100 }}
                placeholder={`Bạn đang nghĩ gì, ${userName}?`} 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="custom-textarea"
              />
              <SmileOutlined className="emoji-icon" />

              {/* Hiển thị ảnh GIF đã chọn */}
              {selectedGif && (
                <div className="selected-gif-container">
                  <img
                    src={selectedGif}
                    alt="Selected GIF"
                    className="selected-gif"
                    onClick={() => setSelectedGif(null)} // Cho phép xóa GIF khi nhấp vào
                  />
                </div>
              )}

              {/* Chỉ hiển thị Upload hoặc Themes */}
              {showUpload && (
                <div
                  className="upload-area"
                  style={{ textAlign: "center", margin: "10px 0" }}
                >
                  <input
                    type="file"
                    accept="image/*,video/*" // Chỉ chấp nhận ảnh và video
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files); // Lấy danh sách file
                      const formattedFiles = files.map((file) => ({
                        uid: file.name + Date.now(),
                        name: file.name,
                        originFileObj: file,
                      }));
                      setUploadedFiles((prev) => [...prev, ...formattedFiles]);
                    }}
                    style={{ display: "none" }}
                    id="custom-file-input"
                  />
                  <label
                    htmlFor="custom-file-input"
                    className="custom-upload-button"
                  >
                    <div icon={<UploadOutlined />} type="text">
                      Add photos/videos
                    </div>
                    <div className="upload-hint">or drag and drop</div>
                  </label>

                  {/* Hiển thị danh sách file đã upload */}
                  <div style={{ marginTop: "10px" }}>
                    {uploadedFiles.map((file, index) => (
                      <div key={file.uid} style={{ alignContent: 'center', width: '80%', marginBottom: "5px", display: 'flex', justifyContent: 'space-between', marginLeft: 'auto', marginRight: 'auto', }}>
                        <span>{file.name}</span>
                        <Button
                          type="text"
                          danger
                          onClick={() =>
                            setUploadedFiles((prev) =>
                              prev.filter((item, idx) => idx !== index)
                            )
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Nút đóng */}
                  <Button
                    type="text"
                    onClick={handleCloseUpload}
                    className="close-upload-button"
                    style={{ marginTop: "10px" }}
                  >
                    ✕
                  </Button>
                </div>
              )}

              {!showUpload && !selectedGif && (
                <div className="themes-container">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      className={`theme-button ${selectedTheme.id === theme.id ? "active" : ""
                        }`}
                      style={{
                        background: theme.background,
                        color: selectedTheme.id === 0 ? "#000" : "#fff",
                      }}
                      onClick={() => {
                        setSelectedTheme(theme);
                        if (theme.id !== 0) {
                          setShowUpload(false); // Ẩn Upload khi chọn Theme
                        }
                      }}
                      disabled={uploadedFiles.length > 0} // Disable khi có Photo hoặc GIF
                    ></Button>
                  ))}
                </div>
              )}
            </div>

            <Card className="card-container ant-card-body" style={{ padding: 0 }}>
              <div className="add-post-options">
                <Button type="text" className="add-post-text">
                  Add to your post
                </Button>
                <div className="icon-container">
                  <Button
                    type="text"
                    icon={<MdOutlineAddPhotoAlternate />}
                    className="icon"
                    onClick={() => {
                      setShowUpload(true);
                      setSelectedTheme(themes[0]);
                    }}
                    disabled={selectedTheme.id !== 0}
                  />
                  <Button
                    type="text"
                    icon={<MdInsertEmoticon />}
                    className="icon"
                  />
                  <Button
                    type="text"
                    icon={<HiMiniGif />}
                    className="icon"
                    onClick={() => {
                      setGifModalVisible(true);
                      setSelectedTheme(themes[0]); // Reset về Default Theme khi chọn GIF
                    }}
                    disabled={selectedTheme.id !== 0 || showUpload === true}
                  />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
      <GifModal
        visible={gifModalVisible}
        onClose={() => setGifModalVisible(false)}
        onSendGif={(gifUrl) => {
          setSelectedGif(gifUrl); // Lưu URL của GIF đã chọn
          setGifModalVisible(false); // Đóng modal GIF
        }}
      />
      <AudienceModal
        isModalOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        onSelect={(value) => setSelectedAudience(value)} // Cập nhật audience
        defaultAudience={selectedAudience} // Truyền giá trị mặc định
      />
    </Modal>
  );
};

export default CreatePostModal;
