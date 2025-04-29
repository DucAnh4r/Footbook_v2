// src/utils/cloudinaryConfig.js

// Config chung cho Cloudinary
export const CLOUDINARY_CLOUD_NAME = "dzkzebsn7";      // 👈 Cloud name chung

export const POST_UPLOAD_PRESET = "kbavfpzy";          // Preset cho upload bài post
export const MESSAGE_UPLOAD_PRESET = "ruord3hp";       // Preset cho upload ảnh tin nhắn

// Hàm upload chung
const uploadImageToCloudinary = async (image, uploadPreset, onProgress) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    try {
        const xhr = new XMLHttpRequest();

        const promise = new Promise((resolve, reject) => {
            xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
            xhr.upload.addEventListener("progress", (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = Math.round((event.loaded * 100) / event.total);
                    onProgress(progress); // 👈 Callback progress (0–100)
                }
            });

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.secure_url); // ✅ Trả URL ảnh upload thành công
                } else {
                    reject("Cloudinary upload failed");
                }
            };

            xhr.onerror = () => reject("Cloudinary network error");
            xhr.send(formData);
        });

        return await promise;
    } catch (error) {
        console.error("Upload error:", error);
        return null;
    }
};

// 👉 Hàm upload ảnh bài post
export const uploadToCloudinary = async (image, onProgress) => {
    return uploadImageToCloudinary(image, POST_UPLOAD_PRESET, onProgress);
};

// 👉 Hàm upload ảnh tin nhắn
export const uploadMessagesImgToCloudinary = async (image, onProgress) => {
    return uploadImageToCloudinary(image, MESSAGE_UPLOAD_PRESET, onProgress);
};
