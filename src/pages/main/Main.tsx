import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Navigation from '../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import bn from '../../assets/images/ad_big0.png';

interface Lecture {
  classId: number; // `class_id`로부터 매핑
  name: string;
  bannerImage: string; // `banner_image`로부터 매핑
  instructor: string;
  category: string;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [liveClasses, setLiveClasses] = useState<Lecture[]>([]);
  const [topTenClasses, setTopTenClasses] = useState<Lecture[]>([]);

    // TODO: 더미 데이터 삭제하고 
    const popularClasses = [
      { classId: 11, name: '헤이즐리의 아트 클래스', bannerImage: bn, instructor: '헤이즐리', category: '아트' },
      { classId: 12, name: '토니의 작명소', bannerImage: bn, instructor: '토니', category: '작문' },
      { classId: 13, name: '주디 너무 귀여워요', bannerImage: bn, instructor: '주디', category: '프로그래밍' },
      { classId: 14, name: '스티븐은 지렁이', bannerImage: bn, instructor: '스티븐', category: '운동' },
    ]
  
    const toptenClasses = [
      { classId: 1, name: '모바일 앱 개발 실습', bannerImage: bn, instructor: '첸', category: '개발' },
      { classId: 2, name: '기타 코드 마스터 클래스', bannerImage: bn, instructor: '실비아', category: '음악' },
      { classId: 3, name: '초상화 그리기 워크숍', bannerImage: bn, instructor: '테오', category: '미술' },
      { classId: 4, name: '프랑스 요리의 비밀', bannerImage: bn, instructor: '앤디', category: '요리' },
      { classId: 5, name: '요가로 시작하는 하루', bannerImage: bn, instructor: '엘', category: '운동' },
      { classId: 6, name: '초보자를 위한 DSLR 강의', bannerImage: bn, instructor: '미아', category: '사진' },
      { classId: 7, name: '프랑스어 발음 마스터', bannerImage: bn, instructor: '준', category: '외국어' },
      { classId: 8, name: 'UX/UI 디자인의 기본', bannerImage: bn, instructor: '에리카', category: '디자인' },
      { classId: 9, name: '천문학 입문', bannerImage: bn, instructor: '제이미', category: '과학' },
      { classId: 10, name: '리더십 기초 트레이닝', bannerImage: bn, instructor: '홍', category: '비즈니스 스킬' },
      { classId: 11, name: '미모 켠왕', bannerImage: bn, instructor: '릴리', category: '과학' }
    ]

  // 랜덤으로 4개의 강의를 선택하는 함수
  const getRandomLectures = (lectures: Lecture[], count: number): Lecture[] => {
    const shuffled = [...lectures].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

  useEffect(() => {
    // 라이브 강의 불러오기
    axios.get(`${endpoints.getLectures}?target=live`)
      .then(response => {
        // 200 OK일 경우
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image,
          instructor: item.instructor,
          category: item.category
        }));
        setLiveClasses(classes);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message); // 400 오류 발생 시 메시지 출력
        } else {
          console.error('Failed to fetch live classes:', error);
        }
      });

    // TOP 10 강의 불러오기
    axios.get(`${endpoints.getLectures}?target=topten`)
      .then(response => {
        // 200 OK일 경우
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image,
          instructor: item.instructor,
          category: item.category
        }));
        setTopTenClasses(classes);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message); // 400 오류 발생 시 메시지 출력
        } else {
          console.error('Failed to fetch top ten classes:', error);
        }
      });
  }, []);

  return (
      <div className={styles.container}>
        <section className={styles.adSection}>
          <Advertisement />
        </section>

        <section className={styles.liveSection}>
          <h1 className={styles.sectionTitle}>인기를 끌고 있는 라이브 강의!<br/> 지금 바로 수강 레쯔ㅋ고</h1>
          <span className={styles.link} onClick={() => navigate('/live-list')}>
            라이브 중인 강의 보러 가기 &gt;
          </span>
          <div className={styles.lectureGrid}>
            {popularClasses.slice(0, 4).map((lecture) => (
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
          <span className={styles.link} onClick={() => navigate('/list')}>
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