import React from 'react';
import styles from './InputField.module.css';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string; // value prop 추가
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; // onChange prop 추가
  helperText?: string;
  isRequired?: boolean;
  isTextArea?: boolean;
  height?: number;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChange, helperText, isRequired, isTextArea, height }) => {
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
          value={value}
          onChange={onChange}
        />
      ) : (
        <input 
          className={styles.input} 
          placeholder={placeholder} 
          style={{ height: height ? `${height}px` : '55px' }}
          value={value}
          onChange={onChange}
        />
      )}
      {helperText && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
};

export default InputField;