// 카카오 로그인 사용하는 관계로 사용x
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAltClick = () => {
    alert('현재 해당 기능을 지원하지 않습니다. 카카오 로그인을 이용해주세요.');
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
        <Empty />
        {/* Speech bubble
        <div className={styles.speechBubble}>
            5초만에 빠른 회원가입
        </div>*/}
        <button className={styles.kakaoButton}>
            <img src="/kakao_icon.svg" alt="Kakao Icon" className={styles.icon} />
            카카오로 시작하기
        </button>
        <button className={styles.alternativeButton} onClick={handleAltClick}>
          다른 방법으로 회원가입
        </button>
        <Empty />
        <p className={styles.prompt}>이미 계정이 있으신가요?</p>
        <span className={styles.link} onClick={handleLoginClick}>
          로그인
        </span>
    </div>
  );
};

export default SignUp;