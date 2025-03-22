import React, { useState, useRef, useEffect } from "react";

const AudioMessage = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const audioRef = useRef(null);
  const [bars, setBars] = useState(Array.from({ length: 10 }, () => Math.random() * 15 + 5)); // Sóng ngẫu nhiên

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const minutes = Math.floor(audio.currentTime / 60);
      const seconds = Math.floor(audio.currentTime % 60)
        .toString()
        .padStart(2, "0");
      setCurrentTime(`${minutes}:${seconds}`);
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  // Sóng động (Visualizer)
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: 10 }, () => Math.random() * 15 + 5));
      }, 200); // Cập nhật thanh sóng mỗi 200ms
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <div className="audio-message">
      {/* Nút Play/Pause */}
      <button className="play-button" onClick={handlePlayPause}>
        {isPlaying ? "⏸" : "▶"}
      </button>

      {/* Sóng âm */}
      <div className="audio-visualizer">
        {bars.map((height, index) => (
          <div
            key={index}
            className="bar"
            style={{ height: `${height}px` }}
          ></div>
        ))}
      </div>

      {/* Thời gian */}
      <div className="audio-time">{currentTime}</div>
      <audio ref={audioRef} src={audioSrc}></audio>
    </div>
  );
};

export default AudioMessage;
