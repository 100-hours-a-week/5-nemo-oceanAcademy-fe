import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false); // SDK 로드 상태 추적
    const navigate = useNavigate();

    // Kakao SDK 로드 및 초기화
    useEffect(() => {
        const loadKakaoSDK = async () => {
            try {
                const response = await fetch('https://www.nemooceanacademy.com:5000/api/auth/kakao/app-key');
                const data = await response.json();

                if (!window.Kakao?.isInitialized()) {
                    window.Kakao.init(data.appKey); // Kakao SDK 초기화
                    console.log('Kakao SDK Initialized');
                }

                setIsKakaoLoaded(true); // SDK 로드 완료 상태로 업데이트
            } catch (error) {
                console.error('Error fetching Kakao App Key:', error);
            }
        };

        loadKakaoSDK();
    }, []);

    const handleKakaoLogin = () => {
        if (isKakaoLoaded) {
            window.Kakao.Auth.authorize({
                redirectUri: 'https://www.nemooceanacademy.com/oauth/kakao/callback',
            });
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <div style={{ width: '100%', height: '20px' }} />

            <button className={styles.kakaoButton} onClick={handleKakaoLogin} disabled={!isKakaoLoaded}>
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
