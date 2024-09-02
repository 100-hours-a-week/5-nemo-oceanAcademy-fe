import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureCreated.module.css';

const LectureCreated: React.FC = () => {
  const navigate = useNavigate();

  // 전달된 state에서 lectureId 가져오기
  const location = useLocation();
  const { lectureId } = location.state || {};

  const handleButtonClick = () => {
    if (lectureId) {
      navigate(`/lecture/info/${lectureId}`);
    } else {
      alert('Lecture ID가 없습니다.');
    }
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