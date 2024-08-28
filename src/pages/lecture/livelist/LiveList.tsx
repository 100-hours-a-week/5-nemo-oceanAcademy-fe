import React, { useState, useEffect, useCallback } from 'react';
import LiveCard from '../../../components/lecture-card/LiveCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import emptyImage from '../../../assets/images/empty.png';

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

interface Category {
  id: number;
  name: string;
}

const LiveList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const token = localStorage.getItem('accessToken');

  // 카테고리 목록 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoryResponse.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리, 라이브 필터 적용)
  const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}&target=live`;

      // 카테고리가 선택된 경우 URL에 category 파라미터 추가
      if (categoryId && categoryId !== 0) {
        url += `&category=${categoryId}`;
      }

      console.log("Request URL:", url);

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response data:", response.data);

      if (response.data && response.data.length > 0) {
        console.log("Fetched lectures:", response.data);

        const classes = response.data.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image || defaultImages[Math.floor(Math.random() * defaultImages.length)],
          instructor: item.instructor,
          category: item.category,
        }));

        setLectures((prevLectures) => [...prevLectures, ...classes]);
        setHasMore(classes.length > 0);
      } else {
        console.log("No classes found");
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
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0); // 페이지 0부터 다시 불러오기
  }, [selectedCategory, fetchLectures]);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
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
        <div className={styles.header}>
          <h1 className={styles.title}>🔴 Live</h1>
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
                <h5>아직 강의가 없어요!</h5>
              </div>
          ) : (
              <div style={{"width":"100%"}}>
                <div className={styles.lectureGrid}>
                  {lectures.map((lecture, index) => (
                      <LiveCard
                          key={`${lecture.classId}-${index}`}
                          classId={lecture.classId}
                          bannerImage={lecture.bannerImage ?? defaultImages[Math.floor(Math.random() * defaultImages.length)]} // null일 경우 기본 이미지 적용
                          name={lecture.name}
                          instructor={lecture.instructor}
                          category={lecture.category}
                      />
                  ))}
                </div>
              </div>

          )}
        </section>
        {isLoading && <p>Loading more lectures...</p>}
        <Navigation />
      </Container>
  );
};

export default LiveList;
