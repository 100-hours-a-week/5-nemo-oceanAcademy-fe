import React from 'react';
import styles from './WideButton.module.css';

interface WideButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
}

const WideButton: React.FC<WideButtonProps> = ({ text, onClick, disabled }) => {
  return (
    <button 
        className={styles.wideButton} 
        onClick={onClick}
        disabled={disabled}
    >
      {text}
    </button>
  );
};

export default WideButton;