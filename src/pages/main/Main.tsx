// #A-1: Main (/) - 메인 화면/랜딩페이지 
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Navigation from '../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import styles from './Main.module.css';
import { Space } from '../../styles/GlobalStyles';

// import images
import emptyImage from '../../assets/images/utils/empty.png';
import feedbackImage from '../../assets/images/ad/feedback.png';
import whiteArrow from '../../../assets/images/icon/arrow_w.svg';
import blackArrow from '../../../assets/images/icon/arrow_bl.svg';
import image1 from '../../assets/images/banner/image1.png';
import image2 from '../../assets/images/banner/image2.jpeg';
import image3 from '../../assets/images/banner/image3.png';
import image4 from '../../assets/images/banner/image4.png';
import image5 from '../../assets/images/banner/image5.jpeg';
import image6 from '../../assets/images/banner/image6.png';
import image7 from '../../assets/images/banner/image7.png';
import image8 from '../../assets/images/banner/image8.jpeg';
import image9 from '../../assets/images/banner/image9.png';
import image10 from '../../assets/images/banner/image10.jpeg';

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
  const [page, setPage] = useState(0);
  
  useEffect(() => {
    axios.get(`${endpoints.classes}?target=live?page=${page}`)
      .then(response => {
        const classes = response.data.data.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[item.id % 10],
          instructor: item.instructor,
          category: item.category
        }));
        console.log(endpoints.classes);
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

  const handleFeedbackClick = () => {
    window.open('https://forms.gle/vN3RDGNmM1okqRfq7', '_blank');
  }

  return (
      <div className={styles.container}>


        <section className={styles.adSection}>
          <div className={styles.adImage}>
            {/* <img /> */}
          </div>
        </section>



        <section className={styles.top10Section}>
          <div>
            <h1 className={styles.sectionTitle}>
              수강생이 많은 강의 TOP 10
            </h1>
          </div>



        </section>

        <div className={styles.divider} />

        <section className={styles.liveSection}>

          <div>
            <h1 className={styles.sectionTitle}>
              🔴 Live: 모두가 주목하는 실시간 라이브 강의
            </h1>
          </div>
      
        </section>


      </div>
  );
};

export default Main;
