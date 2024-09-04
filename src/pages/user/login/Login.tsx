// #B-1: Login 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './Login.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';

const Login: React.FC = () => {
    const [isKakaoLoaded, setIsKakaoLoaded] = useState(false); // SDK 로드 상태 추적
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Kakao SDK 로드 및 초기화
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
        }

        const loadKakaoSDK = async () => {
            try {
                const response = await axios.get('https://www.nemooceanacademy.com:5000/api/auth/kakao/app-key');
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
            redirectUri: 'https://www.nemooceanacademy.com/oauth/kakao/callback',
        });
    };

    const handleLogout = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log('Kakao logout completed');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                setIsLoggedIn(false);
                navigate('/'); // 로그아웃 후 리다이렉션
            });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setIsLoggedIn(false);
            alert('로그인 상태가 아닙니다.');
        }
    };

    const handleAltClick = () => {
        alert('현재 해당 기능을 지원하지 않습니다. 카카오 로그인을 이용해주세요.');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>로그인</h1>
            <h5 className={styles.explanation}>바다서원에서 라이브로 학습하세요.</h5>
            <Empty height="10px" />
            <button className={styles.kakaoButton} onClick={handleKakaoLogin} disabled={!isKakaoLoaded}>
                <img src="/kakao_icon.svg" alt="Kakao Icon" className={styles.icon} />
                카카오로 로그인
            </button>
            <button className={styles.alternativeButton} onClick={handleAltClick}>
                다른 방법으로 로그인
            </button>
            <Empty height="30px" />
        </div>
    );
};

export default Login;
