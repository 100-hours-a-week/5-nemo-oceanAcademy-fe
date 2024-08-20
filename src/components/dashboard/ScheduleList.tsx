import React from 'react';
import styles from './ScheduleList.module.css';

interface Schedule {
    content: string;
    start_time: string;
    end_time: string;
}

interface ScheduleListProps {
    schedules: Schedule[];
    isTeacher?: boolean;
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, isTeacher }) => {
    return (
        <div className={styles.container}>
            <h4>강의 일정</h4>
            <ul>
                {schedules.map((schedule, index) => (
                    <li key={index} className={styles.scheduleItem}>
                        <span>{`${schedule.content} (${schedule.start_time} - ${schedule.end_time})`}</span>
                        {isTeacher && <button className={styles.deleteButton}>x</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScheduleList;
