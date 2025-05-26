import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthDataFromLocalStorage } from "./authUtils";
import api from "../services/api.jsx"; // Sẽ tạo ở bước tiếp theo

export const checkAuth = () => {
  const authData = getAuthDataFromLocalStorage();
  return !!(authData && authData.user && authData.access_token); // Kiểm tra cả user và access_token
};

export const useAuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      navigate("/login");
    }
  }, [navigate]);
};

export const useLogout = () => {
  const navigate = useNavigate();

  return async () => {
    try {
      await api.post('/logout'); // Gọi API logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
    localStorage.removeItem("authData");
    navigate("/login");
  };
};