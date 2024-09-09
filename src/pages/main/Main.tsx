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

// import images
import emptyImage from '../../assets/images/utils/empty.png';
import image1 from '../../assets/images/banner/image1.png';
import image2 from '../../assets/images/banner/image2.png';
import image3 from '../../assets/images/banner/image3.png';
import image4 from '../../assets/images/banner/image4.png';
import image5 from '../../assets/images/banner/image5.png';
import image6 from '../../assets/images/banner/image6.png';
import image7 from '../../assets/images/banner/image7.png';
import image8 from '../../assets/images/banner/image8.png';
import image9 from '../../assets/images/banner/image9.png';
import image10 from '../../assets/images/banner/image10.png';

// 기본 이미지 배열
const defaultImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
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
        const classes = response.data.data.map((item: any) => ({
          classId: item.id,
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
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[item.id % 10],
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
