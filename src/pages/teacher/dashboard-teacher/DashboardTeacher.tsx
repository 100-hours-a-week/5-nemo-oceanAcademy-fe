import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import StudentCount from '../../../components/dashboard/StudentCount';
import InfoSection from '../../../components/dashboard/InfoSection';
import Modal from '../../../components/modal/Modal';
import styles from './DashboardTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';
import bn from '../../../assets/images/ad_big0.png';
import ScheduleForm from 'components/dashboard/ScheduleForm';

const DashboardTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 더미 데이터
  const lectureData = {
    instructor: '헤이즐리',
    title: '즐리가 만든 소금빵이 제일 맛있어',
    category: '쿠킹',
    bannerImage: bn, // 배너 이미지 URL
    announcement: '8/2 수업 오후 10시 시작\n준비물 : 밀가루, 물, 치킨, 초콜릿, 감자, 해파리\n상담 가능 시간 : 8/1 오후 7시~',
    schedules: [
      { content: '헤이즐리의 말랑말랑 반죽 만들기', start_time: '13:00', end_time: '15:00' },
      { content: '헤이즐리의 끄아아아앙아아앙아아아악 고라니 만들기', start_time: '13:00', end_time: '15:00' },
],
    studentCount: 20,
    objective: '이 강의는 소금빵을 만드는 방법을 배우는 것을 목표로 합니다.',
    description: '소금빵의 다양한 레시피와 실습을 통해 최고의 소금빵을 만들 수 있습니다.',
    instructorInfo: '헤이즐리 강사는 쿠킹 전문가로 다년간의 경험을 보유하고 있습니다.',
    precourse: '밀가루와 물을 사전에 준비해 주세요.',
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleModalDelete = async () => {
    try {
      // 강의 삭제 API 요청
      const response = await fetch('/api/delete-lecture', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId: 1 }), // 예시로 classId를 1로 지정
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <Container>
      <LectureMeta
                instructor={lectureData.instructor}
                title={lectureData.title}
                category={lectureData.category}
            />
      <div className={styles.buttonContainer}>
        <button className={styles.primaryButton} onClick={() => navigate('/lecture/info')}>강의 소개 보러가기</button>
      </div>
      <Banner image={lectureData.bannerImage} />
      <Announcement content={lectureData.announcement} />
      <ScheduleList schedules={lectureData.schedules} isTeacher />
      {/* 일정 추가하기 */}
      <ScheduleForm classId={"1"} onScheduleAdded={() => window.location.reload()} />
  
      <StudentCount count={lectureData.studentCount} onViewStudents={() => navigate('/lecture/students')} />
      <InfoSection title="강의 목표" content={lectureData.objective} />
      <InfoSection title="강의 소개" content={lectureData.description} />
      <InfoSection title="강사 소개" content={lectureData.instructorInfo} />
      <InfoSection title="사전 준비 사항" content={lectureData.precourse} />
      <div className={styles.bottomButtons}>
        <button className={styles.editButton} onClick={() => navigate('/dashboard/edit')}>정보 수정하기</button>
        <button className={styles.deleteButton} onClick={handleDeleteClick}>강의 삭제하기</button>
      </div>
      <button className={styles.wideButton} onClick={() => navigate('/live/teacher')}>라이브 강의 시작</button>
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