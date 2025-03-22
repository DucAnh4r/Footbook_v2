
let mediaRecorder;
let audioChunks = [];

/**
 * Yêu cầu quyền microphone
 */
export const getMicrophoneAccess = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    } catch (err) {
        console.error("Microphone access denied:", err);
        throw err;
    }
};

/**
 * Bắt đầu ghi âm
 */
export const startRecording = async () => {
    const stream = await getMicrophoneAccess();
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.start();
    console.log("Recording started...");
};

/**
 * Kết thúc ghi âm và trả về URL và Blob
 */
export const stopRecording = () => {
    return new Promise((resolve, reject) => {
        if (!mediaRecorder) {
            return reject("MediaRecorder is not initialized.");
        }

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);

            // Reset
            audioChunks = [];
            mediaRecorder = null;

            console.log("Recording stopped...");
            resolve({ audioUrl, audioBlob });
        };

        mediaRecorder.stop();
    });
};

/**
 * Phát lại âm thanh
 */
export const playAudio = (audioUrl) => {
    if (!audioUrl) {
        console.error("Audio URL is required to play audio.");
        return;
    }

    const audio = new Audio(audioUrl);
    audio.play()
        .then(() => console.log("Audio is playing..."))
        .catch((err) => console.error("Error playing audio:", err));
};

/**
 * Tải file âm thanh
 */
export const downloadAudio = (audioBlob) => {
    if (!audioBlob) {
        console.error("Audio Blob is required to download.");
        return;
    }

    const downloadUrl = URL.createObjectURL(audioBlob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "recording.webm";
    link.click();
};
