// 콜백 로딩 중 화면
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Space } from '../../../styles/GlobalStyles';

const LoadingScreen: React.FC = () => {
  return (
    <LoaderContainer>
      <LoadingText>
        🪼🪼 <br />
        <br />
        바다서원으로 <br />
        이동 중입니다 <br />
        <br />
      </LoadingText>
      <Loader />
      <LoadingText>
        <br />
        🐙🐙
      </LoadingText>
      <Space height="120px" />
    </LoaderContainer>
  );
};


export default LoadingScreen;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  width: 400px;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    margin: 0 auto;
    width: 1184px;
  }
`;

const Loader = styled.div`
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
  text-align: center;
`;
