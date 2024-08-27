// #A-1: Main (/) - 메인 화면/랜딩페이지 
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
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

const Main: React.FC = () => {
  const navigate = useNavigate();
  const [liveClasses, setLiveClasses] = useState<Lecture[]>([]);
  const [topTenClasses, setTopTenClasses] = useState<Lecture[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    // TODO: 더미 데이터 삭제하고 
    const dummyyClasses = [
      { classId: 11, name: '헤이즐리의 아트 클래스', bannerImage: bn, instructor: '헤이즐리', category: '아트' },
      { classId: 12, name: '토니의 작명소', bannerImage: bn, instructor: '토니', category: '작문' },
      { classId: 13, name: '주디 너무 귀여워요', bannerImage: bn, instructor: '주디', category: '프로그래밍' },
      { classId: 14, name: '스티븐은 지렁이', bannerImage: bn, instructor: '스티븐', category: '운동' },
    ]

    const dummyClasses = [
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
  
  // 데이터를 가져오는 공통 함수
  const fetchLectures = async (target: string, setState: React.Dispatch<React.SetStateAction<Lecture[]>>) => {
    try {
      const response = await axios.get(`${endpoints.getLectures}?target=${target}`);
      const classes = response.data.classes.map((item: any) => ({
        classId: item.class_id,
        name: item.name,
        bannerImage: item.banner_image,
        instructor: item.instructor,
        category: item.category
      }));
      setState(classes);
    } catch (err) {
      setError('Failed to fetch classes.');
      console.error(`Failed to fetch ${target} classes:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures('live', setLiveClasses);
    fetchLectures('topten', setTopTenClasses);
  }, []);

  // 로딩 관리 - 나중에 디자인 잡기 
  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
      <div className={styles.container}>
        <section className={styles.adSection}>
          <Advertisement />
        </section>

        <section className={styles.liveSection}>
          <h1 className={styles.sectionTitle}>
            인기를 끌고 있는 라이브 강의!<br/> 지금 바로 수강 레쯔ㅋ고
          </h1>
          <span className={styles.link} onClick={() => navigate('/live-list')}>
            라이브 중인 강의 보러 가기 &gt;
          </span>
          <div className={styles.lectureGrid}>
            {dummyyClasses.slice(0, 4).map((lecture) => (
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
            {dummyClasses.map((lecture) => (
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