// #C-1: MyPage(/mypage) - 사용자 페이지 (프로필 수정, 내가 개설한 강의 조회, 강의 개설 페이지로 이동)
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import LectureCard from '../../../components/lecture-card/LectureCard';
import EmptyContent from '../../../components/empty-content/EmptyContent';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './MyPage.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';

// import images
import profImage from '../../../assets/images/profile/profile_default.png';
import emptyImage from '../../../assets/images/utils/empty.png';
import image1 from '../../../assets/images/banner/image1.png';
import image2 from '../../../assets/images/banner/image2.png';
import image3 from '../../../assets/images/banner/image3.png';
import image4 from '../../../assets/images/banner/image4.png';
import image5 from '../../../assets/images/banner/image5.png';
import image6 from '../../../assets/images/banner/image6.png';
import image7 from '../../../assets/images/banner/image7.png';
import image8 from '../../../assets/images/banner/image8.png';
import image9 from '../../../assets/images/banner/image9.png';
import image10 from '../../../assets/images/banner/image10.png';

// 기본 이미지 배열
const defaultImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];

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

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [nickname, setNickname] = useState('닉네임');
  const [profilePic, setProfilePic] = useState('');
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoryResponse.data || []);
        console.log('/live-list 카테고리 조회 성공!');
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}&target=created`;

      if (categoryId && categoryId !== 0) {
        url += `&category=${categoryId}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const lecturesData = response.data.data;
      console.log("Response data:", response.data);

      if (lecturesData && lecturesData.length > 0) {
        console.log("Fetched lectures:", lecturesData);

        const classes = lecturesData.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[item.id % 10],
          instructor: item.instructor,
          category: item.category,
        }));

        setLectures((prevLectures) => [...prevLectures, ...classes]);
        setHasMore(classes.length > 0);
      } else {
        console.log("더 이상 로드할 클래스 없음!");
        setHasMore(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch lectures:', error.message);
      } else {
        console.error('An unknown error occurred:', error);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

   // 페이지나 카테고리가 변경될 때 강의 목록 다시 불러오기
   useEffect(() => {
    setPage(0); // 페이지 번호를 0으로 초기화
    fetchLectures(categories.find((cat) => cat.name === selectedCategory)?.id || 0, 0); // 첫 페이지 강의 목록 불러오기
  }, [selectedCategory, fetchLectures]);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1); // 페이지 증가
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    if (page > 0) {
      fetchLectures(categories.find((cat) => cat.name === selectedCategory)?.id || 0, page);
    }
  }, [page, fetchLectures, selectedCategory]);

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
            value={nickname} 
            onChange={(e) => setUsername(e.target.value)} 
            className={styles.usernameInput} 
          />
        ) : (
          <p className={styles.username}>{nickname}</p>
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