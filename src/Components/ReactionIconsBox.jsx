import React from "react";
import Haha from "../assets/image/ReactionIcons/Haha.gif";
import Like from "../assets/image/ReactionIcons/Like.gif";
import Sad from "../assets/image/ReactionIcons/Sad.gif";
import Angry from "../assets/image/ReactionIcons/Angry.gif";
import Heart from "../assets/image/ReactionIcons/Heart.gif";
import Wow from "../assets/image/ReactionIcons/Wow.gif";
import styles from "./ReactionIconsBox.module.scss";
import { addPostReactionService } from "../services/postReactionService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUserIdFromLocalStorage } from "../utils/authUtils";

const ReactionIconsBox = ({ postId, onReactionAdded, currentReaction }) => {
  const userId = getUserIdFromLocalStorage();

  const handleReactionClick = async (reactionType) => {
    // Nếu click lại vào cùng một cảm xúc, đặt trạng thái về NONE
    const newReaction = currentReaction === reactionType ? "NONE" : reactionType;

    try {
      // Gọi callback để thông báo với parent component
      if (onReactionAdded) {
        onReactionAdded(newReaction);
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
      toast.error("Đã xảy ra lỗi khi thêm cảm xúc.");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <div className={styles.content}>
        <div className={styles.emoji}>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("LIKE")}
          >
            <img src={Like} alt="Like" />
          </div>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("LOVE")}
          >
            <img src={Heart} alt="Heart" />
          </div>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("HAHA")}
          >
            <img src={Haha} alt="Haha" />
          </div>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("WOW")}
          >
            <img src={Wow} style={{ width: "48px" }} alt="Wow" />
          </div>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("SAD")}
          >
            <img src={Sad} style={{ width: "54px" }} alt="Sad" />
          </div>
          <div
            className={styles.hello}
            onClick={() => handleReactionClick("ANGRY")}
          >
            <img src={Angry} alt="Angry" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionIconsBox;

