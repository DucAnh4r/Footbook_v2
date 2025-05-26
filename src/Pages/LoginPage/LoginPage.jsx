/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LogoImg from "../../assets/image/Header/logo.png";
import styles from './LoginPage.module.scss';
import { userLoginService, userRegisterService } from '../../services/userService';
import { HeaderContext } from '../../Context/HeaderContext';
import { useAuthCheck, checkAuth } from '../../utils/checkAuth';

const LoginPage = () => {
    const { setShowHeader } = useContext(HeaderContext);
    const navigate = useNavigate();

    useEffect(() => {
        setShowHeader(false);
        // Nếu đã đăng nhập, chuyển hướng về trang chủ
        if (checkAuth()) {
            navigate('/');
        }
        return () => setShowHeader(true);
    }, [setShowHeader, navigate]);

    const [isSignUp, setIsSignUp] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        gender: 'MALE',
        date_of_birth: '2001-01-01', // Định dạng chuẩn cho input type date
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const toggleSignUp = () => {
        setAnimate(true);
        setTimeout(() => {
            setIsSignUp(!isSignUp);
            setAnimate(false);
        }, 300);
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isSignUp) {
                // Đăng ký
                if (formData.password !== formData.confirmPassword) {
                    toast.error('Mật khẩu xác nhận không khớp!');
                    return;
                }

                const response = await userRegisterService({
                    fullName: formData.fullName,
                    gender: formData.gender,
                    date_of_birth: formData.date_of_birth,
                    password: formData.password,
                    email: formData.email,
                    username: formData.username
                });

                toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
                setTimeout(() => {
                    toggleSignUp();
                }, 2000);
            } else {
                // Đăng nhập
                const response = await userLoginService({
                    email: formData.email, // Backend yêu cầu email
                    password: formData.password
                });

                // Lưu thông tin user và access_token vào localStorage
                localStorage.setItem('authData', JSON.stringify({
                    user: response.data.user,
                    access_token: response.data.access_token
                }));

                toast.success('Đăng nhập thành công!');
                setTimeout(() => {
                    navigate('/'); // Chuyển hướng về trang chủ
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại.';
            toast.error(errorMessage);
        }
    };

    return (
        <div className={styles.container}>
            <ToastContainer />
            <div className={styles.leftContent}>
                <img
                    src={LogoImg}
                    className={styles["logo-img"]}
                />
                <h1 className={styles.leftTitle}>
                    {isSignUp
                        ? 'Tạo tài khoản và kết nối tới bạn bè của bạn'
                        : 'Chào mừng bạn đến với Footbook'}
                </h1>
                <p className={styles.leftSubtitle}>
                    {isSignUp
                        ? 'Nơi kết bạn, chia sẻ bài đăng, tham gia nhóm, và tạo trang để giao tiếp với bạn bè hoặc công chúng.'
                        : 'Nơi kết bạn, chia sẻ bài đăng, tham gia nhóm, và tạo trang để giao tiếp với bạn bè hoặc công chúng.'}
                </p>
            </div>
            <div className={styles.rightContent}>
                <div
                    className={`${styles.card} ${animate ? styles.animate : ''}`}
                >
                    <h2 className={styles.title}>
                        {isSignUp ? 'Đăng ký 🚀' : 'Đăng nhập 👋'}
                    </h2>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {isSignUp && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="fullName">Họ và tên:</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Nhập tên của bạn"
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="username">Tên người dùng:</label>
                                    <input
                                        type="text"
                                        id="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Nhập tên người dùng"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Mật khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
                            />
                        </div>
                        {isSignUp && (
                            <>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="date_of_birth">Ngày sinh:</label>
                                    <input
                                        type="date"
                                        id="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="gender">Giới tính:</label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                    >
                                        <option value="MALE">Nam</option>
                                        <option value="FEMALE">Nữ</option>
                                        <option value="OTHER">Khác</option>
                                    </select>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <button type="submit" className={styles.signInButton}>
                            {isSignUp ? 'Đăng ký' : 'Đăng nhập'}
                        </button>
                    </form>
                    <div className={styles.toggle}>
                        {isSignUp ? (
                            <>
                                Đã có tài khoản?{' '}
                                <a href="#" onClick={toggleSignUp}>
                                    Đăng nhập
                                </a>
                            </>
                        ) : (
                            <>
                                Chưa có tài khoản?{' '}
                                <a href="#" onClick={toggleSignUp}>
                                    Đăng ký
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;