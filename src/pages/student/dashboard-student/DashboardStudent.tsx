// #I-1: DashboardStudent (`/dashboard/student/${classId}`) - 강의 대시보드 수강생 페이지
import React, { useEffect, useState } from 'react';
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
import bn from '../../../assets/images/ad_big0.png';

// [ ] 헤더 밑에 마진 or 패딩? 아무튼 빈 공간이 화면 사이즈에 따라서 바껴요
// NOTE 확인해보니 dashboard/teacher 페이지는 안 그래서, 제가 뭘 잘못 만졌나봅니다... 시간 나실 때 도움주세요 ㅠㅠ

interface Schedule {
    schedule_id: number;
    content: string;
    date: string;
    start_time: string;
    end_time: string;
}

interface LectureData {
    instructor: string;
    title: string;
    category: string;
    bannerImage: string;
    announcement: string;
    schedules: Schedule[];
    objective: string;
    description: string;
    instructorInfo: string;
    precourse: string;
}

const DashboardStudent: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [lectureData, setLectureData] = useState<LectureData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('accessToken'); 

  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        const response = await axios.get(endpoints.getDashboard.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLectureData(response.data);
      } catch (error) {
        console.error('Failed to fetch lecture data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLectureData();
  }, [classId, token]);

  if (isLoading) {
    return <Container>Loading...</Container>;
  }

  if (!lectureData) {
    return <Container>No lecture data found.</Container>;
  }


  return (
    <Container>
      <LectureMeta
        instructor={lectureData.instructor}
        title={lectureData.title}
        category={lectureData.category}
      />
      <Empty height="10px" />
      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton} onClick={() => navigate(`/lecture/info/${classId}`)}>강의 소개 보러가기</button>
      </div>
      <Empty height="10px" />
      <Banner image={lectureData.bannerImage} />
      <Empty height="10px" />
      <Announcement content={lectureData.announcement} />
      <Empty height="10px" />
      <ScheduleList schedules={lectureData.schedules} />
      <Empty height="10px" />
      <InfoSection title="강의 목표" content={lectureData.objective} />
      <Empty height="10px" />
      <InfoSection title="강의 소개" content={lectureData.description} />
      <Empty height="10px" />
      <InfoSection title="강사 소개" content={lectureData.instructorInfo} />
      <Empty height="10px" />
      <InfoSection title="사전 준비 사항" content={lectureData.precourse} />
        
      <WideButton 
        text="라이브 강의 입장" 
        onClick={() => navigate(`/live/student/${classId}`)}
        fixed
      />
    </Container>
  );
};

export default DashboardStudent;
