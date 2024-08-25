// #D-1: LectureList (/list) - 전체 강의 리스트 페이지 (현재 개설된 강의 조회, 카테고리)
import React, { useEffect, useState } from 'react';
import Advertisement from '../../../components/advertisement/Advertisement';
import LectureCard from '../../../components/lecture-card/LectureCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import bn from '../../../assets/images/ad_big0.png';
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

const LectureList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {    
    // 카테고리 목록 가져오기 
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories);
        setCategories(categoryResponse.data.categories || []); // 기본값 빈 배열 
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // 오류 시 빈 배열 설정 
        // alert('카테고리 정보를 가져오는 데 실패했습니다.');
      }
    };

    // 강의 목록 가져오기 API 요청
    const fetchLectures = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(endpoints.getLectures);
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image,
          instructor: item.instructor,
          category: item.category,
        }));
        setLectures(classes || []); // 기본값 빈 배열
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          }
        } else {
          console.error('Failed to fetch lectures:', error);
        }
        setLectures([]); // 오류 시 빈 배열 설정 
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchLectures();
  }, []);


  /*
  // 더미 데이터 -> 삭제 예정, 변수 이름 변경 잊지 말기 
  const lectures = [
    { classId: 1, name: '제목은 24자까지입니다', bannerImage: bn, instructor: '세바스찬', category: '가드닝' },
    { classId: 2, name: '아 왜 안되지', bannerImage: bn, instructor: 'mia', category: '음악' },
    { classId: 3, name: '나는 왜...', bannerImage: bn, instructor: 'mui', category: '요리' },
    { classId: 4, name: '그래도 리액트 사랑하시죠?', bannerImage: bn, instructor: '송강호', category: '미술' },
    { classId: 5, name: '모바일 앱 개발 실습', bannerImage: bn, instructor: '첸', category: '개발' },
    { classId: 6, name: '기타 코드 마스터 클래스', bannerImage: bn, instructor: '실비아', category: '음악' },
    { classId: 7, name: '초상화 그리기 워크숍', bannerImage: bn, instructor: '테오', category: '미술' },
    { classId: 8, name: '프랑스 요리의 비밀', bannerImage: bn, instructor: '앤디', category: '요리' },
    { classId: 9, name: '요가로 시작하는 하루', bannerImage: bn, instructor: '엘', category: '운동' },
    { classId: 10, name: '초보자를 위한 DSLR 강의', bannerImage: bn, instructor: '미아', category: '사진' },
    { classId: 11, name: '프랑스어 발음 마스터', bannerImage: bn, instructor: '준', category: '외국어' },
    { classId: 12, name: 'UX/UI 디자인의 기본', bannerImage: bn, instructor: '에리카', category: '디자인' },
    { classId: 13, name: '천문학 입문', bannerImage: bn, instructor: '제이미', category: '과학' },
    { classId: 14, name: '리더십 기초 트레이닝', bannerImage: bn, instructor: '홍', category: '비즈니스 스킬' },
  ];
  */

  const filteredLectures = selectedCategory === '전체 카테고리'
  ? lectures
  : lectures.filter(lecture => lecture.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
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
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredLectures.length === 0 ? (
          <div className={styles.emptyContainer}>
            <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
            <h5>아직 강의가 없어요!</h5>
            {/* 아직 이 카테고리의 강의가 없어요. */}
          </div>
        ) : (
          <div className={styles.lectureGrid}>
            {filteredLectures.map((lecture) => (
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
        )}
      </section>
      <Navigation />
    </Container>
  );
};

export default LectureList;