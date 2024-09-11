// #J-1: DashboardTeacher (`/dashboard/teacher/${classId}`) - 강의 대시보드 강사용 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import StudentCount from '../../../components/dashboard/StudentCount';
import InfoSection from '../../../components/dashboard/InfoSection';
import Modal from '../../../components/modal/Modal';
import WideButton from '../../../components/wide-button/WideButton';
import styles from './DashboardTeacher.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';
import ScheduleForm from 'components/dashboard/ScheduleForm';
import axios from 'axios';
import endpoints from '../../../api/endpoints';

// import image
import bn from '../../../assets/images/banner/banner_ex.png';

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

const DashboardTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>(); 
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [studentCount, setStudentCount] = useState<number>(0);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  // 일정 목록 불러오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get(endpoints.lectureSchedule.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchedules(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        alert('일정을 불러오는 데 실패했습니다.');
      }
    };

    if (classId) {
      fetchSchedules();
    }
  }, [classId, token]);

  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const response = await axios.get(endpoints.getStudentList.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudentCount(response.data.data.length);
      } catch (error) {
        console.error('Failed to fetch student count:', error);
        alert('수강생 정보를 불러오는 데 실패했습니다.');
      }
    };

    if (classId) {
      fetchStudentCount();
    }
  }, [classId, token]);

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalDelete = async () => {
    try {
      const response = await axios.delete(endpoints.deleteLecture.replace('{classId}', classId || ''), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('강의가 삭제되었습니다😢');
        navigate('/mypage');
      } else {
        alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // 일정 추가 후 새로 불러오기
  const handleScheduleAdded = async () => {
    try {
      const response = await axios.get(endpoints.lectureSchedule.replace('{classId}', classId || ''), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchedules(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch updated schedules:', error);
    }
  };

  const handleScheduleDelete = async (schedule_id: number) => {
    try {
      const response = await axios({
        method: 'delete',
        url: endpoints.lectureSchedule.replace('{classId}', classId || ''),
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { schedule_id }, // Request Body에 schedule_id를 포함
      });
  
      if (response.status === 200) {
        const updatedSchedules = schedules.filter(schedule => schedule.schedule_id !== schedule_id);
        setSchedules(updatedSchedules);
      } else {
        alert('일정 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
      alert('일정 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

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
              <ScheduleList schedules={schedules} isTeacher onDeleteSchedule={handleScheduleDelete} />
              <Empty height="10px" />
              <ScheduleForm classId={classId || ''} onScheduleAdded={handleScheduleAdded} />
              <Empty height="10px" />
              <StudentCount count={studentCount} onViewStudents={() => navigate(`/lecture/students/${classId}`)} />
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
        <div className={styles.bottomButtons}>
          <button className={styles.editButton} onClick={() => navigate(`/dashboard/edit/${classId}`)}>정보 수정하기</button>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>강의 삭제하기</button>
        </div>
        <WideButton 
          text="라이브 강의 시작" 
          onClick={() => navigate(`/live/teacher/${classId}`)}
          fixed
        />
        {isModalOpen && (
            <Modal
              title="강의를 삭제하시겠습니까?"
              content="삭제한 강의는 복구할 수 없습니다. 그래도 삭제하시겠습니까?"
              leftButtonText="취소"
              rightButtonText="강의 삭제"
              onLeftButtonClick={handleModalCancel}
              onRightButtonClick={handleModalDelete}
            />
        )}
      </Container>
  );
};

export default DashboardTeacher;
