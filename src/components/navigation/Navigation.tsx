import React from 'react';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <div className={styles.icon}>icon</div>
        <span className={styles.label}>라이브</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>icon</div>
        <span className={styles.label}>강의</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>icon</div>
        <span className={styles.label}>홈</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>icon</div>
        <span className={styles.label}>마이룸</span>
      </div>
    </div>
  );
};

export default Navigation;