// #D-1: LectureList (/list) - 전체 강의 리스트 페이지 (현재 개설된 강의 조회, 카테고리)
import React, { useState } from 'react';
import Advertisement from '../../../components/advertisement/Advertisement';
import LectureCard from '../../../components/lecture-card/LectureCard';
import Category from '../../../components/category/Category';
import Navigation from '../../../components/navigation/Navigation';
import styles from './LectureList.module.css';
import { Container } from '../../../styles/GlobalStyles';

const LectureList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 더미 데이터
  const lectures = [
    { classId: 1, name: '강의 제목 1', bannerImage: '', instructor: '강사 이름 1', category: '프로그래밍' },
    { classId: 2, name: '강의 제목 2', bannerImage: '', instructor: '강사 이름 2', category: '음악' },
    { classId: 3, name: '강의 제목 3', bannerImage: '', instructor: '강사 이름 3', category: '요리' },
    { classId: 4, name: '강의 제목 4', bannerImage: '', instructor: '강사 이름 4', category: '미술' },
    { classId: 1, name: '모바일 앱 개발 실습', bannerImage: '', instructor: '첸', category: '개발' },
    { classId: 2, name: '기타 코드 마스터 클래스', bannerImage: '', instructor: '실비아', category: '음악' },
    { classId: 3, name: '초상화 그리기 워크숍', bannerImage: '', instructor: '테오', category: '미술' },
    { classId: 4, name: '프랑스 요리의 비밀', bannerImage: '', instructor: '앤디', category: '요리' },
    { classId: 5, name: '요가로 시작하는 하루', bannerImage: '', instructor: '엘', category: '운동' },
    { classId: 6, name: '초보자를 위한 DSLR 강의', bannerImage: '', instructor: '미아', category: '사진' },
    { classId: 7, name: '프랑스어 발음 마스터', bannerImage: '', instructor: '준', category: '외국어' },
    { classId: 8, name: 'UX/UI 디자인의 기본', bannerImage: '', instructor: '에리카', category: '디자인' },
    { classId: 9, name: '천문학 입문', bannerImage: '', instructor: '제이미', category: '과학' },
    { classId: 10, name: '리더십 기초 트레이닝', bannerImage: '', instructor: '홍', category: '비즈니스 스킬' },
  ];

  const filteredLectures = selectedCategory === 'All' 
  ? lectures 
  : lectures.filter(lecture => lecture.category === selectedCategory);

  return (
    <Container>
      <section className={styles.adSection}>
        <Advertisement />
      </section>

      <section className={styles.filterSection}>
        <Category 
          selected={selectedCategory} 
          onChange={setSelectedCategory} 
        />
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