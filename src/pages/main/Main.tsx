// #A-1: Main (/) - 메인 화면/랜딩페이지 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Navigation from '../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import styles from './Main.module.css';
import { Empty } from '../../styles/GlobalStyles';

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
  const [page, setPage] = useState(0); // 페이지 번호
  
  // 데이터를 가져오는 공통 함수
  useEffect(() => {
    // 라이브 강의 불러오기
    axios.get(`${endpoints.classes}?target=live?page=${page}`)
      .then(response => {
        // 200 OK일 경우
        console.log(response.data.data);
        console.log(response.data.message_kor);
        console.log(response.data.message_eng);
        const classes = response.data.data.map((item: any) => ({
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
    axios.get(`${endpoints.classes}?target=topten?page=${page}`)
      .then(response => {
        // 200 OK일 경우
        const classes = response.data.data.map((item: any) => ({
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
          <Empty height="10px" />
          <div className={styles.titleSection}>
            <h1 className={styles.sectionTitle}>
              인기를 끌고 있는 라이브 강의!<br/> 지금 바로 수강 레쯔ㅋ고
            </h1>
            <span className={styles.link} onClick={() => navigate('/live-list')}>
              라이브 중인 강의 보러 가기 &gt;
            </span>
          </div>
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
          <div className={styles.titleSection}>
            <h1 className={styles.sectionTitle}>수강생이 많은 강의 Top10</h1>
            <span className={styles.link} onClick={() => navigate('/list')}>
              전체 강의 보러 가기 &gt;
            </span>
          </div>
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