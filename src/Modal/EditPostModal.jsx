import React, { useState } from "react";
import { Modal, Input, Select, Button, Card, Spin } from "antd";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { updatePostService } from "../services/postService";
import { toastError, toastSuccess } from "../utils/toastNotifier";
import styles from "../Components/Post.module.scss";

const { TextArea } = Input;
const { Option } = Select;

const EditPostModal = ({
  isModalOpen,
  onCancel,
  postId,
  userId,
  initialContent,
  initialPrivacy,
  initialImages,
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [privacy, setPrivacy] = useState(initialPrivacy || "public");
  const [images, setImages] = useState(
    initialImages.map((img, index) => ({
      uid: `existing-${index}`,
      name: `image-${index}`,
      url: img.image_url,
      status: "done",
    })) || []
  );
  const [newFiles, setNewFiles] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const formatted = files.map((file) => ({
      uid: file.name + Date.now(),
      name: file.name,
      originFileObj: file,
      status: "done",
    }));
    setNewFiles((prev) => [...prev, ...formatted]);
  };

  const removeFile = (uid) => {
    setImages((prev) => prev.filter((img) => img.uid !== uid));
    setNewFiles((prev) => prev.filter((file) => file.uid !== uid));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        userId,
        content,
        privacy,
        images: [
          ...images.map((img) => img.url), // Existing image URLs
          ...newFiles.map((file) => file.originFileObj), // New files to upload
        ],
      };

      const response = await updatePostService(payload, postId, (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      });

      if (response?.status === 200) {
        toastSuccess("Cập nhật bài viết thành công!");
        onCancel();
      } else {
        toastError("Không thể cập nhật bài viết. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      toastError("Đã xảy ra lỗi khi cập nhật bài viết.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa bài viết"
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
      confirmLoading={loading}
      okButtonProps={{ disabled: loading || !content.trim() }}
      cancelButtonProps={{ disabled: loading }}
      closable={!loading}
      maskClosable={!loading}
    >
      <div className={styles.editPostModal}>
        {loading ? (
          <div className="loading-spinner">
            <Spin tip="Updating..." size="large" />
          </div>
        ) : (
          <>
            <TextArea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì?"
              disabled={loading}
            />
            <Select
              value={privacy}
              onChange={(value) => setPrivacy(value)}
              style={{ width: "100%", margin: "10px 0" }}
              disabled={loading}
            >
              <Option value="public">Công khai</Option>
              <Option value="friends">Bạn bè</Option>
              <Option value="private">Chỉ mình tôi</Option>
            </Select>

            <Card className="card-container" style={{ padding: 0 }}>
              <div className="add-post-options">
                <Button type="text" className="add-post-text">
                  Add to your post
                </Button>
                <div className="icon-container">
                  <Button
                    type="text"
                    icon={<MdOutlineAddPhotoAlternate />}
                    classaskar="icon"
                    onClick={() => setShowUpload(true)}
                    disabled={loading}
                  />
                </div>
              </div>
            </Card>

            {showUpload && (
              <div className="upload-area">
                <input
                  type="file"
                  id="upload-input"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <label htmlFor="upload-input" className="custom-upload-button">
                  <div>Add photos</div>
                  <div className="upload-hint">or drag and drop</div>
                </label>
                <Button
                  type="text"
                  className="close-upload-button"
                  onClick={() => setShowUpload(false)}
                  disabled={loading}
                >
                  ✕
                </Button>
              </div>
            )}

            {(images.length > 0 || newFiles.length > 0) && (
              <div className="uploaded-files" style={{ marginTop: 10 }}>
                {[...images, ...newFiles].map((file) => (
                  <div className="uploaded-file" key={file.uid}>
                    <img
                      src={file.url || URL.createObjectURL(file.originFileObj)}
                      alt={file.name}
                      style={{ width: 100, height: 100, objectFit: "cover", marginRight: 10 }}
                    />
                    <span>{file.name}</span>
                    <Button
                      type="text"
                      danger
                      onClick={() => removeFile(file.uid)}
                      disabled={loading}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default EditPostModal;