// #D-1: LectureList (/list) - 전체 강의 리스트 페이지 (현재 개설된 강의 조회, 카테고리)
import React, { useEffect, useState, useCallback } from 'react';
import Advertisement from '../../../components/advertisement/Advertisement';
import LectureCard from '../../../components/lecture-card/LectureCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureList.module.css';
import { Container, Space, Divider } from '../../../styles/GlobalStyles';

// import images
import emptyImage from '../../../assets/images/utils/empty.png';

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
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // 스크롤 시 데이터 가져오는 상태
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
          bannerImage: item.banner_image_path,
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

  // TO DO : selectedCategory 지우기 
  useEffect(() => {
    setLectures([]);
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0);
  }, [selectedCategory, fetchLectures]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  useEffect(() => {
    if (page === 0) {
      fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0); 
    } else {
      fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, page);
    }
  }, [page, fetchLectures, selectedCategory]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(0); // 카테고리 변경 시 페이지 0으로 리셋
  };


  if (isDesktop) {
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
              수강생이 많은 강의 TOP 10
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
  }

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
