import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  text: string;

}

const Button: React.FC<ButtonProps> = ({ text }) => {
  return (
    <button className={styles.button}>
      {text}
    </button>
  );
};

export default Button;