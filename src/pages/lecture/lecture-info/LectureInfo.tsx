// #H-1: LectureInfo (/lecture/info) - 강의 소개 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container } from '../../../styles/GlobalStyles'

const LectureInfo: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
  const classId = new URLSearchParams(location.search).get('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(endpoints.getRole.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.role === '강사' || response.data.role === '수강생') {
          setIsEnrolled(true);
        } else {
          setIsEnrolled(false);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setIsEnrolled(false); // 오류 시 수강 신청 버튼을 표시
      }
    };

    fetchUserRole();
  }, [classId]);

  const handleEnrollment = async () => {
    try {
      const response = await axios.post(endpoints.enrollment.replace('{classId}', classId || ''), {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.status === 201) {
        alert(response.data.message);
        navigate('/enrollment');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
        } else if (error.response?.status === 400) {
          alert(error.response.data.message || '수강신청을 실패했습니다.');
        } else {
          alert('알 수 없는 오류가 발생했습니다.');
        }
      } else {
        console.error('Enrollment request failed:', error);
        alert('수강신청을 실패했습니다.');
      }
    }
  };
  
  return (
    <Container>
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
    </Container>
  );
};

export default LectureInfo;