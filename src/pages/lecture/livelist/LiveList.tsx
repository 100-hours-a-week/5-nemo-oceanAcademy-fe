// #E-1: LiveList (/live-list) - 라이브 강의 조회 페이지 (현재 라이브 중인 강의, 카테고리)
import React, { useState, useEffect } from 'react';
import LiveCard from '../../../components/lecture-card/LiveCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import bn1 from '../../../assets/images/ad_big1.png';
import bn2 from '../../../assets/images/ad_big2.png';
import bn3 from '../../../assets/images/ad_big3.png';
import bn4 from '../../../assets/images/ad_big4.png';
import bn5 from '../../../assets/images/ad_big5.png';
import bn6 from '../../../assets/images/ad_big6.png';
import bn7 from '../../../assets/images/ad_big7.png';
import emptyImage from '../../../assets/images/empty.png';

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

interface Category {
  category_id: number;
  name: string;
}

const LiveList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 카테고리 목록 가져오기
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories);
        setCategories(categoryResponse.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // 오류 시 빈 배열 설정
        // alert('카테고리 정보를 가져오는 데 실패했습니다.');
      }
    };

    // 라이브 강의 목록 가져오기
    const fetchLiveLectures = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${endpoints.getLectures}?target=live`);
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image,
          instructor: item.instructor,
          category: item.category,
        }));
        setLectures(classes || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          }
        } else {
          console.error('Failed to fetch live lectures:', error);
        }
        setLectures([]); // 오류 시 빈 배열 설정
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchLiveLectures();
  }, []);

  // TO DO: 더미 데이터 삭제 후 liveLectures -> lectures로 이름 변경 
  const liveLectures = [
    { classId: 1, name: '제목은 24자까지입니다', bannerImage: bn1, instructor: '세바스찬', category: '가드닝' },
    { classId: 2, name: '아 왜 안되지', bannerImage: bn2, instructor: 'mia', category: '음악' },
    { classId: 3, name: '나는 왜...', bannerImage: bn3, instructor: 'mui', category: '요리' },
    { classId: 4, name: '그래도 리액트 사랑하시죠?', bannerImage: bn4, instructor: '송강호', category: '미술' },
    { classId: 5, name: '모바일 앱 개발 실습', bannerImage: bn5, instructor: '첸', category: '개발' },
    { classId: 6, name: '기타 코드 마스터 클래스', bannerImage: bn6, instructor: '실비아', category: '음악' },
    { classId: 7, name: '초상화 그리기 워크숍', bannerImage: bn7, instructor: '테오', category: '미술' },
    { classId: 8, name: '프랑스 요리의 비밀', bannerImage: bn1, instructor: '앤디', category: '요리' },
    { classId: 9, name: '요가로 시작하는 하루', bannerImage: bn2, instructor: '엘', category: '운동' },
    { classId: 10, name: '초보자를 위한 DSLR 강의', bannerImage: bn3, instructor: '미아', category: '사진' },
    { classId: 11, name: '프랑스어 발음 마스터', bannerImage: bn4, instructor: '준', category: '외국어' },
    { classId: 12, name: 'UX/UI 디자인의 기본', bannerImage: bn5, instructor: '에리카', category: '디자인' },
    { classId: 13, name: '천문학 입문', bannerImage: bn6, instructor: '제이미', category: '과학' },
    { classId: 14, name: '리더십 기초 트레이닝', bannerImage: bn7, instructor: '홍', category: '비즈니스 스킬' },
  ];

  /* TO DO: 더미 데이터 지우고 이걸로 대체 
  const filteredLectures = selectedCategory === '전체 카테고리'
    ? lectures
    : lectures.filter(lecture => lecture.category === selectedCategory);
  */

  const filteredLectures = selectedCategory === '전체 카테고리' 
    ? liveLectures 
    : liveLectures.filter(lecture => lecture.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
        {isLoading ? (
            <p>Loading...</p>
          ) : filteredLectures.length === 0 ? (
            <div className={styles.emptyContainer}>
              <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
              <p>아직 강의가 없어요!</p>
            </div>
          ) : (
            <div className={styles.lectureGrid}>
              {filteredLectures.map((lecture) => (
                <LiveCard
                  key={lecture.classId}
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
      <Navigation />
    </Container>
  );
};

export default LiveList;