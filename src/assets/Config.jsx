import HahaIcon from "./image/Reacts/haha.png";
import LikeIcon from "./image/Reacts/like.png";
import LoveIcon from "./image/Reacts/heart.png";
import WowIcon from "./image/Reacts/wow.png";
import SadIcon from "./image/Reacts/sad.png";
import AngryIcon from "./image/Reacts/angry.png";
import { AiOutlineLike } from "react-icons/ai";

const iconStyle = (size) => ({ width: `${size}px`, height: `${size}px` });


export const reactionIconCountConfig = [
    { id: "like", icon: LikeIcon, alt: "Like Icon", style: "icon-1", priority: 1 },
    { id: "haha", icon: HahaIcon, alt: "Haha Icon", style: "icon-2", priority: 3 },
    { id: "love", icon: LoveIcon, alt: "Love Icon", style: "icon-3", priority: 2 },
    { id: "sad", icon: SadIcon, alt: "Sad Icon", style: "icon-4", priority: 5 },
    { id: "angry", icon: AngryIcon, alt: "Angry Icon", style: "icon-5", priority: 4 },
  ];
  

    export const reactionConfig = {
      NONE: { text: "Thích", icon: <AiOutlineLike />, color: "#65686c" },
      LIKE: { text: "Thích", icon: <img style={iconStyle(20)} src={LikeIcon} alt="Like" />, color: "blue" },
      HAHA: { text: "Haha", icon: <img style={iconStyle(20)} src={HahaIcon} alt="Haha" />, color: "orange" },
      LOVE: { text: "Yêu thích", icon: <img style={iconStyle(20)} src={LoveIcon} alt="Love" />, color: "red" },
      WOW: { text: "Wow", icon: <img style={iconStyle(20)} src={WowIcon} alt="Wow" />, color: "orange" },
      SAD: { text: "Buồn", icon: <img style={iconStyle(20)} src={SadIcon} alt="Sad" />, color: "orange" },
      ANGRY: { text: "Phẫn nộ", icon: <img style={iconStyle(18)} src={AngryIcon} alt="Angry" />, color: "#e9710f" },
    };
    