import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureCreated.module.css';

const LectureCreated: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  // const token = localStorage.getItem('accessToken');

  const [countdown, setCountdown] = useState(5); // 5초 카운트다운


  const handleButtonClick = () => {
    if (classId) {
      navigate(`/lecture/info/${classId}`);
    } else {
      alert('class ID가 없습니다. 다시 시도해주세요.');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        handleButtonClick();
    }, 5000); // 5초 = 5000ms

    // 카운트다운을 매초 업데이트
    const countdownInterval = setInterval(() => {
        setCountdown(prev => prev - 1);
    }, 1000);

    return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
    };
  }, [classId, navigate]);

  return (
    <div className={styles.container}>
      <h1 className={styles.message}>
        강의 개설이<br />
        완료되었습니다!
      </h1>
      <p className={styles.countdownMessage}>
        {countdown}초 후에 강의실로 이동합니다.
      </p>
      <div className={styles.buttonContainer}>
        <Button text="개설한 강의 보러 가기" onClick={handleButtonClick} />
      </div>
      <Navigation />
    </div>
  );
};

export default LectureCreated;