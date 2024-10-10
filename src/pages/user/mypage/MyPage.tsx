// #C-1: MyPage(/mypage) - 사용자 페이지 (내가 개설한 강의 조회, 강의 개설 페이지로 이동)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import Modal from 'components/modal/Modal';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import LectureCard from '../../../components/lecture-card/LectureCard';
import EmptyContent from '../../../components/empty-content/EmptyContent';
import styles from './MyPage.module.css';
import { Container, Space, Row, Column } from '../.\./../styles/GlobalStyles';

// import images
import editImage from '../../../assets/images/icon/edit.svg';
import addImage from '../../../assets/images/icon/add.svg';
import profile1 from '../../../assets/images/profile/crab.png';
import profile2 from '../../../assets/images/profile/jellyfish.png';
import profile3 from '../../../assets/images/profile/seahorse.png';
import profile4 from '../../../assets/images/profile/turtle.png';
import profile5 from '../../../assets/images/profile/whale.png';

const profileImages = [ profile1, profile2, profile3, profile4, profile5 ];

interface Lecture {
    classId: number;
    name: string;
    bannerImage: string | null;
    instructor: string | null;
    totalStudents: number,
    category: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.data;
          setNickname(userData.nickname);
          setEmail(userData.email || '이메일 정보 없음');
          setProfileImage(userData.profile_image_path ? userData.profile_image_path : getProfileImage(nickname));
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.status === 401) {
          alert('사용자 인증에 실패했습니다. 다시 로그인하세요.');
          navigate('/login');
        } else {
          console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', axiosError.message);
        }
      }
    };

    fetchUserInfo();
  }, [navigate, token]);

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리, 필터 적용)
  const fetchLectures = useCallback(async ( page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      const response = await axios.get(`${endpoints.classes}?page=${page}&target=created`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const lecturesData = response.data.data;
      console.log(lecturesData);

      if (lecturesData && lecturesData.length > 0) {
        const classes = response.data.data.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path,
          totalStudents: item.student_count,
          category: item.category
        }));

        setLectures((prevLectures) => [...prevLectures, ...classes]);
        setHasMore(classes.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch lectures:', error.message);
      } else {
        console.error('Failed to fetch created classes:', error);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (page === 0) {
      setLectures([]);
    }

    fetchLectures(page);
  }, [page, fetchLectures]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleAddLectureClick = () => {
    navigate('/lecture/open');
  };

  const handleLectureClick = (classId: number) => {
    navigate(`/dashboard/teacher/${classId}`);
  };

  const handleEditClick = (classId: number) => {
    return () => {
      navigate(`/dashboard/edit/${classId}`);   
    }
  };

  const handleLectureDelete = async (classId: number) => {
    try {
      const response = await axios.delete(endpoints.deleteLecture.replace('{classId}', classId.toString()), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert('강의가 삭제되었습니다😢');
        window.location.reload();
      } else {
        alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
      alert('강의 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
    console.log(`강의 ${classId} 삭제`);
    setShowDeleteModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleClassroom = () => {
    navigate('/classroom');
  }

  const handleEdit = () => {
    navigate('/edit-info');
  }

  const breadcrumbItems = [
    { label: '홈', link: '/' },
    { label: '내 강의실', link: '/mypage' },
    { label: '내가 수강 중인 강의', link: '/mypage' }
  ];

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />

      <Space height={"48px"} />
      <Row>
        <div className={styles.user}>
          <Row align={"fill"}>
            <h3>강좌 관리 by {nickname}</h3>
            <img src={editImage} className={styles.editIcon} onClick={handleEdit} alt="Edit Button" /> 
          </Row>
          <Space height={"32px"} />
          <button className={styles.myClassesButton}>
            내가 개설한 강의
          </button>
          <button className={styles.myClassroomButton} onClick={handleClassroom}>
            내가 수강 중인 강의
          </button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            로그아웃
          </button>
        </div>

        <div className={styles.class}>

          <div className={styles.classHeader}>
            <h1>내가 개설한 강의 <span className={styles.blueText}>{lectures.length}</span>개</h1>
            <div className={styles.lectureOpen}>
              <h5>강의 개설하기</h5>
              <button onClick={handleAddLectureClick}>
                <img src={addImage} alt="Lecture Open Button" />
              </button>
            </div>
          </div>                  

          <section>
            {lectures.length === 0 ? (
              <EmptyContent />
            ) : (
              <div className={styles.lectureGrid}>
                {lectures.map((lecture) => (
                  <div key={lecture.classId}>
                    <LectureCard 
                      classId={lecture.classId} 
                      bannerImage={lecture.bannerImage} 
                      name={lecture.name}
                      instructor={null} 
                      totalStudents={lecture.totalStudents}
                      category={lecture.category}
                      isMyPage={true}
                      onClick={() => handleLectureClick(lecture.classId)}
                    />

                    <div className={styles.buttonContainer}>
                      <button className={styles.editButton} onClick={handleEditClick(lecture.classId)}>수정</button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => {
                          setSelectedClassId(lecture.classId);
                          setShowDeleteModal(true);
                        }}>
                          삭제
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </section>
            {isLoading && <p>Loading more lectures...</p>}
        </div>
      </Row>
      {showDeleteModal && (
        <Modal
          title="강의를 삭제하시겠습니까?"
          content={(
            <>
              삭제한 강의는 복구할 수 없습니다. <br />
              그래도 삭제하시겠습니까?
            </>
          )}
          rightButtonText="강의 삭제"
          onRightButtonClick={() => {
            if (selectedClassId !== null) {
              handleLectureDelete(selectedClassId);
            } else {
              console.error('강의를 삭제할 수 없습니다: classId가 null입니다.');
            }
          }}
          onLeftButtonClick={() => setShowDeleteModal(false)}
        />
      )}
    </Container>
  );
};

export default MyPage;