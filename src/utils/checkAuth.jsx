import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const checkAuth = () => {
    const user = localStorage.getItem('user');
    return !!user; // Trả về true nếu người dùng đã đăng nhập, false nếu chưa
};

export const useAuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!checkAuth()) {
            navigate('/login'); // Chuyển hướng về trang login nếu chưa đăng nhập
        }
    }, [navigate]);
};

export const logout = () => {
    localStorage.removeItem('user');
    useAuthCheck();
};