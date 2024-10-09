// 콜백 로딩 중 화면
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Space } from '../../../styles/GlobalStyles';

const LoadingScreen: React.FC = () => {
  return (
    <LoaderContainer>
      <Emoji>
        🪼 🪼 🪼
      </Emoji>

      <Space height={"30px"} />
    
      <LoadingText>
        바다서원으로 이동 중 . . .
      </LoadingText>

      {/*
      <Space height={"30px"} />
      <Loader />
      */}
      
      <Space height={"40px"} />

      <Emoji>
        🐟 🐟 🐟
      </Emoji>
      
      <Space height="100px" />
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

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const LoaderContainer = styled.div`
  margin: 0 auto;
  width: 400px;
  height: calc(100vh - 66px);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 1184px) {
    margin: 0 auto;
    width: 1184px;
  }
`;

const Loader = styled.div`
  border: 6px solid var(--blue-color);
  border-top: 6px solid var(--blue-bgr-color);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #555;
  text-align: center;
`;

const Emoji = styled.h1`
  animation: ${float} 2s ease-in-out infinite;
`;
