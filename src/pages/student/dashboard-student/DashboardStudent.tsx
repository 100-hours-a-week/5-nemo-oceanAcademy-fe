// #I-1: DashboardStudent (`/dashboard/student/${classId}`) - 강의 대시보드 수강생 페이지
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import arrowIcon from '../../../assets/images/icon/arrow.svg';
import profileDefault1 from '../../../assets/images/profile/jellyfish.png';
import profileDefault2 from '../../../assets/images/profile/whale.png';
import profileDefault3 from '../../../assets/images/profile/crab.png';
const profileImages = [profileDefault1, profileDefault2, profileDefault3];

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
  student_count: number;
  banner_image_path: string;
  is_active: boolean; // 라이브 중인가요? 
}

const DashboardStudent: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [studentCount, setStudentCount] = useState<number>(0);
  const token = localStorage.getItem('accessToken'); 

  const getProfileImage = (nickname: string): string => {
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % profileImages.length);
    return profileImages[index];
  };

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
        setProfileImage(getProfileImage(response.data.data.instructor));
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
    <div className={styles.container}>
      {dashboard && (
        <>
          {dashboard.banner_image_path && (
            <div
              className={styles.banner}
              style={{ backgroundImage: `url(${dashboard.banner_image_path})` }}
            />)}
            
          <section className={styles.basicInfo}>
            <p className={styles.category}>
              {dashboard.category}
            </p>
            <div className={styles.row}>
              <div className={styles.title}>
                {dashboard.name}
              </div>
              <div 
                className={`${styles.button} ${!dashboard.is_active ? styles.disabledButton : ''}`} 
                onClick={() => {
                  if (dashboard.is_active) {
                    navigate(`/live/student/${classId}`);
                  }
                }}
              >
                라이브 강의 입장
              </div>
            </div>
            <div className="linkContainer">
              <Link to={`/lecture/info/${classId}`} className={styles.link}>
                강의 소개 보러 가기
                <img src={arrowIcon} alt="arrow icon" className={styles.linkIcon} />
              </Link>
            </div>
          </section>

          <section className={styles.instructorSection}>
              <img src={profileImage} alt="instructor profile image" />
              <div className={styles.column}>
                <h5>{dashboard.instructor}</h5>
                <p>{dashboard.instructor_info}</p>
              </div>
            </section>

            <section className={styles.info}>
              <h5>강의 공지</h5>
              <p>{dashboard.announcement ? dashboard.announcement : '공지가 없습니다.'}</p>
            </section>

            <section className={styles.info}>
              <h5>강의 소개</h5>
              <p>{dashboard.description ? dashboard.description : '강의 소개가 없습니다.'}</p>
            </section>

            <section className={styles.info}>
              <h5>강의 목표</h5>
              <p>{dashboard.object ? dashboard.object : '강의 목표가 없습니다.'}</p>  
            </section>

            <div className={styles.divider} />

            {dashboard.prerequisite && (
              <section className={styles.info}>
                <h5>강의에 필요한 사전 지식 및 준비 안내</h5>
                <p>{dashboard.prerequisite}</p>
              </section>
            )}
          </>
        )}
    </div>
  );
};

export default DashboardStudent;
