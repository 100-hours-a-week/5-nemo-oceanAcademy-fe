import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.navBar}>
      <div className={styles.navItem} onClick={() => navigate('/live-list')}>
        <div className={styles.icon}>🔴</div>
        <span className={styles.label}>Live</span>
      </div>
      <div className={styles.navItem} onClick={() => navigate('/list')}>
        <div className={styles.icon}>📚</div>
        <span className={styles.label}>Lecture</span>
      </div>
      <div className={styles.navItem} onClick={() => navigate('/')}>
        <div className={styles.icon}>🏠</div>
        <span className={styles.label}>Home</span>
      </div>
      <div className={styles.navItem} onClick={() => navigate('/classroom')}>
        <div className={styles.icon}>📝</div>
        <span className={styles.label}>Learning</span>
      </div>
    </div>
  );
};

export default Navigation;