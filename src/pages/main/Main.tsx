// #A-1: Main (/) - 메인 화면/랜딩페이지 
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Navigation from '../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import styles from './Main.module.css';
import { Empty } from '../../styles/GlobalStyles';

// 기본 이미지 배열
const defaultImages = [
  '/classroom/image1.png',
  '/classroom/image2.png',
  '/classroom/image3.png',
  '/classroom/image4.png',
  '/classroom/image5.png',
  '/classroom/image6.png',
  '/classroom/image7.png',
  '/classroom/image8.png',
  '/classroom/image9.png',
  '/classroom/image10.png',
];

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string | null;
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
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  
  useEffect(() => {
    axios.get(`${endpoints.classes}?target=live?page=${page}`)
      .then(response => {
        console.log(response.data.data);
        console.log(response.data.message_kor);
        console.log(response.data.message_eng);
        const classes = response.data.data.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[Math.floor(Math.random() * defaultImages.length)],
          instructor: item.instructor,
          category: item.category
        }));
        
        setLiveClasses(classes);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message);
        } else {
          console.error('Failed to fetch live classes:', error);
        }
      });

    axios.get(`${endpoints.classes}?target=topten?page=${page}`)
      .then(response => {
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
          alert(error.response.data.message);
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