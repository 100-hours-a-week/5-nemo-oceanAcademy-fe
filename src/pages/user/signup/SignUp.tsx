import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignUp.module.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const handleKakaoSignUp = () => {
    // 카카오 회원가입 로직 추가
    console.log('카카오로 회원가입 시작');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>회원가입</h1>
      
      <button className={styles.kakaoButton} onClick={handleKakaoSignUp}>
        카카오로 시작
      </button>

      <button className={styles.alternativeButton}>
        다른 방법으로 회원가입
      </button>

      <p className={styles.loginPrompt}>이미 계정이 있으신가요?</p>
      <span className={styles.loginLink} onClick={handleLoginClick}>
        로그인
      </span>
    </div>
  );
};

export default SignUp;