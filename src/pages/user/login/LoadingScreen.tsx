// 콜백 로딩 중 화면
import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p>바다서원으로 이동 중입니다
        <br />
        ⚓️
      </p>
    </div>
  );
};

export default LoadingScreen;