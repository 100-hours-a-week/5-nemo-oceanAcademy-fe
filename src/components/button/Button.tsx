import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    color?: string;             // 텍스트 색상
    backgroundColor?: string;   // 배경 색상
    disabledColor?: string;     // 비활성화 시 텍스트 색상
    disabledBackgroundColor?: string; // 비활성화 시 배경 색상
}

const Button: React.FC<ButtonProps> = ({
                                           text,
                                           onClick,
                                           disabled,
                                           color = 'white',
                                           backgroundColor = 'var(--primary-color)',
                                           disabledColor ,
                                           disabledBackgroundColor
                                       }) => {
    const appliedStyles = {
        color: disabled ? disabledColor : color, // disabled 상태면 다른 색상 적용
        backgroundColor: disabled ? disabledBackgroundColor : backgroundColor, // disabled 상태면 다른 배경색 적용
        cursor: disabled ? 'not-allowed' : 'pointer' // disabled 상태면 커서 변경
    };

    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
            style={appliedStyles}
        >
            {text}
        </button>
    );
};

export default Button;
