import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './Enrollment.module.css';

const Enrollment: React.FC = () => {
    const navigate = useNavigate();
    const { classId } = useParams<{ classId: string }>();
    // const token = localStorage.getItem('accessToken');

    const [countdown, setCountdown] = useState(5); // 5초 카운트다운

    const handleButtonClick = () => {
        navigate(`/dashboard/student/${classId}`);
    }

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
                수강신청이<br />
                완료되었습니다!
            </h1>
            <p className={styles.countdownMessage}>
                {countdown}초 후에 강의실로 이동합니다.
            </p>
            <button className={styles.navButton} onClick={handleButtonClick}>
                강의실 바로 가기
            </button>
            <Navigation />
        </div>
    );
};

export default Enrollment;