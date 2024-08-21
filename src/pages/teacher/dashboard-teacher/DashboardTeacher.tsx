import React from 'react';
import { useNavigate } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import StudentCount from '../../../components/dashboard/StudentCount';
import InfoSection from '../../../components/dashboard/InfoSection';
import styles from './DashboardTeacher.module.css';

const DashboardTeacher: React.FC = () => {
  const navigate = useNavigate();

  // 더미 데이터
  const lectureData = {
    instructor: '헤이즐리',
    title: '즐리가 만든 소금빵이 제일 맛있어',
    category: '쿠킹',
    bannerImage: '', // 배너 이미지 URL
    announcement: '8/2 수업 오후 10시 시작\n준비물 : 밀가루, 물, 치킨, 초콜릿, 감자, 해파리\n상담 가능 시간 : 8/1 오후 7시~',
    schedules: [
        { content: '강의1', start_time: '13:00', end_time: '15:00' },
        { content: '강의2', start_time: '13:00', end_time: '15:00' },
    ],
    studentCount: 20,
    objective: '이 강의는 소금빵을 만드는 방법을 배우는 것을 목표로 합니다.',
    description: '소금빵의 다양한 레시피와 실습을 통해 최고의 소금빵을 만들 수 있습니다.',
    instructorInfo: '헤이즐리 강사는 쿠킹 전문가로 다년간의 경험을 보유하고 있습니다.',
    precourse: '밀가루와 물을 사전에 준비해 주세요.',
  };

  return (
    <div className={styles.container}>
      <LectureMeta
                instructor={lectureData.instructor}
                title={lectureData.title}
                category={lectureData.category}
            />
            <button className={styles.primaryButton} onClick={() => navigate('/lecture/info')}>강의 소개 보러가기</button>
            <Banner image={lectureData.bannerImage} />
            <Announcement content={lectureData.announcement} />
            <ScheduleList schedules={lectureData.schedules} isTeacher />
            <StudentCount count={lectureData.studentCount} onViewStudents={() => navigate('/lecture/students')} />
            <InfoSection title="강의 목표" content={lectureData.objective} />
            <InfoSection title="강의 소개" content={lectureData.description} />
            <InfoSection title="강사 소개" content={lectureData.instructorInfo} />
            <InfoSection title="사전 준비 사항" content={lectureData.precourse} />
            <div className={styles.bottomButtons}>
                <button className={styles.editButton}>정보 수정하기</button>
                <button className={styles.deleteButton}>강의 삭제하기</button>
            </div>
            <button className={styles.wideButton} onClick={() => navigate('/live/teacher')}>라이브 강의 시작</button>
    </div>
  );
};

export default DashboardTeacher;