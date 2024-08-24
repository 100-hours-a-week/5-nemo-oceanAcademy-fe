// #F-1: Classroom (/classroom) - 수강 중인 강의
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LectureCard from '../../../components/lecture-card/LectureCard';
import Button from '../../../components/button/Button';
import Navigation from 'components/navigation/Navigation';
import styles from './Classroom.module.css';
import { Container } from '../../../styles/GlobalStyles';

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

const Classroom: React.FC = () => {
  const navigate = useNavigate();

  // 수강 중인 강의 더미 데이터
  const enrolledClasses: Lecture[] = [
    // {
    //   classId: 1, 
    //   name: "강의 제목",
    //   bannerImage: "배너 이미지 경로",
    //   instructor: "강사 이름", 
    //   category: "카테고리 이름"
    // },
    /*{ classId: 1, name: '강의 제목 1', bannerImage: '', instructor: '강사 이름 1', category: '프로그래밍' },
    { classId: 2, name: '강의 제목 2', bannerImage: '', instructor: '강사 이름 2', category: '음악' },
    { classId: 3, name: '강의 제목 3', bannerImage: '', instructor: '강사 이름 3', category: '요리' },
    { classId: 4, name: '강의 제목 4', bannerImage: '', instructor: '강사 이름 4', category: '미술' },*/
  ];

  return (
    <Container>
      {Array.isArray(enrolledClasses) && enrolledClasses.length > 0 ? (
        <div className={styles.lectureGrid}>
          {enrolledClasses.map((lecture) => (
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
      ) : (
        <div className={styles.noClasses}>
          <p>아직 수강 중인 강의가 없어요!</p>
          <Button text="수강 신청하러 가기" onClick={() => navigate('/list')} />
        </div>
      )}
      <Navigation />
    </Container>
  );
};

export default Classroom;