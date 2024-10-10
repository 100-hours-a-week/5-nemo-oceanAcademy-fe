// #F-1: Classroom (/classroom) - 수강 중인 강의
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LectureCard from '../../../components/lecture-card/LectureCard';
import EmptyContent from 'components/empty-content/EmptyContent';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './Classroom.module.css';
import { Container, Space, Row, Column } from '../../../styles/GlobalStyles';

// import images
import emptyImage from '../../../assets/images/utils/empty.png';
import editImage from '../../../assets/images/icon/edit.svg';

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string | null;
  instructor: string;
  category: string;
}

interface Category {
  id: number;
  name: string;
}

const Classroom: React.FC = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = localStorage.getItem('accessToken');

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoryResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // 수강 중인 강의 목록 가져오기 API 요청 (페이지와 카테고리 필터 적용)
  const fetchEnrolledLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true); // 스크롤 요청 중
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}&target=enrolled`;
      // 카테고리가 선택된 경우 URL에 category 파라미터 추가
      if (categoryId && categoryId !== 0) {
        url += `&category=${categoryId}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const lecturesData = response.data.data;
      if (lecturesData && lecturesData.length > 0) {
        const classes = lecturesData.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path,
          instructor: item.instructor,
          category: item.category,
        }));

        setLectures(prevLectures => page === 0 ? classes : [...prevLectures, ...classes]);
        setHasMore(classes.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      // 오류 타입 확인 및 메시지 출력
      if (error instanceof Error) {
        console.error('Failed to fetch enrolled lectures:', error.message); // 오류 메시지 확인
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [token]);

  // 페이지나 카테고리가 변경될 때 강의 목록 다시 불러오기
  useEffect(() => {
    setLectures([]); // 강의 목록 초기화
    fetchEnrolledLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0);
  }, [selectedCategory, fetchEnrolledLectures]);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    if (page === 0) {
      fetchEnrolledLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0); 
    } else {
      fetchEnrolledLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
    }
  }, [page, fetchEnrolledLectures, selectedCategory]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0);
  };

  const handleLectureClick = (classId: number) => {
    navigate(`/dashboard/student/${classId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/');
  };

  const handleClass = () => {
    navigate('/mypage');
  }

  const handleClassroom = () => {
    navigate('/classroom');
  }

  const handleEdit = () => {
    navigate('/edit-info');
  }

  return (
    <Container>
      <Space height={"40px"} />
      <section className={styles.filterSection}>
        <div className={styles.categoryList}>
          <button
            className={`${styles.categoryButton} ${selectedCategory === '전체' ? styles.active : ''}`}
            onClick={() => handleCategoryChange('전체')}
          >
            전체
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${selectedCategory === category.name ? styles.active : ''}`}
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      <Space height={"48px"} />
      <Row>
        <div className={styles.user}>
          <Row align={"fill"}>
            <h3>강좌 관리 by {nickname}</h3>
            <img src={editImage} className={styles.editIcon} onClick={handleEdit} alt="Edit Button" /> 
          </Row>
          <Space height={"32px"} />
          <button className={styles.myClassesButton} onClick={handleClass}>
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
            <h1>내가 수강 중인 강의 <span className={styles.blueText}>{lectures.length}</span>개</h1>
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
                      category={lecture.category}
                      onClick={() => handleLectureClick(lecture.classId)} totalStudents={0} />
                  </div>
                ))}
              </div>
            )}
            </section>
            {isLoading && <p>Loading more lectures...</p>}
        </div>


      </Row>
    </Container>
  );
};

export default Classroom;