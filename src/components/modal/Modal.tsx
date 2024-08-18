import React from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  content: string;
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  content, 
  leftButtonText, 
  rightButtonText, 
  onLeftButtonClick, 
  onRightButtonClick 
}) => {
  return (
    <div className={styles.modal}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.content}>{content}</p>
      <div className={styles.buttonContainer}>
        <button className={styles.leftButton} onClick={onLeftButtonClick}>
          {leftButtonText}
        </button>
        <button className={styles.rightButton} onClick={onRightButtonClick}>
          {rightButtonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;