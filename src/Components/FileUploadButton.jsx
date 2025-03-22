import React, { useRef } from "react";
import { Tooltip, Button } from "antd";
import { FaRegFileImage } from "react-icons/fa6";
import "./FileUploadButton.scss"

const FileUploadButton = ({ onFileChange }) => {
    const fileInputRef = useRef(null);

    // Kích hoạt hộp thoại chọn file
    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Xử lý khi chọn file
    const handleFileChange = (e) => {
        const fileInput = e.target;
        const selectedFile = fileInput.files[0];

        if (selectedFile) {
            // Kiểm tra loại file
            const isImage = selectedFile.type.startsWith("image/");
            const isVideo = selectedFile.type.startsWith("video/");
            const fileUrl = URL.createObjectURL(selectedFile);
            const fileSize = (selectedFile.size / 1024).toFixed(2); // Định dạng kích thước file (KB)

            // Tạo tin nhắn chứa thông tin file
            const fileMessage = {
                content: isImage
                    ? `<img src="${fileUrl}" alt="${selectedFile.name}" style="max-width: 200px; max-height: 200px;" />`
                    : isVideo
                        ? `<video src="${fileUrl}" controls style="max-width: 200px; max-height: 200px;"></video>`
                        : `<a href="blob:fileUrl" download="fileName" class="file-message">
                            <div class="file-header">
                                <!-- Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v-8m0 8l-4-4m4 4l4-4m-4 8V3m-4 16h8a2 2 0 002-2v-1a2 2 0 00-2-2H8a2 2 0 00-2 2v1a2 2 0 002 2z" />
                                </svg>

                                <!-- File Info -->
                                <div class="file-info">
                                    <span class="file-name">${selectedFile.name}</span>
                                    <span class="file-size">${fileSize} KB</span>
                                </div>
                            </div>
                        </a>`,
                sender: "You",
            };

            // Gọi callback gửi file ra ngoài
            onFileChange(fileMessage);

            // Reset giá trị input để có thể chọn lại file
            fileInput.value = "";
        }
    };

    return (
        <Tooltip title="Gửi file">
            <div>
                {/* Nút bấm */}
                <Button
                    type="text"
                    icon={<FaRegFileImage />}
                    style={{ color: "#000", fontSize: "20px", width: "36px" }}
                    onClick={handleButtonClick} // Kích hoạt chọn file
                />
                {/* Input file được ẩn */}
                <input
                    ref={fileInputRef}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        </Tooltip>
    );
};

export default FileUploadButton;
