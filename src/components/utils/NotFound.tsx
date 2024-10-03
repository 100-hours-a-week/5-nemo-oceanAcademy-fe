// components/NotFound.tsx - 존재하지 않는 페이지에 대한 라우팅
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleButton = () => {
        navigate('/');
    };

    return (
        <Container>
            <ErrorEmo>🏯</ErrorEmo>
            <ErrorText>404</ErrorText>
            <Oops>Oops! Page not found.</Oops>
            <RedirectButton onClick={handleButton}>메인으로 돌아가기</RedirectButton>
        </Container>
    );
};

export default NotFound;


const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: 100vh;
    background-color: white;
    margin-top: -65px;
`;

const ErrorImage = styled.img`
    width: 400px;
    height: 400px;
    margin-bottom: 20px;
`;

const ErrorEmo = styled.h2`
    font-size: 40px;
    text-align: center;
`;

const ErrorText = styled.h1`
    font-size: 100px;
    text-align: center;
`;

const Oops = styled.h5`
    font-size: 20px;
    margin-bottom: 40px;
`

const RedirectButton = styled.button`
    width: 200px;
    height: 44px;
    border: none;
    border-radius: 4px;
    background-color: var(--blue-color);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
`;