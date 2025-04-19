// src/utils/cloudinaryConfig.js
export const CLOUDINARY_UPLOAD_PRESET = "kbavfpzy";   // 🔧 Thay giá trị thật
export const CLOUDINARY_CLOUD_NAME = "dzkzebsn7";         // 🔧 Thay giá trị thật

export const uploadToCloudinary = async (image, onProgress) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

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
                    resolve(response.secure_url);
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
