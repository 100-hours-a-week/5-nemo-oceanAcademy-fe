import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true); // LocalStorage에 토큰이 있으면 로그인 상태로 설정
        }

        // Kakao SDK 초기화
        fetch('http://localhost:8080/api/auth/kakao/app-key')
            .then(response => response.json())
            .then(data => {
                if (!window.Kakao.isInitialized()) {
                    window.Kakao.init(data.appKey); // Kakao SDK 초기화
                    console.log('Kakao SDK Initialized');
                }
            })
            .catch(error => console.error('Error fetching Kakao App Key:', error));
    }, []);

    const handleLogin = () => {
        window.Kakao.Auth.authorize({
            redirectUri: 'http://localhost:3000/oauth/kakao/callback',
        });
    };

    const handleSignupCheck = (token) => {
        fetch('http://localhost:8080/api/auth/signup', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // 수정된 Bearer 토큰 설정
            }
        })
            .then(response => {
                if (response.status === 204) {
                    // 회원가입이 필요하면 회원가입 요청을 보냄
                    handleSignup(token);
                } else if (response.status === 200) {
                    console.log('User already exists, no need to sign up.');
                } else {
                    console.error('Unexpected response:', response.status);
                }
            })
            .catch(error => console.error('Error during signup check:', error));
    };

    const handleSignup = (token) => {
        const nickname = prompt('Enter your nickname for sign-up:'); // 닉네임을 입력받음
        if (nickname) {
            const formData = new FormData();
            formData.append('nickname', nickname);

            fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // 수정된 Bearer 토큰 설정
                },
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error during sign-up: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('User signed up successfully:', data);
                    alert('회원가입이 완료되었습니다.');
                    navigate('/');
                })
                .catch(error => console.error('Error during sign-up:', error));
        }
    };

    const handleLogout = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log('Kakao logout completed');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                setIsLoggedIn(false); // 로그아웃 후 상태 변경
                alert('로그아웃되었습니다.');
                navigate('/'); // 로그아웃 후 리다이렉션
            });
        } else {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            setIsLoggedIn(false);
            alert('로그인 상태가 아닙니다.');
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <button onClick={handleLogin} style={buttonStyle}>
                    카카오로 로그인
                </button>
            ) : (
                <div>
                    <h2>로그인 상태입니다!</h2>
                    <button onClick={handleLogout} style={buttonStyle}>
                        로그아웃
                    </button>
                </div>
            )}
        </div>
    );
};

const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#FEE500',
    border: 'none',
    borderRadius: '5px',
    color: '#3c1e1e',
    fontSize: '16px',
    cursor: 'pointer',
};

export default KakaoLogin;
