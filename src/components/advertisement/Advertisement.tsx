import React from 'react';
import styles from './Advertisement.module.css';

const Advertisement: React.FC = () => {
  return (
    <div className={styles.container}>
      <p className={styles.text}>광고</p>
    </div>
  );
};

export default Advertisement;