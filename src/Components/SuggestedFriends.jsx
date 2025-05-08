import React from "react";
import Slider from "react-slick";
import styles from "./SuggestedFriends.module.scss";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "./SlickOverrides.scss";
import { IoMdAdd } from "react-icons/io";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md"; 
import { useLocation } from "react-router-dom"; 

const friends = [
  { id: 1, name: "Phương Ly", mutualFriends: 3, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
  { id: 2, name: "NG M Hoang", mutualFriends: 3, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
  { id: 3, name: "Ngọc Trâm", mutualFriends: 1, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
  { id: 4, name: "Lã Xuân Linh", mutualFriends: 1, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
  { id: 5, name: "Long Vũ Hoàng", mutualFriends: 16, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
  { id: 6, name: "Ngọc Nhi", mutualFriends: 0, image: "https://cdn.tuoitre.vn/zoom/700_700/2019/5/8/avatar-publicitystill-h2019-1557284559744252594756-crop-15572850428231644565436.jpg" },
];

const SuggestedFriends = () => {

  const location = useLocation(); // Lấy location hiện tại

  // Kiểm tra xem trang hiện tại có phải là '/home' không
  const slidesToShow = location.pathname === '/' ? 4 : 6;

  const settings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToShow,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />, // Custom next arrow
    prevArrow: <PrevArrow />, // Custom prev arrow
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className={styles.suggestedFriends}>
      <h2>Những người bạn có thể biết</h2>
      <Slider {...settings}>
        {friends.map(friend => (
          <div key={friend.id} className={styles.friendCard}>
            <div className={styles.friendImage}>
              <img src={friend.image} alt={friend.name} />
              <button className={styles.closeButton}>✕</button>
            </div>
            <div className={styles.friendInfo}>
              <h3>{friend.name}</h3>
              <p>{friend.mutualFriends} bạn chung</p>
              <button className={styles['addFriendButton']}>
                  <IoMdAdd />
                  Thêm bạn bè
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

// Component nút mũi tên kế tiếp
const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.nextArrow}`} onClick={onClick}>
      <MdNavigateNext style={{ fontSize: '30px', color: '#333' }} /> {/* Icon kế tiếp */}
    </div>
  );
};

// Component nút mũi tên trước
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${styles.prevArrow}`} onClick={onClick}>
      <MdNavigateBefore style={{ fontSize: '30px', color: '#333' }} /> {/* Icon quay lại */}
    </div>
  );
};

export default SuggestedFriends;
