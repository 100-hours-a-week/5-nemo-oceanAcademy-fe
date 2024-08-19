import React from 'react';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  return (
    <div className={styles.navBar}>
      <div className={styles.navItem}>
        <div className={styles.icon}>🔴</div>
        <span className={styles.label}>Live</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>📚</div>
        <span className={styles.label}>Lecture</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>🏠</div>
        <span className={styles.label}>Home</span>
      </div>
      <div className={styles.navItem}>
        <div className={styles.icon}>📝</div>
        <span className={styles.label}>Learning</span>
      </div>
    </div>
  );
};

export default Navigation;