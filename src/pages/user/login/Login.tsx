import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>로그인</h1>
      
      <button className={styles.kakaoButton}>
        카카오 로그인
      </button>

      <button className={styles.alternativeButton}>
        다른 방법으로 로그인
      </button>

      <p className={styles.signUpPrompt}>아직 원생이 아니신가요?</p>
      <span className={styles.signUpLink} onClick={handleSignUpClick}>
        간편 가입하기
      </span>
    </div>
  );
};

export default Login;