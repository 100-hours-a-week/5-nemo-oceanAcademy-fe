import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={styles.navBar}>
      <div
        className={`${styles.navItem} ${isActive('/live-list') ? styles.active : ''}`}
        onClick={() => navigate('/live-list')}
      >
        <div className={styles.icon}>🔴</div>
        <span className={styles.label}>Live</span>
      </div>
      <div
        className={`${styles.navItem} ${isActive('/list') ? styles.active : ''}`}
        onClick={() => navigate('/list')}
      >
        <div className={styles.icon}>📚</div>
        <span className={styles.label}>Lecture</span>
      </div>
      <div
        className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}
        onClick={() => navigate('/')}
      >
        <div className={styles.icon}>🏠</div>
        <span className={styles.label}>Home</span>
      </div>
      <div
        className={`${styles.navItem} ${isActive('/classroom') ? styles.active : ''}`}
        onClick={() => navigate('/classroom')}
      >
        <div className={styles.icon}>📝</div>
        <span className={styles.label}>Learning</span>
      </div>
    </div>
  );
};

export default Navigation;