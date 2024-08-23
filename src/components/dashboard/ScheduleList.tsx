// 강의 일정

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
                        <div className={styles.schedule}>
                            <div className={styles.scheduleBox}>
                                <span className={styles.scheduleItemNumber}>{`${index + 1}.`}</span>
                                <span className={styles.scheduleContent}>{`${schedule.content}`}</span>
                            </div>
                        <span>{`${schedule.start_time} - ${schedule.end_time}`}</span>
                        {isTeacher && <button className={styles.deleteButton}>x</button>}

                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ScheduleList;
