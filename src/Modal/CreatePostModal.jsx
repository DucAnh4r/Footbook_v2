/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import { Modal, Input, Button, Avatar, Card, Spin } from "antd";
import { SmileOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { MdInsertEmoticon, MdOutlineAddPhotoAlternate } from "react-icons/md";
import { HiMiniGif } from "react-icons/hi2";
import "./CreatePostModal.scss";
import AudienceModal from "./AudienceModal";
import GifModal from "./GifModal";
import { createPostService } from "../services/postService";
import { getUserIdFromLocalStorage } from "../utils/authUtils";

// Theme options
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
  const [selectedAudience, setSelectedAudience] = useState("friends");
  const [gifModalVisible, setGifModalVisible] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = getUserIdFromLocalStorage();

  const isPostDisabled = !postContent.trim() && uploadedFiles.length === 0;

  const handlePost = useCallback(async () => {
    if (isPostDisabled) return;

    try {
      setLoading(true);
      const postData = {
        userId,
        content: postContent,
        privacy: selectedAudience,
        theme: selectedTheme.id,
        images: uploadedFiles.map((file) => file.originFileObj),
        gif: selectedGif,
      };

      await createPostService(postData);
      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  }, [
    postContent,
    uploadedFiles,
    selectedAudience,
    selectedTheme,
    selectedGif,
  ]);

  const handleUploadChange = (e) => {
    const files = Array.from(e.target.files);
    const formatted = files.map((file) => ({
      uid: file.name + Date.now(),
      name: file.name,
      originFileObj: file,
    }));
    setUploadedFiles((prev) => [...prev, ...formatted]);
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <Modal
      style={{marginTop: "60px"}}
      title={<div className="modal-title">Create post</div>}
      open={isModalOpen}
      onCancel={onClose}
      footer={
        <div className="modal-footer">
          <Button
            type="primary"
            className="post-button"
            onClick={handlePost}
            disabled={isPostDisabled || loading}
          >
            Post
          </Button>
        </div>
      }
      className="scrollable-modal"
    >
      <div className="modal-content">
        {loading ? (
          <div className="loading-spinner">
            <Spin tip="Posting..." size="large" />
          </div>
        ) : (
          <>
            {/* User Info */}
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

            {/* Content Input Area */}
            <div
              className="custom-textarea-container"
              style={{
                background: selectedTheme.background,
                color: selectedTheme.id === 0 ? "#000" : "#fff",
                height: "290px",
              }}
            >
              <Input.TextArea
                placeholder={`Bạn đang nghĩ gì, ${userName}?`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                autoSize={{ minRows: 1, maxRows: 100 }}
                className="custom-textarea"
                style={{ backgroundColor: "transparent" }}
              />
              <SmileOutlined className="emoji-icon" />

              {selectedGif && (
                <div className="selected-gif-container">
                  <img
                    src={selectedGif}
                    alt="Selected GIF"
                    className="selected-gif"
                    onClick={() => setSelectedGif(null)}
                  />
                </div>
              )}

              {showUpload ? (
                <div className="upload-area">
                  <input
                    type="file"
                    id="upload-input"
                    multiple
                    accept="image/*,video/*"
                    style={{ display: "none" }}
                    onChange={handleUploadChange}
                  />
                  <label
                    htmlFor="upload-input"
                    className="custom-upload-button"
                  >
                    <div>Add photos/videos</div>
                    <div className="upload-hint">or drag and drop</div>
                  </label>

                  {uploadedFiles.map((file, index) => (
                    <div className="uploaded-file" key={file.uid}>
                      <span>{file.name}</span>
                      <Button
                        type="text"
                        danger
                        onClick={() => removeUploadedFile(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="text"
                    className="close-upload-button"
                    onClick={() => setShowUpload(false)}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                !selectedGif && (
                  <div className="themes-container">
                    {themes.map((theme) => (
                      <Button
                        key={theme.id}
                        className={`theme-button ${
                          selectedTheme.id === theme.id ? "active" : ""
                        }`}
                        style={{
                          background: theme.background,
                          color: selectedTheme.id === 0 ? "#000" : "#fff",
                        }}
                        onClick={() => {
                          setSelectedTheme(theme);
                          setShowUpload(false);
                        }}
                        disabled={uploadedFiles.length > 0}
                      />
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Bottom Card */}
            <Card className="card-container" style={{ padding: 0 }}>
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
                      setSelectedTheme(themes[0]);
                    }}
                    disabled={selectedTheme.id !== 0 || showUpload}
                  />
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Modals */}
      <GifModal
        visible={gifModalVisible}
        onClose={() => setGifModalVisible(false)}
        onSendGif={(gifUrl) => {
          setSelectedGif(gifUrl);
          setGifModalVisible(false);
        }}
      />

      <AudienceModal
        isModalOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        onSelect={setSelectedAudience}
        defaultAudience={selectedAudience}
      />
    </Modal>
  );
};

export default CreatePostModal;
