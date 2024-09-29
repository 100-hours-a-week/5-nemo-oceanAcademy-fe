// GlobalStyles.ts - 공통적인 스타일 정의 
import styled from 'styled-components';

// 공통적인 컨테이너 스타일
export const Container = styled.div`
  width: 400px;
  min-height: calc(100vh - 65px);
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  background-color: white;
  padding-bottom: 60px;
`;

// 공통적인 버튼 스타일
export const Button = styled.button`
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

// 공통적인 제목 스타일
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

// 여백
interface EmptyProps {
  height?: string;
}

export const Empty = styled.div<EmptyProps>`
  width: 100%;
  height: ${({ height = '10px' }) => height};
`;