import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LectureCard.module.css';
import axios from 'axios';
import endpoints from '../../api/endpoints';

// import image
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

const defaultImages = [ image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, ];

interface LectureCardProps {
  classId: number;
  name: string;
  bannerImage: string | null;
  instructor: string | null;
  totalStudents: number;
  category: string;
  isMyPage?: boolean;
  onClick?: () => void;
}

const LectureCard: React.FC<LectureCardProps> = ({ classId, bannerImage, name, instructor, totalStudents, category, onClick, isMyPage = false }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken'); 

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/lecture/info/${classId}`);
    }
  };

  const displayImage = bannerImage || defaultImages[classId % defaultImages.length];

    return (
      <div className={styles.container} onClick={handleClick}>
        <div
            className={styles.banner}
            style={{ backgroundImage: `url(${displayImage})` }}
        />
        <div className={styles.info}>
          <div className={styles.categoryContainer}>
            <div className={styles.category}>
              {category}
            </div>
          </div>
          <h2 className={styles.title}>{name}</h2>
          {instructor && <p className={styles.instructor}>{instructor}</p>}

          {isMyPage && (
           <p className={styles.instructor}>총 수강생: {totalStudents}명</p>
          )}
        </div>
      </div>
    );
};

export default LectureCard;
