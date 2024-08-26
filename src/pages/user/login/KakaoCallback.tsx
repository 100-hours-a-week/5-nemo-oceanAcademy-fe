import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const KakaoCallback: React.FC = () => {
    const navigate = useNavigate();

    const waitForKakao = (): Promise<any> => {
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
        console.log('Authorization code:', code);

        if (code) {
            fetch(`https://www.nemooceanacademy.com:5000/api/auth/kakao/callback?code=${code}`)
                .then(response => response.ok ? response.json() : Promise.reject(new Error(`Server error: ${response.status}`)))
                .then(async (data) => {
                    if (data.accessToken) {
                        try {
                            await waitForKakao();
                            window.Kakao.Auth.setAccessToken(data.accessToken);
                            console.log('Kakao accessToken 설정 완료');
                        } catch (error) {
                            console.error('Kakao SDK 초기화 실패:', error);
                        }

                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        const signupResponse = await fetch('https://www.nemooceanacademy.com:5000/api/auth/signup', {
                            method: 'GET',
                            headers: {
                                Authorization: `Bearer ${data.accessToken}`,
                            },
                        });

                        if (signupResponse.status === 204) {
                            // 회원가입 필요
                            navigate('/sign-info', { state: { token: data.accessToken } });
                        } else {
                            navigate('/');
                        }
                    } else {
                        throw new Error('No access token received');
                    }
                })
                .catch((error) => {
                    console.error('Error during Kakao login callback:', error);
                    navigate('/login'); // 에러 시 로그인 페이지로 이동
                });
        } else {
            console.error('No authorization code found in URL');
            navigate('/login'); // Authorization code가 없으면 로그인 페이지로 이동
        }
    }, [navigate]);

    return null; // 화면에 아무것도 표시하지 않음
};

export default KakaoCallback;
