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
            {liveClasses.slice(0, 4).map((lecture) => (
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
            {topTenClasses.map((lecture) => (
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