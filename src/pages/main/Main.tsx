import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Navigation from '../../components/navigation/Navigation';


const Main: React.FC = () => {
  const navigate = useNavigate();

  // 더미 
  const popularClasses = [
    { classId: 11, name: '헤이즐리의 아트 클래스', bannerImage: '', instructor: '헤이즐리', category: '아트' },
    { classId: 12, name: '토니의 작명소', bannerImage: '', instructor: '토니', category: '작문' },
    { classId: 13, name: '주디 너무 귀여워요', bannerImage: '', instructor: '주디', category: '프로그래밍' },
    { classId: 14, name: '스티븐은 지렁이', bannerImage: '', instructor: '스티븐', category: '운동' },
  ]

  const toptenClasses = [
    { classId: 1, name: '모바일 앱 개발 실습', bannerImage: '', instructor: '첸', category: '개발' },
    { classId: 2, name: '기타 코드 마스터 클래스', bannerImage: '', instructor: '실비아', category: '음악' },
    { classId: 3, name: '초상화 그리기 워크숍', bannerImage: '', instructor: '테오', category: '미술' },
    { classId: 4, name: '프랑스 요리의 비밀', bannerImage: '', instructor: '앤디', category: '요리' },
    { classId: 5, name: '요가로 시작하는 하루', bannerImage: '', instructor: '엘', category: '운동' },
    { classId: 6, name: '초보자를 위한 DSLR 강의', bannerImage: '', instructor: '미아', category: '사진' },
    { classId: 7, name: '프랑스어 발음 마스터', bannerImage: '', instructor: '지키', category: '외국어' },
    { classId: 8, name: 'UX/UI 디자인의 기본', bannerImage: '', instructor: '에리카', category: '디자인' },
    { classId: 9, name: '천문학 입문', bannerImage: '', instructor: '제이미', category: '과학' },
    { classId: 10, name: '리더십 기초 트레이닝', bannerImage: '', instructor: '홍', category: '비즈니스 스킬' },
  ]

  return (
      <div className={styles.container}>
        <section className={styles.adSection}>
          <Advertisement />
        </section>

        <section className={styles.liveSection}>
          <h1 className={styles.sectionTitle}>인기를 끌고 있는 라이브 강의! 지금 바로 수강 레쯔ㅋ고</h1>
          <span className={styles.link} onClick={() => navigate('/lecture/live-list')}>
            라이브 중인 강의 보러 가기 &gt;
          </span>
          <div className={styles.lectureGrid}>
            {popularClasses.map((lecture) => (
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

        <section className={styles.toptenSection}>
          <h1 className={styles.sectionTitle}>수강생이 많은 강의 Top10</h1>
          <span className={styles.link} onClick={() => navigate('/lecture/list')}>
            전체 강의 보러 가기 &gt;
          </span>
          <div className={styles.lectureGrid}>
            {toptenClasses.map((lecture) => (
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
        <Navigation />
      </div>
  );
};

export default Main;