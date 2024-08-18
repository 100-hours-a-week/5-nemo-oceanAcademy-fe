import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/input-field/InputField';
import FileUpload from '../../../components/file-upload/FileUpload';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureOpen.module.css';

const LectureOpen: React.FC = () => {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false); // 필수값이 모두 입력되었는지 확인

  const handleSubmit = () => {
    // TODO: 강의 개설 API 요청

    navigate('/teacher/lecture-created'); 
    // 강의 개설 후 LectureCreated 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>강의 개설하기</h1>

      <InputField 
        label="카테고리 선택" 
        placeholder="카테고리를 선택해주세요" 
        isRequired 
      />

      <InputField 
        label="강의 제목" 
        placeholder="강의 제목을 작성해주세요" 
        isRequired 
        helperText="강의 제목은 필수 항목입니다."
      />

      <InputField 
        label="강의 목표" 
        placeholder="강의 목표를 작성해주세요" 
        isRequired 
        helperText="강의 목표는 필수 항목입니다."
      />

      <InputField 
        label="강의 소개" 
        placeholder="강의 소개를 작성해주세요" 
        isRequired 
        isTextArea 
        height={100}
        helperText="강의 소개는 필수 항목입니다."
      />

      <InputField 
        label="강사 소개 (선택)" 
        placeholder="강사 소개를 작성해주세요" 
        isTextArea 
        height={100}
      />

      <InputField 
        label="강의에 필요한 사전 지식 및 준비 안내 (선택)" 
        placeholder="사전 지식 및 준비 안내를 작성해주세요" 
        isTextArea 
        height={100}
      />

      <FileUpload />

      <div className={styles.buttonContainer}>
        <Button 
          text="강의 개설하기" 
          onClick={handleSubmit} 
          disabled={!isFormValid}
        />
      </div>

      <Navigation />
    </div>
  );
};

export default LectureOpen;