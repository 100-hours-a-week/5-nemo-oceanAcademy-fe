// #B-1: Login 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';

const Login: React.FC = () => {
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false); // SDK 로드 상태 추적
    const navigate = useNavigate();

    // Kakao SDK 로드 및 초기화
    useEffect(() => {
        const loadKakaoSDK = async () => {
            try {
                const response = await fetch('https://www.nemooceanacademy.com:5000/api/auth/kakao/app-key');
                const data = await response.json();

                // Kakao SDK가 없으면 script 태그로 로드
                if (!window.Kakao) {
                    const script = document.createElement('script');
                    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
                    script.onload = () => {
                        if (!window.Kakao.isInitialized()) {
                            window.Kakao.init(data.appKey); // Kakao SDK 초기화
                            setIsKakaoLoaded(true); // SDK 로드 상태 업데이트
                            console.log('Kakao SDK Initialized');
                        }
                    };
                    document.head.appendChild(script);
                } else if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(data.appKey); // 이미 Kakao 객체가 있다면 초기화만 수행
                    setIsKakaoLoaded(true); // SDK 로드 상태 업데이트
                    console.log('Kakao SDK Initialized');
                }
            } catch (error) {
                console.error('Error fetching Kakao App Key:', error);
            }
        };

        loadKakaoSDK();
    }, []);

    const handleKakaoLogin = () => {
        if (isKakaoLoaded && window.Kakao && window.Kakao.Auth) {
            window.Kakao.Auth.authorize({
                redirectUri: 'https://www.nemooceanacademy.com/oauth/kakao/callback',
            });
        } else {
            console.error('Kakao SDK가 초기화되지 않았습니다.');
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleAltClick = () => {
        alert('현재 해당 기능을 지원하지 않습니다. 카카오 로그인을 이용해주세요.');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <div style={{ width: '100%', height: '20px' }} />

            <button className={styles.kakaoButton} onClick={handleKakaoLogin} disabled={!isKakaoLoaded}>
                <img src="/kakao_icon.svg" alt="Kakao Icon" className={styles.icon} />
                카카오로 로그인
                <div style={{ width: '10px' }} />
            </button>

            <button className={styles.alternativeButton} onClick={handleAltClick}>
                다른 방법으로 로그인
            </button>

            <div style={{ width: '100%', height: '10px' }} />
            <p className={styles.prompt}>아직 원생이 아니신가요?</p>
            <span className={styles.link} onClick={handleSignUpClick}>
                간편 가입하기
            </span>
        </div>
    );
};

export default Login;
