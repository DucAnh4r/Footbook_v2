import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const checkAuth = () => {
  const user = localStorage.getItem("user");
  return !!user; // Trả về true nếu có user, false nếu không
};

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login"); // Chuyển hướng nếu chưa đăng nhập
    }
  }, [navigate]);
};

export const useLogout = () => {
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("user");
    navigate("/login"); // Chuyển hướng sau khi đăng xuất
  };
};
