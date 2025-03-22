import React from "react";
import styles from "./ErrorPage.module.scss";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/");
    };

    return (
        <div className={styles.errorPage}>
            <div className={styles.content}>
                <h1>404</h1>
                <p>Oops! The page you're looking for doesn't exist.</p>
                <button onClick={goHome}>Go Back Home</button>
            </div>
        </div>
    );
};

export default ErrorPage;
