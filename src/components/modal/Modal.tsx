import React from 'react';
import styles from './Modal.module.css';

import { Space } from '../../styles/GlobalStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  title: string;
  content: string;
  leftButtonText: string;
  rightButtonText: string;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  color?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  title, 
  content, 
  leftButtonText, 
  rightButtonText, 
  onLeftButtonClick, 
  onRightButtonClick,
  color = "#2A62F2"
}) => {
  return (
    <div className={styles.modal}>
    
      <button className={styles.cancelButton} onClick={onLeftButtonClick}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
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