import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureInfo.module.css';

const LectureInfo: React.FC = () => {
  const navigate = useNavigate();

  const handleEnrollment = () => {
    // TODO: 수강신청 API 요청
    navigate('/student/enrollment'); // API 요청이 성공하면 Enrollment 페이지로 이동
  };

  const isEnrolled = false; // 수강신청 상태를 확인하는 변수 (예시로 false로 설정)

  return (
    <div className={styles.container}>
      <p className={styles.instructor}>강사 이름</p>
      <h1 className={styles.title}>강의 제목</h1>
      <div className={styles.banner}></div>
      <div className={styles.category}>카테고리</div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>강의 목표</h3>
        <div className={styles.infoContent}></div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>강의 소개</h3>
        <div className={styles.infoContent}></div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>강사 소개</h3>
        <div className={styles.infoContent}></div>
      </div>

      <div className={styles.infoSection}>
        <h3 className={styles.infoTitle}>강의에 필요한 사전 지식 및 준비 안내</h3>
        <div className={styles.infoContent}></div>
      </div>

      <div className={styles.buttonContainer}>
        <Button 
          text={isEnrolled ? "대시보드 가기" : "수강신청"} 
          onClick={handleEnrollment} 
        />
      </div>

      <Navigation />
    </div>
  );
};

export default LectureInfo;