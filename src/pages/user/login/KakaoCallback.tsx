import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import { Container } from '../../../styles/GlobalStyles';

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
      axios.get(`https://www.nemooceanacademy.com:5000/api/auth/kakao/callback`, {
        params: { code }
      })
      .then(async (response) => {
        const data = response.data;
        if (data.accessToken) {
          try {
            await waitForKakao();
              window.Kakao.Auth.setAccessToken(data.accessToken);
              console.log('Kakao accessToken 설정 완료');
          } catch (error) {
            console.error('Kakao SDK 초기화 실패:', error);
          }
        
          // 회원가입 여부 확인
          axios.get(endpoints.user, {
            headers: { 
              Authorization: `Bearer ${data.accessToken}`,
            },
          })
          .then((signupResponse) => {
            if (signupResponse.status === 200) {
              console.log('이미 회원입니다: ', response.data.message_kor);
              localStorage.setItem('accessToken', data.accessToken);
              localStorage.setItem('refreshToken', data.refreshToken);
              navigate('/');
              }
            })
            .catch((error) => {
              if (error.response?.status === 404) {
                // 404일 경우 회원가입 필요
                  console.log('미회원');
                  navigate('/sign-info', { state: { token: data.accessToken, refreshToken: data.refreshToken } });
                } else {
                  console.error('Error during signup check:', error.response);
                  navigate('/login');
                }
            });
        } else {
        throw new Error('No access token received');
      }
    })
    .catch((error) => {
      console.error('Error during Kakao login callback:', error);
      navigate('/login');
    });
    } else {
      console.error('No authorization code found in URL');
      navigate('/login');
    }
  }, [navigate]);

  return <Container>세상에서 제일 지루한 중학교는? 로 딩 중</Container>
};

export default KakaoCallback;
