// #E-1: LiveList (/live-list) - 라이브 강의 조회 페이지 (현재 라이브 중인 강의, 카테고리)
import React, { useState, useEffect, useCallback } from 'react';
import LectureCard from '../../../components/lecture-card/LectureCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveList.module.css';
import { Container, Space, Divider } from '../../../styles/GlobalStyles';
import Advertisement from 'components/advertisement/Advertisement';

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
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1184);
  const isBlackBackground = true;
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1184);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리, 필터 적용)
  const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}&target=live`;

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

        setLectures((prevLectures) => [...prevLectures, ...classes]);
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

  useEffect(() => {
    setLectures([]);
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0);
  }, [fetchLectures]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (page === 0) {
      setLectures([]);
    }

    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
  }, [page, fetchLectures, selectedCategory]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0);
  };

  return (
    <Container isBlackBackground={isBlackBackground}>
      <Advertisement />
      <Divider />
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

      <section className={styles.lectureSection}>
        <Space height={"40px"} />
        <div>
          <h1 className={styles.sectionTitle}>
            🔴 Live: 모두가 주목하는 실시간 라이브 강의
          </h1>
        </div>
        <Space height={"32px"} />

        <div className={styles.lectureGrid}>
          {lectures.map((lecture) => (
            <LectureCard
              key={lecture.classId}
              classId={lecture.classId}
              bannerImage={lecture.bannerImage}
              name={lecture.name}
              instructor={lecture.instructor}
              category={lecture.category}
            />
          ))}
        </div>

      </section>

      {isLoading && <p>Loading more lectures...</p>}
    </Container>
  );
};

export default LiveList;
