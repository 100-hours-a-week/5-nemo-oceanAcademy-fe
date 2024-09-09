// #F-1: Classroom (/classroom) - 수강 중인 강의
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CategorySelect from 'components/category-select/CategorySelect';
import LectureCard from '../../../components/lecture-card/LectureCard';
import Button from '../../../components/button/Button';
import Navigation from 'components/navigation/Navigation';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './Classroom.module.css';
import { Container } from '../../../styles/GlobalStyles';

// import images
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

const Classroom: React.FC = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    // 카테고리 목록 가져오기
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
        alert('카테고리 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchCategories();
  }, [token]);

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
          bannerImage: item.banner_image_path || defaultImages[item.id % 10],
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
    fetchEnrolledLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
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

  return (
    <Container>
      <div className={styles.header}>
        <h1 className={styles.title}>📝 I'm Learning.. </h1>
        <CategorySelect 
          selected={selectedCategory} 
          onSelectCategory={handleCategoryChange}
          categories={categories}
        />
      </div>

      <section className={styles.lectureSection}>
        {isLoading && lectures.length === 0 ? (
          <p>Loading...</p>
        ) : lectures.length === 0 ? (
          <div className={styles.emptyContainer}>
            <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
            <h5>아직 수강 중인 강의가 없어요!</h5>
            <Button text="수강 신청하러 가기" onClick={() => navigate('/list')} />
          </div>
        ) : (
          <div className={styles.lectureGrid}>
            {lectures.map((lecture, index) => (
              <LectureCard
                key={`${lecture.classId}-${index}`}
                classId={lecture.classId}
                bannerImage={lecture.bannerImage}
                name={lecture.name}
                instructor={lecture.instructor}
                category={lecture.category}
                onClick={() => navigate(`/dashboard/student/${lecture.classId}`)}
              />
            ))}
            </div>
          )}
      </section>
      {isLoading && <p>Loading more lectures...</p>}
      <Navigation />
    </Container>
  );
};

export default Classroom;