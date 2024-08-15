import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className={styles.header}>
        <div onClick={handleLogoClick}
        className={styles.logo}>
          Ocean Academy
        </div>
    </header>
  );
};

export default Header;