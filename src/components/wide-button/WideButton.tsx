import React from 'react';
import styles from './WideButton.module.css';

interface WideButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  fixed?: boolean;
}

const WideButton: React.FC<WideButtonProps> = ({ text, onClick, disabled, fixed }) => {
  return (
    <button 
      className={`${styles.wideButton} ${fixed ? styles.fixed : ''} ${disabled ? styles.disabled : ''}`} // disabled 상태에 따라 클래스 추가
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default WideButton;