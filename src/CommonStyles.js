import styled from 'styled-components';

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

// 공통적인 컨테이너 스타일
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

// 공통적인 제목 스타일
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

/** 
 * 사용 방법~
 * import React from 'react';
import { Button, Container, Title } from './styles/CommonStyles';

function App() {
  return (
    <Container>
      <Title>Hello World!</Title>
      <Button>Click Me</Button>
    </Container>
  );
}

export default App;
 */