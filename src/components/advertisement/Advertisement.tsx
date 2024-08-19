import React from 'react';
import styles from './Advertisement.module.css';

const Advertisement: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>광고 올 자리 입니다. 8팀 프론트 급구</p>
    </div>
  );
};

export default Advertisement;