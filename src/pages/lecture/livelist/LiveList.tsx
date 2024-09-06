// #E-1: LiveList (/live-list) - 라이브 강의 조회 페이지 (현재 라이브 중인 강의, 카테고리)
import React, { useState, useEffect, useCallback } from 'react';
import LiveCard from '../../../components/lecture-card/LiveCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveList.module.css';
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

const LiveList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
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

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리, 필터 적용)
  const fetchLectures = useCallback(async (categoryId: number | null = null, page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      let url = `${endpoints.classes}?page=${page}&target=live`;

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
    setLectures([]);
    fetchLectures(categories.find(cat => cat.name === selectedCategory)?.id || 0, 0);
  }, [fetchLectures]);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    if (page === 0) {
      setLectures([]);
    }

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
                <img src={emptyImage} alt="No live lectures available" className={styles.emptyImage} />
                <h5>아직 라이브 강의가 없어요!</h5>
              </div>
          ) : (
              <div style={{"width":"100%"}}>
                <div className={styles.lectureGrid}>
                  {lectures.map((lecture, index) => (
                    <React.Fragment key={`${lecture.classId}-${index}`}>
                      <LiveCard
                        classId={lecture.classId}
                        bannerImage={lecture.bannerImage ?? defaultImages[Math.floor(Math.random() * defaultImages.length)]}
                        name={lecture.name}
                        instructor={lecture.instructor}
                        category={lecture.category}
                      />
                      {index < lectures.length - 1 && <hr className={styles.divider} />}
                    </React.Fragment>
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
