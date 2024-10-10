// #A-1: Main (/) - 메인 화면/랜딩페이지 
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Advertisement from '../../components/advertisement/Advertisement';
import LectureCard from '../../components/lecture-card/LectureCard';
import Slider from 'react-slick';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import styles from './Main.module.css';
import { Container, Row, Space, Divider } from '../../styles/GlobalStyles';

// import images
import emptyImage from '../../assets/images/utils/empty.png';
import feedbackImage from '../../assets/images/ad/feedback.png';
import whiteArrow from '../../assets/images/icon/arrow_w.svg';
import blackArrow from '../../assets/images/icon/arrow_bl.svg';

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
  const isBlackBackground = true;

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };
  
  useEffect(() => {
    axios.get(`${endpoints.classes}?target=live?page=${page}`)
      .then(response => {
        const classes = response.data.data.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path,
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
          bannerImage: item.banner_image_path,
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

  const moveList = () => {
    navigate('/list');
  }

  const moveLive = () => {
    navigate('/live-list');
  }

  return (
      <Container isBlackBackground={isBlackBackground}>
        <Advertisement />

        <section className={styles.top10Section}>

          <div className={styles.top10Content}>
            <Row align={"fill"} className={styles.top10Slides}>
              <h1 className={styles.sectionTitle}>
                수강생이 많은 강의 TOP 10
              </h1>

              <div className={styles.link} onClick={moveList}>
                <p>전체 강의 보기</p>
                <img src={whiteArrow} />
              </div>
            </Row>
            <Space height={"24px"} />

            <div className={styles.carousel}>
              <Slider {...sliderSettings}>
              {topTenClasses.map((lecture, index) => (
                <div key={lecture.classId} className={styles.lectureCardWrapper}>
                  <div className={styles.rankNumber}>{String(index + 1).padStart(2, '0')}</div>
                  <LectureCard
                    classId={lecture.classId}
                    bannerImage={lecture.bannerImage}
                    name={lecture.name}
                    instructor={lecture.instructor}
                    category={lecture.category} totalStudents={0}
                  />
                </div>
                ))}
              </Slider>
            </div>

          </div>
        </section>

        <Divider />

        <section className={styles.liveSection}>
          <Space height={"40px"} />
          <Row align={"fill"}>
            <h1 className={styles.sectionTitle}>
              🔴 Live: 모두가 주목하는 실시간 라이브 강의
            </h1>
            
            <div className={styles.link} onClick={moveLive}>
              <p>현재 라이브 중인 강의 보기</p>
              <img src={whiteArrow} />
            </div>
          </Row>
          <Space height={"24px"} />
          <div className={styles.lectureGrid}>
            {liveClasses.map((lecture) => (
              <LectureCard
                key={lecture.classId}
                classId={lecture.classId}
                bannerImage={lecture.bannerImage}
                name={lecture.name}
                instructor={lecture.instructor}
                category={lecture.category} totalStudents={0}
              />
            ))}
          </div>
          <Space height={"40px"} />
        </section>
      </Container>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className={styles.nextArrow} onClick={onClick}>
      <img src={blackArrow} className={styles.sliderNext} />
    </div>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className={styles.prevArrow} onClick={onClick}>
      <img src={blackArrow} className={styles.sliderPrev} />
    </div>
  );
};

export default Main;
