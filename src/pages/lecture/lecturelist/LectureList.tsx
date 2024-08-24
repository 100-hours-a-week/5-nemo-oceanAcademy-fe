// #D-1: LectureList (/list) - 전체 강의 리스트 페이지 (현재 개설된 강의 조회, 카테고리)
import React, { useEffect, useState } from 'react';
import Advertisement from '../../../components/advertisement/Advertisement';
import LectureCard from '../../../components/lecture-card/LectureCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import bn from '../../../assets/images/ad_big0.png';

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

const LectureList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  // const [lectures, setLectures] = useState<Lecture[]>([]);
  
  /*
  useEffect(() => {
    // 강의 목록 가져오기 API 요청
    axios.get(endpoints.getLectures)
      .then(response => {
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image, // 모든 강의의 배너 이미지를 bn으로 설정
          instructor: item.instructor,
          category: item.category
        }));
        setLectures(classes);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message); // 400 오류 발생 시 메시지 출력
        } else {
          console.error('Failed to fetch lectures:', error);
        }
      });
  }, []);

  const filteredLectures = selectedCategory === '' 
  ? lectures 
  : lectures.filter(lecture => lecture.category === selectedCategory);
*/

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
        <CategorySelect onSelectCategory={handleCategoryChange} />
      </section>

      <section className={styles.lectureGrid}>
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
      </section>

      <Navigation />
    </Container>
  );
};

export default LectureList;