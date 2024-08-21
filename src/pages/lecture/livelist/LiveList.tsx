// LiveList.tsx

import React, { useState } from 'react';
import LiveCard from '../../../components/lecture-card/LiveCard';
import Category from '../../../components/category/Category';
import Navigation from '../../../components/navigation/Navigation';
import { Container } from '../../../styles/GlobalStyles';
import styles from './LiveList.module.css';

const LiveList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // 더미 데이터
  const liveLectures = [
    { title: '실시간 요가 클래스', instructor: '헤이즐리', category: '운동' },
    { title: '프랑스어 강의', instructor: '준', category: '외국어' },
    { title: '실시간 요가 클래스', instructor: '헤이즐리', category: '운동' },
    { title: '프랑스어 강의', instructor: '준', category: '외국어' },
    // 추가적인 더미 데이터...
  ];

  const filteredLectures = selectedCategory === 'All' 
    ? liveLectures 
    : liveLectures.filter(lecture => lecture.category === selectedCategory);

  return (
    <Container>
      <div className={styles.header}>
        <h1 className={styles.title}>🔴 Live</h1>
        <Category 
          selected={selectedCategory} 
          onChange={setSelectedCategory} 
        />
      </div>

      <section className={styles.lectureList}>
        {filteredLectures.map((lecture, index) => (
          <LiveCard 
            key={index}
            title={lecture.title}
            instructor={lecture.instructor}
            category={lecture.category}
          />
        ))}
      </section>
      <Navigation />
    </Container>
  );
};

export default LiveList;