import React from 'react';
import styles from './Modal.module.css';
import { Space } from '../../styles/GlobalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  title: string;
  content: React.ReactNode; 
  // leftButtonText?: string;  // cancel 시 실행될 내용 (x 아이콘으로만 표기 됨)
  rightButtonText: string; // confirm 시 실행될 내용
  onRightButtonClick?: () => void;  // confirm 액션
  onLeftButtonClick?: () => void; 
  color?: string;
  showCancelButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  content, 
  rightButtonText, 
  onRightButtonClick,
  onLeftButtonClick,
  color = "#2A62F2",
  showCancelButton = true
}) => {
  return (
    <div className={styles.modal}>
    
      {showCancelButton && (
        <button className={styles.cancelButton} onClick={onLeftButtonClick}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      )}
      <Space height={"8px"}/>

      <>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.content}>{content}</p>
      </>
      <Space height={"16px"}/>

      <div className={styles.buttonContainer}>
        <button className={styles.confirmButton} 
        onClick={onRightButtonClick}
        style={{ '--button-bg-color': color } as React.CSSProperties}>
          {rightButtonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;