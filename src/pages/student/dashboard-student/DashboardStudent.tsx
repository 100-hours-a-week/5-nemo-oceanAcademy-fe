// #I-1: DashboardStudent (`/dashboard/student/${classId}`) - 강의 대시보드 수강생 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import InfoSection from '../../../components/dashboard/InfoSection';
import WideButton from 'components/wide-button/WideButton';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './DashboardStudent.module.css';
import { Empty, Container } from '../../../styles/GlobalStyles'

// import image
import bn from '../../../assets/images/banner/banner_ex.jpeg';

interface Schedule {
  schedule_id: number;
  class_id: number;
  content: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface Dashboard {
  id: number; // classId
  user_id: string;
  category_id: number;
  instructor: string;
  category: string;
  name: string;
  object: string;
  description: string;
  instructor_info: string;
  prerequisite: string;
  announcement: string;
  banner_image_path: string;
  is_active: boolean; // 라이브 중인가요? 
}

const DashboardStudent: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('accessToken'); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.data);
        setDashboard(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        alert('강의 정보를 불러오는 데 실패했습니다.');
      }
    };

    if (classId) {
      fetchDashboardData();
    }
  }, [classId, token]);

  return (
    <Container>
      {dashboard && (
        <>
          <LectureMeta
            instructor={dashboard.instructor}
            title={dashboard.name}
            category={dashboard.category}
          />
          <Empty height="10px" />
          <div className={styles.buttonContainer}>
            <button className={styles.primaryButton} onClick={() => navigate(`/lecture/info/${classId}`)}>
              강의 소개 보러가기
            </button>
          </div>
          <Empty height="10px" />
          <Banner image={dashboard.banner_image_path || bn} />
          <Empty height="10px" />
          <Announcement content={dashboard.announcement} />
          <Empty height="10px" />

          {/* 스케줄, 수강 인원수만 (리스트 말고) 띄우기 */}

          <Empty height="10px" />
          <InfoSection title="강의 목표" content={dashboard.object} />
          <Empty height="10px" />
          <InfoSection title="강의 소개" content={dashboard.description} />
          <Empty height="10px" />
          <InfoSection title="강사 소개" content={dashboard.instructor_info} />
          <Empty height="10px" />
          <InfoSection title="사전 준비 사항" content={dashboard.prerequisite} />
        </>
      )}
      <WideButton 
        text="라이브 강의 입장" 
        onClick={() => navigate(`/live/student/${classId}`)}
        fixed
      />
      {/*
      <WideButton 
        text="라이브 강의 입장" 
        onClick={() => navigate(`/live/student/${classId}`)}
        fixed
        disabled={!dashboard.is_active} // 버튼 비활성화
        style={{ backgroundColor: !dashboard.is_active ? 'grey' : undefined }}
      />
      */}
    </Container>
  );
};

export default DashboardStudent;
