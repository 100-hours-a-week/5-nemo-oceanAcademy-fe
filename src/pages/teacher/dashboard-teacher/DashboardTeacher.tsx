import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

interface Schedule {
  schedule_id: number;
  content: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface LectureData {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
  objective: string;
  description: string;
  instructorInfo: string;
  precourse: string;
  announcement: string;
  schedules: Schedule[];
}

const DashboardTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>(); 
  const [lectureData, setLectureData] = useState<LectureData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(endpoints.getDashboard.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLectureData(response.data);
        setSchedules(response.data.schedules || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        alert('강의 정보를 불러오는 데 실패했습니다.');
      }
    };

    if (classId) {
      fetchDashboardData();
    }
  }, [classId, token]);

  const handleLiveLectureStart = () => {
    navigate(`/live/teacher/${classId}`);
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalDelete = async () => {
    try {
      const response = await axios.delete(endpoints.lectureSchedule.replace('{classId}', classId || ''), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate('/mypage'); // 강의 삭제 후 마이페이지로 이동
      } else {
        alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleScheduleAdded = async () => {
    try {
      const response = await axios.get(endpoints.lectureSchedule.replace('{classId}', classId || ''), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSchedules(response.data.schedules || []);
    } catch (error) {
      console.error('Failed to fetch updated schedules:', error);
    }
  };

  const handleScheduleDelete = async (schedule_id: number) => {
    try {
      const response = await axios.delete(`${endpoints.lectureSchedule.replace('{classId}', classId || '')}/${schedule_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        {lectureData && (
            <>
              <LectureMeta
                  instructor={lectureData.instructor}
                  title={lectureData.name}
                  category={lectureData.category}
              />
              <Empty height="10px" />
              <div className={styles.buttonContainer}>
                <button className={styles.primaryButton} onClick={() => navigate(`/lecture/info/${classId}`)}>
                  강의 소개 보러가기
                </button>
              </div>
              <Empty height="10px" />
              <Banner image={lectureData.bannerImage} />
              <Empty height="10px" />
              <Announcement content={lectureData.announcement} />
              <Empty height="10px" />
              <ScheduleList schedules={schedules} isTeacher onDeleteSchedule={handleScheduleDelete} />
              <Empty height="10px" />
              <ScheduleForm classId={classId || ''} onScheduleAdded={handleScheduleAdded} />
              <Empty height="10px" />
              <StudentCount count={20} onViewStudents={() => navigate(`/lecture/students/${classId}`)} />
              <Empty height="10px" />
              <InfoSection title="강의 목표" content={lectureData.objective} />
              <Empty height="10px" />
              <InfoSection title="강의 소개" content={lectureData.description} />
              <Empty height="10px" />
              <InfoSection title="강사 소개" content={lectureData.instructorInfo} />
              <Empty height="10px" />
              <InfoSection title="사전 준비 사항" content={lectureData.precourse} />
            </>
        )}
        <div className={styles.bottomButtons}>
          <button className={styles.editButton} onClick={() => navigate(`/dashboard/edit/${classId}`)}>정보 수정하기</button>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>강의 삭제하기</button>
        </div>
        <button className={styles.wideButton} onClick={handleLiveLectureStart}>라이브 강의 시작</button>
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
