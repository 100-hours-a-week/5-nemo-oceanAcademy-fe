import React from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
  label: string;
  placeholder: string;
  helperText?: string;
  isRequired?: boolean;
  isTextArea?: boolean;
  height?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, helperText, isRequired, isTextArea, height }) => {
  return (
    <div className={styles.inputField}>
      <label className={styles.label}>
        {label} {isRequired && <span className={styles.required}>*</span>}
      </label>
      {isTextArea ? (
        <textarea 
          className={styles.textArea} 
          placeholder={placeholder} 
          style={{ height: height ? `${height}px` : '55px' }}
        />
      ) : (
        <input 
          className={styles.input} 
          placeholder={placeholder} 
          style={{ height: height ? `${height}px` : '55px' }}
        />
      )}
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};

export default InputField;