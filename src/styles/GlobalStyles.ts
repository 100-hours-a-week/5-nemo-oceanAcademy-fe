// GlobalStyles.ts - 공통적인 스타일 정의 
import styled from 'styled-components';

interface ContainerProps {
  isBlackBackground?: boolean;
}

export const Container = styled.div<ContainerProps>`
  margin: 0 auto;
  width: 400px;
  min-height: calc(100vh - 66px);
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: center;
  background-color: ${({ isBlackBackground }) => (isBlackBackground ? '#141516' : 'white')};

  @media (min-width: 1184px) {
    width: 1184px;
  }
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

export const Divider = styled.div`
  width: 100vw;
  overflow-x: hidden;
  height: 1px;
  background-color: var(--divider-color);
`;

// 여백
interface SpaceProps {
  height?: string;
}

export const Space = styled.div<SpaceProps>`
  width: 100%;
  height: ${({ height = '10px' }) => height};
  /* display: block; */
`;

interface RowProps {
  align?: 'left' | 'right' | 'center' | 'fill';
  gap?: string;
}

export const Row = styled.div<RowProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: ${({ align }) =>
    align === 'center'
      ? 'center'
      : align === 'right'
      ? 'flex-end'
      : align === 'fill'
      ? 'space-between'
      : 'flex-start'};
  align-items: ${({ align }) => (align === 'right' || align === 'fill' ? 'center' : 'flex-start')};
  gap: ${({ gap = '0' }) => gap};
`;

interface ColumnProps {
  align?: 'top' | 'bottom' | 'center' | 'fill' | 'all';
  gap?: string;
}

export const Column = styled.div<ColumnProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: ${({ align }) =>
    align === 'center'
      ? 'center'
      : align === 'bottom'
      ? 'flex-end'
      : align === 'fill'
      ? 'space-between'
      : 'flex-start'};
  align-items: ${({ align }) =>
    align === 'all' || align === 'center' ? 'center' : 'flex-start'};
  gap: ${({ gap = '0' }) => gap};
`;

/*
export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
*/