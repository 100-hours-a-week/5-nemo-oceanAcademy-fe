// #D-1: LectureList (/list) - 전체 강의 리스트 페이지 (현재 개설된 강의 조회, 카테고리)
import React, { useEffect, useState, useCallback } from 'react';
import Advertisement from '../../../components/advertisement/Advertisement';
import LectureCard from '../../../components/lecture-card/LectureCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureList.module.css';
import { Container } from '../../../styles/GlobalStyles';

// import images
import emptyImage from '../../../assets/images/utils/empty.png';
import image1 from '../../../assets/images/banner/image1.png';
import image2 from '../../../assets/images/banner/image2.jpeg';
import image3 from '../../../assets/images/banner/image3.png';
import image4 from '../../../assets/images/banner/image4.png';
import image5 from '../../../assets/images/banner/image5.jpeg';
import image6 from '../../../assets/images/banner/image6.png';
import image7 from '../../../assets/images/banner/image7.png';
import image8 from '../../../assets/images/banner/image8.jpeg';
import image9 from '../../../assets/images/banner/image9.png';
import image10 from '../../../assets/images/banner/image10.jpeg';

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

const LectureList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(0); // 페이지 번호
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // 스크롤 시 데이터 가져오는 상태
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
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리 필터 적용)
  const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true); // 스크롤 요청 중
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}`;

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

        if (page === 0) {
          // 새 카테고리로 변경될 때는 강의 목록을 초기화
          setLectures(classes);
        } else {
          setLectures((prevLectures) => [...prevLectures, ...classes]); // 이전 강의에 이어서 추가
        }

        setHasMore(classes.length > 0);
      } else {
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
    setLectures([]);
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0);
  }, [selectedCategory,fetchLectures]);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1); // 페이지 증가
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    if (page === 0) {
      fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0); 
    } else {
      fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
    }
  }, [page, fetchLectures, selectedCategory]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0); // 카테고리 변경 시 페이지 0으로 리셋
  };

  return (
    <Container>
      <section className={styles.adSection}>
        <Advertisement size="large" />
      </section>

      <section className={styles.filterSection}>
        <CategorySelect
            selected={selectedCategory}
            onSelectCategory={handleCategoryChange}
            categories={categories}
        />
      </section>

      <section className={styles.lectureSection}>
        {isLoading && lectures.length === 0 ? (
            <p>Loading...</p>
        ) : lectures.length === 0 ? (
            <div className={styles.emptyContainer}>
              <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
              <h5>아직 강의가 없어요!</h5>
            </div>
        ) : (
            <div className={styles.lectureGrid}>
              {lectures.map((lecture, index) => (
                  <LectureCard
                      key={`${lecture.classId}-${index}`} // classId와 index를 조합해 고유한 key 생성
                      classId={lecture.classId}
                      bannerImage={lecture.bannerImage}
                      name={lecture.name}
                      instructor={lecture.instructor}
                      category={lecture.category}
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

export default LectureList;
