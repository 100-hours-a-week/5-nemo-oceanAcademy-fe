// 수강 인원 

import React from 'react';
import styles from './StudentCount.module.css';

interface StudentCountProps {
    count: number;
    onViewStudents: () => void;
}

const StudentCount: React.FC<StudentCountProps> = ({ count, onViewStudents }) => {
    return (
        <div className={styles.container}>
            <h4>수강 인원</h4>
            <div className={styles.content}>
                <span className={styles.count}>{`${count}명`}</span>
                <button className={styles.viewButton} onClick={onViewStudents}>수강생 보기</button>
            </div>
        </div>
    );
};

export default StudentCount;
