import React from 'react';
import styles from './StudentCount.module.css';

interface StudentCountProps {
    count: number;
    onViewStudents: () => void;
}

const StudentCount: React.FC<StudentCountProps> = ({ count, onViewStudents }) => {
    return (
        <div className={styles.container}>
            <span>{`${count}명`}</span>
            <button className={styles.viewButton} onClick={onViewStudents}>수강생 보기</button>
        </div>
    );
};

export default StudentCount;
