import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';

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
            axios.get(`${endpoints.getJwt}?code=${code}`)
                .then(response => {
                    const data = response.data;
                    if (data.accessToken) {
                        try {
                            window.Kakao.Auth.setAccessToken(data.accessToken);
                            console.log('Kakao accessToken 설정 완료');
                        } catch (error) {
                            console.error('Kakao SDK 초기화 실패:', error);
                        }

                        localStorage.setItem('accessToken', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);

                        axios.get(endpoints.user, {
                            headers: {
                                Authorization: `Bearer ${data.accessToken}`,
                            },
                        })
                            .then(response => {
                                if (response.status === 204) {
                                    // 회원가입 필요
                                    navigate('/sign-info', { state: { token: data.accessToken } });
                                } else {
                                    navigate('/');
                                }
                            })
                            .catch((error) => {
                                console.error('Error during signup check:', error);
                                alert('회원 확인 중 오류가 발생했습니다. 다시 로그인을 시도해주세요.');
                                navigate('/login');
                            });
                    } else {
                        throw new Error('No access token received');
                    }
                })
                .catch((error) => {
                    console.error('Error during Kakao login callback:', error);
                    alert('로그인 중 오류가 발생했습니다. 다시 로그인을 시도해주세요.');
                    navigate('/login');
                });
        } else {
            console.error('No authorization code found in URL');
            alert('인증 과정에서 오류가 발생했습니다. 다시 로그인을 시도해주세요.');
            navigate('/login');
        }
    }, [navigate]);

    return null;
};

export default KakaoCallback;
