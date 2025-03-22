import React, { useEffect, useState } from "react";
import { Modal, Button, Typography, Input, Image, Switch, Spin } from "antd";
import {
  UploadOutlined,
  CheckCircleFilled,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styles from "./EditFeaturedModal.module.scss";
import {
  createHighlightStoryService,
  deleteHighlightStoryImageService,
  deleteHighlightStoryService,
  getAllHighlightStoryService,
  getDetailHighlightStoryImageService,
} from "../services/highlightStoryService";
import { getUserIdFromLocalStorage } from "../utils/authUtils";

const { Title, Text } = Typography;

const EditFeaturedModal = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1); // Quản lý bước
  const [fileList, setFileList] = useState([]); // Lưu trữ danh sách ảnh
  const [selectedCoverIndex, setSelectedCoverIndex] = useState(0); // Ảnh làm Cover
  const [temporaryCoverIndex, setTemporaryCoverIndex] = useState(0); // Ảnh cover tạm thời cho step 4
  const [title, setTitle] = useState("Collection"); // State lưu Title
  const [selectedFiles, setSelectedFiles] = useState([]); // Đánh dấu ảnh được chọn
  const [highLightStory, setHighLightStory] = useState([]);
  const [highLightStoryDetail, setHighLightStoryDetail] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const user_id = getUserIdFromLocalStorage();
  const [loading, setLoading] = useState(false);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    setFileList([]);
  };

  const handlePrevStepInStep3 = () => {
    setStep((prev) => prev - 1);
  };

  const handleStep3 = () => {
    setStep(3);
  };

  const resetState = () => {
    setStep(1);
    setFileList([]);
    setSelectedFiles([]);
    setTitle("Collection");
    setHighLightStory([]);
    setHighLightStoryDetail([]);
    setSelectedCoverIndex(0);
    setTemporaryCoverIndex(0);
    setIsEditMode(false);
  };

  // Khi ở step 4, chọn ảnh làm cover tạm thời
  const handleSetTemporaryCover = (index) => {
    setTemporaryCoverIndex(index);
  };

  // Save ảnh cover khi chọn "Save" ở step 4
  const handleSaveCover = () => {
    setSelectedCoverIndex(temporaryCoverIndex); // Cập nhật cover chính thức
    setStep(3); // Quay về step 3
  };

  // Cancel ở step 4, quay về step 3 mà không cập nhật ảnh cover
  const handleCancelCover = () => {
    setTemporaryCoverIndex(selectedCoverIndex); // Reset về ảnh cover hiện tại
    setStep(3);
  };

  useEffect(() => {
    setTemporaryCoverIndex(selectedCoverIndex); // Đồng bộ cover tạm thời với cover hiện tại khi vào step 4
  }, [selectedCoverIndex]);

  const handleCancel = () => {
    resetState(); // Reset trạng thái
    onClose(); // Gọi hàm đóng modal từ props
  };

  const handleDeleteHls = async (hls_id) => {
    try {
      setLoading(true); // Bắt đầu loading
      await deleteHighlightStoryService(hls_id);
      console.log("Highlight Story deleted successfully!");
      resetState(); // Reset trạng thái
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to delete Highlight Story:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFileList((prevList) => [...prevList, ...files]);
  };

  const handleOk = async () => {
    try {
      setLoading(true); // Bắt đầu loading
      const formData = {
        userId: user_id.toString(), // Đảm bảo là chuỗi
        storyName: title,
        images: fileList, // Mảng các file
      };

      // Gọi API tạo Highlight Story
      await createHighlightStoryService(formData);

      console.log("Highlight Story created successfully!");
      resetState(); // Reset trạng thái
      onClose(); // Đóng modal
    } catch (error) {
      console.error("Failed to create Highlight Story:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const toggleSelectImage = (index) => {
    setSelectedFiles(
      (prevSelected) =>
        prevSelected.includes(index)
          ? prevSelected.filter((i) => i !== index) // Bỏ chọn
          : [...prevSelected, index] // Chọn ảnh
    );
  };

  const handleEdit = (Hls_id) => {
    setIsEditMode(true);
    handleStep3();
    fetchHighLightStoryImage(Hls_id);
  };

  const fetchHighLightStoryImage = async (Hls_id) => {
    try {
      setLoading(true); // Bắt đầu loading
      const response = await getDetailHighlightStoryImageService(Hls_id);
      setHighLightStoryDetail(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Fetch highlight stories
      (async () => {
        try {
          setLoading(true); // Bắt đầu loading
          const response = await getAllHighlightStoryService(user_id);
          setHighLightStory(response?.data?.data || []);
        } catch (error) {
          console.error("Error fetching stories:", error);
        } finally {
          setLoading(false); // Kết thúc loading
        }
      })();
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      resetState();
    }
  }, [isVisible]);

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          {step === 1
            ? "Edit Featured"
            : step === 2
            ? "Edit Featured Collection"
            : "Edit Featured Collection"}
        </Title>
      }
      visible={isVisible}
      onCancel={handleCancel}
      footer={
        step === 3 ? (
          <div style={{ textAlign: "right" }}>
            <Button onClick={handlePrevStep}>Cancel</Button>
            <Button type="primary" onClick={handleOk}>
              Save
            </Button>
            <div style={{ marginTop: "20px" }}>
              <Text>Featured is set to public</Text>
            </div>
          </div>
        ) : step === 2 ? (
          <div style={{ textAlign: "right" }}>
            <Button onClick={handlePrevStep}>Back</Button>
            <Button
              type="primary"
              onClick={handleNextStep}
              disabled={fileList.length === 0}
            >
              Next
            </Button>
          </div>
        ) : step === 4 ? (
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleCancelCover}>Cancel</Button>
            <Button type="primary" onClick={handleSaveCover}>
              Save
            </Button>
          </div>
        ) : null
      }
      width={600}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          {step === 1 && (
            /* Nội dung bước 1 */
            <div>
              <div className={styles.featuredItem}>
                {highLightStory
                  .filter((story) => story.isDeleted === false) // Lọc những story chưa bị xóa
                  .map((story, index) => (
                    <div
                      key={story.story_id || index}
                      className={styles.collectionCard}
                      onClick={() => handleEdit(story.story_id)}
                    >
                      <p className={styles.collectionTitle}>
                        {story.story_name}
                      </p>
                      <p className={styles.collectionItems}>
                        {story.highlightStoryImageResponse?.length || 0} item
                      </p>
                      <p className={styles.collectionTime}>
                        Updated at {new Date(story.create_at).toLocaleString()}
                      </p>
                      <Button
                        type="link"
                        icon={<span className="icon-edit">✏️</span>}
                        className={styles.editIcon}
                      />
                    </div>
                  ))}
              </div>
              <div
                className={styles.addNewSection}
                style={{ textAlign: "center", marginTop: "20px" }}
              >
                <Button
                  type="link"
                  className={styles.addButton}
                  onClick={handleNextStep}
                >
                  Add New
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            /* Nội dung bước 2 */
            <>
              <div
                className={styles.uploadSection}
                style={{ textAlign: "center", margin: "20px 0" }}
              >
                {/* Input Upload */}
                <label htmlFor="upload-input" className={styles.uploadLabel}>
                  Upload Photos
                  <div className={styles.uploadButton}>
                    <input
                      id="upload-input"
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              </div>

              {/* Hiển thị danh sách ảnh đã chọn */}
              <div className={styles.imagePreviewContainer}>
                {fileList.map((file, index) => (
                  <div
                    key={index}
                    className={`${styles.imageWrapper} ${
                      selectedFiles.includes(index) ? styles.selectedImage : ""
                    }`}
                    onClick={() => toggleSelectImage(index)} // Đánh dấu ảnh
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Selected ${index}`}
                      width={150}
                      height={150}
                      style={{ objectFit: "cover", borderRadius: "8px" }}
                      preview={false}
                    />
                    {/* Biểu tượng đánh dấu */}
                    <div className={styles.checkIcon}>
                      {selectedFiles.includes(index) ? (
                        <CheckCircleFilled
                          style={{ color: "green", fontSize: "24px" }}
                        />
                      ) : (
                        <CheckCircleOutlined
                          style={{ color: "gray", fontSize: "24px" }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: "center" }}>
              <Title level={5}>Cover</Title>
              {/* Chế độ Edit */}
              {isEditMode ? (
                <>
                  {highLightStoryDetail?.highlightStoryImageResponse?.length >
                    0 && (
                    <Image
                      src={
                        highLightStoryDetail?.highlightStoryImageResponse[
                          selectedCoverIndex
                        ]?.imageUrl
                      }
                      alt="Cover"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", marginBottom: "10px" }}
                      preview={false}
                      onClick={() => setStep(4)}
                    />
                  )}

                  <div>
                    <Text>Title</Text>
                    <Input
                      value={highLightStoryDetail?.story_name}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                      style={{ margin: "10px 0", width: "60%" }}
                    />
                  </div>

                  {/* Hiển thị danh sách ảnh */}
                  <div className={styles.imagePreviewContainer}>
                    <div
                      className={styles.addMoreBox}
                      onClick={handlePrevStepInStep3}
                    >
                      Add More
                    </div>
                    {highLightStoryDetail?.highlightStoryImageResponse?.map(
                      (file, index) => (
                        <div
                          key={file.id || index}
                          className={`${styles.imageWrapper} ${
                            selectedFiles.includes(index)
                              ? styles.selectedImage
                              : ""
                          }`}
                          onClick={() => toggleSelectImage(index)}
                        >
                          <Image
                            src={file.imageUrl}
                            alt={`Selected ${index}`}
                            width={150}
                            height={150}
                            style={{ objectFit: "cover", borderRadius: "8px" }}
                            preview={false}
                          />
                          <div className={styles.checkIcon}>
                            {selectedFiles.includes(index) ? (
                              <CheckCircleFilled
                                style={{ color: "green", fontSize: "24px" }}
                              />
                            ) : (
                              <CheckCircleOutlined
                                style={{ color: "gray", fontSize: "24px" }}
                              />
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <Button
                    type="primary"
                    onClick={() =>
                      handleDeleteHls(highLightStoryDetail.story_id)
                    }
                  >
                    Delete Featured Collection
                  </Button>
                </>
              ) : (
                <>
                  {fileList.length > 0 && (
                    <Image
                      src={URL.createObjectURL(fileList[selectedCoverIndex])}
                      alt="Cover"
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", marginBottom: "10px" }}
                      preview={false}
                      onClick={() => setStep(4)}
                    />
                  )}

                  <div>
                    <Text>Title</Text>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                      style={{ margin: "10px 0", width: "60%" }}
                    />
                  </div>

                  {/* Hiển thị danh sách ảnh */}
                  <div className={styles.imagePreviewContainer}>
                    <div
                      className={styles.addMoreBox}
                      onClick={handlePrevStepInStep3}
                    >
                      Add More
                    </div>
                    {fileList.map((file, index) => (
                      <div
                        key={index}
                        className={`${styles.imageWrapper} ${
                          selectedFiles.includes(index)
                            ? styles.selectedImage
                            : ""
                        }`}
                        onClick={() => toggleSelectImage(index)}
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`Selected ${index}`}
                          width={150}
                          height={150}
                          style={{ objectFit: "cover", borderRadius: "8px" }}
                          preview={false}
                        />
                        <div className={styles.checkIcon}>
                          {selectedFiles.includes(index) ? (
                            <CheckCircleFilled
                              style={{ color: "green", fontSize: "24px" }}
                            />
                          ) : (
                            <CheckCircleOutlined
                              style={{ color: "gray", fontSize: "24px" }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {step === 4 && (
            <div className={styles.imagePreviewContainer}>
              {fileList.map((file, index) => (
                <div
                  key={index}
                  className={styles.imageWrapper}
                  onClick={() => handleSetTemporaryCover(index)}
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index}`}
                    width={150}
                    height={150}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                    preview={false}
                  />
                  <div className={styles.checkIcon}>
                    {index === temporaryCoverIndex ? (
                      <CheckCircleFilled
                        style={{ color: "green", fontSize: "24px" }}
                      />
                    ) : (
                      <CheckCircleOutlined
                        style={{ color: "gray", fontSize: "24px" }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
};

export default EditFeaturedModal;
