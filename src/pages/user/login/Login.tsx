import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const navigate = useNavigate();

    // Kakao SDK 초기화
    useEffect(() => {
        fetch('http://3.34.11.72:5000/api/auth/kakao/app-key')
            .then(response => response.json())
            .then(data => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(data.appKey); // Kakao SDK 초기화
                    console.log('Kakao SDK Initialized');
                }
            })
            .catch(error => console.error('Error fetching Kakao App Key:', error));
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: 'https://www.nemooceanacademy.com/oauth/kakao/callback',
        });
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <div style={{ width: '100%', height: '20px' }} />

            <button className={styles.kakaoButton} onClick={handleKakaoLogin}>
                <img src="/kakao_icon.svg" alt="Kakao Icon" className={styles.icon} />
                카카오로 로그인하기
                <div style={{ width: '10px' }} />
            </button>

            <button className={styles.alternativeButton}>
                다른 방법으로 로그인
            </button>

            <div style={{ width: '100%', height: '10px' }} />
            <p className={styles.signUpPrompt}>아직 원생이 아니신가요?</p>
            <span className={styles.signUpLink} onClick={handleSignUpClick}>
        간편 가입하기
      </span>
        </div>
    );
};

export default Login;
