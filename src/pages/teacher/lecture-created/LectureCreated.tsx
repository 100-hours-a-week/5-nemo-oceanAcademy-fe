import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureCreated.module.css';

const LectureCreated: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/lecture/info'); // LectureInfo 페이지로 이동
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.message}>
        강의 개설이<br />
        완료되었습니다!
      </h1>
      <div className={styles.buttonContainer}>
        <Button text="개설한 강의 보러 가기" onClick={handleButtonClick} />
      </div>
      <Navigation />
    </div>
  );
};

export default LectureCreated;