// 콜백 로딩 중 화면
import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p>세상에서 제일 지루한 중학교는? 로 딩 중...</p>
    </div>
  );
};

export default LoadingScreen;