import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoCallback = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

    const waitForKakao = () => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const checkKakaoInitialized = () => {
                attempts++;
                if (window.Kakao && window.Kakao.Auth) {
                    resolve(window.Kakao);
                } else if (attempts < 10) {
                    setTimeout(checkKakaoInitialized, 100);
                } else {
                    reject(new Error('Kakao SDK is not initialized'));
                }
            };
            checkKakaoInitialized();
        });
    };

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        console.log("Authorization code:", code);

        if (code) {
            fetch(`http://localhost:8080/api/auth/kakao/callback?code=${code}`)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Server error: ${response.status}`);
                    }
                })
                .then(async (data) => {
                    if (data.accessToken) {
                        try {
                            await waitForKakao();
                            window.Kakao.Auth.setAccessToken(data.accessToken);
                            console.log('Kakao accessToken 설정 완료');
                        } catch (error) {
                            console.error('Kakao SDK 초기화 실패:', error.message);
                        }

                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        // 회원가입 여부 확인
                        fetch('http://localhost:8080/api/auth/signup', {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${data.accessToken}`,
                            }
                        }).then(response => {
                            if (response.status === 204) {
                                // 회원가입 필요
                                handleSignup(data.accessToken);
                            } else {
                                navigate('/');
                            }
                        });

                    } else {
                        throw new Error('No access token received');
                    }
                })
                .catch(error => {
                    console.error('Error during Kakao login callback:', error);
                    setErrorMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 10000);
                });
        } else {
            console.error('No authorization code found in URL');
        }
    }, [navigate]);

    const handleSignup = (token) => {
        const nickname = prompt('Enter your nickname for sign-up:');
        if (nickname) {
            const formData = new FormData();
            formData.append('nickname', nickname);

            fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                    alert('회원가입이 완료되었습니다.');
                    navigate('/');
                })
                .catch(error => console.error('Error during sign-up:', error));
        }
    };

    return (
        <div>
            {errorMessage ? (
                <div>
                    <h2>{errorMessage}</h2>
                    <p>10초 후에 로그인 페이지로 이동합니다...</p>
                </div>
            ) : (
                <h2>로그인 처리 중...</h2>
            )}
        </div>
    );
};

export default KakaoCallback;
