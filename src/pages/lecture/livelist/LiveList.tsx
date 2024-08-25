// #E-1: LiveList (/live-list) - 라이브 강의 조회 페이지 (현재 라이브 중인 강의, 카테고리)
import React, { useState, useEffect } from 'react';
import LiveCard from '../../../components/lecture-card/LiveCard';
import CategorySelect from 'components/category-select/CategorySelect';
import Navigation from '../../../components/navigation/Navigation';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveList.module.css';
import { Container } from '../../../styles/GlobalStyles';
import bn1 from '../../../assets/images/ad_big1.png';
import bn2 from '../../../assets/images/ad_big2.png';
import bn3 from '../../../assets/images/ad_big3.png';
import bn4 from '../../../assets/images/ad_big4.png';
import bn5 from '../../../assets/images/ad_big5.png';
import bn6 from '../../../assets/images/ad_big6.png';
import bn7 from '../../../assets/images/ad_big7.png';
import emptyImage from '../../../assets/images/empty.png';

interface Lecture {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

interface Category {
  category_id: number;
  name: string;
}

const LiveList: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('전체 카테고리');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 카테고리 목록 가져오기
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories);
        setCategories(categoryResponse.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]); // 오류 시 빈 배열 설정
        alert('카테고리 정보를 가져오는 데 실패했습니다.');
      }
    };

    // 라이브 강의 목록 가져오기
    const fetchLiveLectures = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${endpoints.getLectures}?target=live`);
        const classes = response.data.classes.map((item: any) => ({
          classId: item.class_id,
          name: item.name,
          bannerImage: item.banner_image,
          instructor: item.instructor,
          category: item.category,
        }));
        setLectures(classes || []);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 400) {
            alert(error.response.data.message);
          }
        } else {
          console.error('Failed to fetch live lectures:', error);
        }
        setLectures([]); // 오류 시 빈 배열 설정
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    fetchLiveLectures();
  }, []);

  const filteredLectures = selectedCategory === '전체 카테고리'
    ? lectures
    : lectures.filter(lecture => lecture.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Container>
      <div className={styles.header}>
        <h1 className={styles.title}>🔴 Live</h1>
        <CategorySelect 
          selected={selectedCategory} 
          onSelectCategory={handleCategoryChange}
          categories={categories}
        />
      </div>

      <section className={styles.lectureSection}>
        {isLoading ? (
            <p>Loading...</p>
          ) : filteredLectures.length === 0 ? (
            <div className={styles.emptyContainer}>
              <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
              <h5>아직 강의가 없어요!</h5>
            </div>
          ) : (
            <div className={styles.lectureGrid}>
              {filteredLectures.map((lecture) => (
                <LiveCard
                  key={lecture.classId}
                  classId={lecture.classId}
                  bannerImage={lecture.bannerImage}
                  name={lecture.name}
                  instructor={lecture.instructor}
                  category={lecture.category}
                />
              ))}
            </div>
          )}
      </section>
      <Navigation />
    </Container>
  );
};

export default LiveList;