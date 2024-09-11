import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import endpoints from '../,,/../../api/endpoints';
import styles from './ScheduleForm.module.css';

interface ScheduleFormProps {
    classId: string;
    onScheduleAdded: () => void;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({ classId, onScheduleAdded }) => {
    const [content, setContent] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const token = localStorage.getItem('accessToken');

    const handleAddSchedule = async () => {
        // 필수 항목이 모두 채워졌는지 확인
        if (!content || !date || !startTime || !endTime) {
          alert('모든 항목을 입력해주세요.');
          return;
        }
        try {
            const response = await axios.post(endpoints.lectureSchedule.replace('{classId}', classId),
              {
                content,
                date,
                start_time: startTime,
                end_time: endTime,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );
      
            if (response.status === 200) {
              onScheduleAdded();
              setContent('');
              setDate('');
              setStartTime('');
              setEndTime('');
            } else {
              alert('일정 추가에 실패했습니다. 다시 시도해 주세요.');
            }
          } catch (error) {
            console.error('Error adding schedule:', error);
            alert('일정 추가에 실패했습니다. 다시 시도해 주세요.');
          }
        };

    const generateTimeOptions = (): string[] => {
        const options: string[] = [];
        for (let i = 0; i < 24; i++) {
        const hour = i.toString().padStart(2, '0');
        options.push(`${hour}:00`);
        options.push(`${hour}:30`);
        }
        return options;
    };

    return (
        <div className={styles.scheduleForm}>
            <h4>강의 일정 추가하기</h4>
            <div className={styles.scheduleRow}>
                <label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        placeholder="날짜" 
                    />
                </label>
                <label>
                    <select value={startTime} onChange={(e) => setStartTime(e.target.value)} >
                        <option value="" disabled>시작 시각</option>
                        {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <select value={endTime} onChange={(e) => setEndTime(e.target.value)} >
                        <option value="" disabled>종료 시각</option>
                        {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </label>
            </div>
            <label>
                <input
                type="text"
                className={styles.titleInput}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="강의 제목을 입력하세요"
                />
            </label>
            <button className={styles.primaryButton} onClick={handleAddSchedule}>
                <FontAwesomeIcon className={styles.iconRight} icon={faCheck} />
            </button>
        </div>
    );
};

export default ScheduleForm;
