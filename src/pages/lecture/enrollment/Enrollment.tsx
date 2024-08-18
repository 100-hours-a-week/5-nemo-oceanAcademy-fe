import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './Enrollment.module.css';

const Enrollment: React.FC = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/student/dashboard');
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.message}>
                수강신청이<br />
                완료되었습니다!
            </h1>
            <div className={styles.buttonContainer}>
                <Button text="강의실 바로가기" 
                onClick={handleButtonClick} />
            </div>
            <Navigation />
        </div>
    );
};

export default Enrollment;