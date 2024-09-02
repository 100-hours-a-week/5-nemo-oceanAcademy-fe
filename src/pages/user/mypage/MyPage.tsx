// #C-1: MyPage(/mypage) - 사용자 페이지 (프로필 수정, 내가 개설한 강의 조회, 강의 개설 페이지로 이동)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import LectureCard from '../../../components/lecture-card/LectureCard';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './MyPage.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';
import emptyImage from '../../../assets/images/empty.png';
import profImage from '../../../assets/images/profile_default.png';

// 기본 이미지 배열
const defaultImages = [
  '/classroom/image1.png',
  '/classroom/image2.png',
  '/classroom/image3.png',
  '/classroom/image4.png',
  '/classroom/image5.png',
  '/classroom/image6.png',
  '/classroom/image7.png',
  '/classroom/image8.png',
  '/classroom/image9.png',
  '/classroom/image10.png',
];

interface Lecture {
    classId: number;
    name: string;
    bannerImage: string | null;
    instructor: string;
    category: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('닉네임');
  const [profilePic, setProfilePic] = useState('');
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // 스크롤 시 데이터 가져오는 상태
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    axios.get(`${endpoints.classes}?target=created?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log('내가 개설한 강의 정보: ', response.data.data);
      console.log(response.data.message_kor);
      console.log(response.data.message_eng);

      const classes = response.data.data.map((item: any) => ({
        classId: item.id,
        name: item.name,
        bannerImage: item.banner_image_path || defaultImages[Math.floor(Math.random() * defaultImages.length)],
        instructor: item.instructor,
        category: item.category
      }));
      setLectures(classes);
    })
    .catch(error => {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error('Failed to fetch created classes:', error);
      }
    });
  }, []);

  /* 무한 스크롤 적용 - 나중에 
    const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true); // 스크롤 요청 중
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}`;

      // 카테고리가 선택된 경우 URL에 category 파라미터 추가
      if (categoryId && categoryId !== 0) {
        url += `&category=${categoryId}`;
      }

      console.log("Request URL:", url); // URL 확인을 위해 로그 추가

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const lecturesData = response.data.data;
      console.log("Response data:", response.data);
      console.log(response.data.message_kor);

      if (lecturesData && lecturesData.length > 0) {
        console.log("Fetched lectures:", lecturesData);

        const classes = lecturesData.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[Math.floor(Math.random() * defaultImages.length)],
          instructor: item.instructor,
          category: item.category,
        }));

        setLectures((prevLectures) => [...prevLectures, ...classes]); // 이전 강의에 이어서 추가
        setHasMore(classes.length > 0); // 추가된 강의가 없으면 더 이상 불러올 강의가 없다고 설정
      } else {
        console.log("더 불러올 데이터 없음! 목록 끝 ");
        setHasMore(false); // 데이터가 없을 때 더 이상 불러올 강의 없음
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch lectures:', error.message); // 오류 메시지 확인
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);
  */

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleAddLectureClick = () => {
    navigate('/lecture/open');
  };

  const handleLectureClick = (classId: number) => {
    navigate(`/dashboard/teacher/${classId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <img 
          src={profImage} 
          alt="Profile" 
          className={isEditing ? styles.profilePictureEditing : styles.profilePicture} 
        />
        {isEditing ? (
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className={styles.usernameInput} 
          />
        ) : (
          <p className={styles.username}>{username}</p>
        )}
        {isEditing ? (
          <Button text="완료" onClick={handleSaveClick} />
        ) : (
          <button className={styles.editButton} onClick={handleEditClick}>✏️</button>
        )}
      </div>

      <div className={styles.lecturesHeader}>
        <h3>내가 개설한 강의</h3>
        <button className={styles.addLectureButton} onClick={handleAddLectureClick}>+</button>
      </div>

      {lectures.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>아직 강의를 개설하지 않았어요.</p>
          <p>+ 버튼을 눌러 강의를 시작해보세요!</p>
          <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
        </div>
      ) : (
        <div className={styles.lectureGrid}>
          {lectures.map((lecture) => (
            <div key={lecture.classId} onClick={() => handleLectureClick(lecture.classId)}>
              <LectureCard 
                classId={lecture.classId} 
                bannerImage={lecture.bannerImage} 
                name={lecture.name} 
                instructor={lecture.instructor} 
                category={lecture.category}
                onClick={() => navigate(`/dashboard/student/${lecture.classId}`)}
              />
            </div>
          ))}
        </div>
      )}
      <Navigation />
    </div>
  );
};

export default MyPage;