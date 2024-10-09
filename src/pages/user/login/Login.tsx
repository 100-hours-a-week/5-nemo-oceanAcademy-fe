// #B-1: Login 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './Login.module.css';
import { Space } from '../../../styles/GlobalStyles';

const Login: React.FC = () => {
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false); // SDK 로드 상태 추적
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const currentUrl = window.location.hostname;

    let redirectUrl;
    if (currentUrl.includes("localhost")) {
        redirectUrl = "http://localhost:3000/oauth/kakao/callback";
    } else if (currentUrl.includes("dev.nemooceanacademy.com")) {
        redirectUrl = "https://dev.nemooceanacademy.com/oauth/kakao/callback";
    } else {
        redirectUrl = "https://www.nemooceanacademy.com/oauth/kakao/callback";
    }

    // Kakao SDK 로드 및 초기화
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }

        const loadKakaoSDK = async () => {
            try {
                const response = await axios.get(endpoints.getKakaoAppKey);
                const { appKey } = response.data;

                if (!window.Kakao?.isInitialized()) {
                    window.Kakao.init(appKey); // Kakao SDK 초기화
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
        if (!window.Kakao) {
            console.error('Kakao SDK not loaded');
            return;
        }

        if (!window.Kakao.isInitialized()) {
            console.error('Kakao SDK not initialized');
            return;
        }

        window.Kakao.Auth.authorize({
            redirectUri: redirectUrl,
        });
    };

    const handleAltClick = () => {
        alert('현재 해당 기능을 지원하지 않습니다. 카카오 로그인을 이용해주세요.');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <Space height="32px" />
            <button className={styles.kakaoButton} onClick={handleKakaoLogin} disabled={!isKakaoLoaded}>
                <img src="/kakao_icon.svg" alt="Kakao Icon" className={styles.icon} />
                카카오로 로그인
            </button>
            <Space height="12px" />
            <button className={styles.alternativeButton} onClick={handleAltClick}>
                다른 방법으로 로그인
            </button>
            <Space height="120px" />
        </div>
    );
};

export default Login;
