// #J-1: DashboardTeacher (`/dashboard/teacher/${classId}`) - 강의 대시보드 강사용 페이지
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import StudentCount from '../../../components/dashboard/StudentCount';
import Modal from '../../../components/modal/Modal';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import styles from './DashboardTeacher.module.css';
import ScheduleForm from 'components/dashboard/ScheduleForm';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import { Container, Row, Column, Space } from '../../../styles/GlobalStyles';
import Button from '../../../components/button/Button';

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

const DashboardTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>(); 
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [studentCount, setStudentCount] = useState<number>(0);
  const token = localStorage.getItem('accessToken');
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184);

  const getProfileImage = (nickname: string): string => {
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % profileImages.length);
    return profileImages[index];
  };

  useEffect(()=>{
     // 윈도우 크기 변화 감지
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1184);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // window.history 로그 출력
  useEffect(() => {
    console.log('History Length:', window.history.length); // 스택에 저장된 페이지 수
    console.log('History State:', window.history.state); // 현재 state 정보
    console.log('History Object:', window.history); // history 객체 전체 정보

    // window.history.back(), window.history.forward()는 뒤로/앞으로 이동
    console.log('Can Go Back:', window.history.length > 1); // 이전 페이지가 있는지 확인
  }, []);
    
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboard(response.data.data);
        console.log(response.data.data);
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

  const breadcrumbItems = [
    { label: '홈', link: '/' },
    { label: '내 강의실', link: '/mypage' },
    { label: '내가 수강 중인 강의', link: '/mypage' }
  ];

  return (
    <div className={styles.wrapper}>
      {isMobile ? (
      <div className={styles.container}>
        {dashboard && (
          <>
            {dashboard.banner_image_path && (
              <div
                className={styles.banner}
                style={{ backgroundImage: `url(${dashboard.banner_image_path})` }}
              />)
            }
            
            <section className={styles.basicInfo}>
              <p className={styles.category}>
                {dashboard.category}
              </p>
              <div className={styles.row}>
                <div className={styles.title}>
                  {dashboard.name}
                </div>
                <button
                  className={styles.button}
                  onClick={() => navigate(`/live/teacher/${classId}`)}
                >
                  라이브 강의 시작
                </button>
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
        <div className={styles.bottomButtons}>
          <button className={styles.editButton} onClick={() => navigate(`/dashboard/edit/${classId}`)}>정보 수정하기</button>
          <button className={styles.deleteButton} onClick={handleDeleteClick}>강의 삭제하기</button>
        </div>
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
      </div>

      /*
      <Container>
        <ScheduleList schedules={schedules} isTeacher onDeleteSchedule={handleScheduleDelete} />
        <ScheduleForm classId={classId || ''} onScheduleAdded={handleScheduleAdded} />
        <StudentCount count={studentCount} onViewStudents={() => navigate(`/lecture/students/${classId}`)} />
      </Container>
    */
      ) : (<div>
        <div className={styles.desktopContainer}>
          <Breadcrumb items={breadcrumbItems} />
                {dashboard && (
                  /* 강의 소개 */
                  <>
                    <section className={styles.desktopBasicInfo}>
                    
                      <p className={styles.desktopInstructor}>{dashboard.instructor}</p>
                      <Space height={"16px"}/>

                      <div className={styles.desktopRow}>
                        <div>
                          <div className={styles.desktopTitle}>
                            {dashboard.name}
                          </div>
                          <Space height={"14px"}/>
                          <div className="linkContainer">
                            <Link to={`/lecture/info/${classId}`} className={styles.link}>
                              강의 소개 보러 가기
                              <img src={arrowIcon} alt="arrow icon" className={styles.linkIcon} />
                            </Link>
                          </div>
                        </div>
                        <div>
                        <Button backgroundColor={"#2A62F2"} text='라이브 강의 시작' onClick={() => navigate(`/live/teacher/${classId}`)} />
                        <Space height={"8px"}/>
                        <Button backgroundColor={"#FAFBFD"} color={"black"} text='강의 수정하기' onClick={() => navigate(`/dashboard/edit/${classId}`)} />
                        </div>
                      </div>

                    </section>
                    <Space height={"32px"}/>


                    {dashboard.banner_image_path && (
                      <div
                        className={styles.desktopBanner}
                        style={{ backgroundImage: `url(${dashboard.banner_image_path})` }}
                      />)
                    }
                    <Space height={"64px"}/>
                    
                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의 공지</div>
                            <div className={styles.desktopBoxContent}>
                            {dashboard.announcement ? dashboard.announcement : '공지가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"12px"}/>

                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의 소개</div>
                            <div className={styles.desktopBoxContent}>
                            {dashboard.description ? dashboard.description : '강의 소개가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"12px"}/>

                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의 목표</div>
                            <div className={styles.desktopBoxContent}>
                            {dashboard.object ? dashboard.object : '강의 목표가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"12px"}/>

                    {dashboard.prerequisite && (
                      <>
                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의에 필요한 사전 지식 및 준비 안내</div>
                            <div className={styles.desktopBoxContent}>
                            {dashboard.prerequisite}
                            </div>
                        </Column>
                    </div>
                    <Space height={"12px"}/>
                    </>)}

                  </>
                )}
                <Space height={"72px"}/>
                
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

              </div>

      </div>)}
  </div>
  );
};

export default DashboardTeacher;
