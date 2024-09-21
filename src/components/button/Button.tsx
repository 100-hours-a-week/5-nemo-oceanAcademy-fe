import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    color?: string;             // 텍스트 색상
    backgroundColor?: string;   // 배경 색상
}

const Button: React.FC<ButtonProps> = ({ text, onClick, disabled, color = '#fff', backgroundColor = '#007BFF' }) => {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
            style={{ color, backgroundColor }}
        >
            {text}
        </button>
    );
};

export default Button;
