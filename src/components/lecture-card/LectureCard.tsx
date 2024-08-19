import React from 'react';
import styles from './LectureCard.module.css';

interface LectureCardProps {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

const LectureCard: React.FC<LectureCardProps> = ({ classId, bannerImage, name, instructor, category }) => {
  return (
    <div className={styles.card}>
      <div className={styles.banner} style={{ backgroundImage: `url(${bannerImage})` }}></div>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.details}>
        {instructor} | {category}
      </p>
    </div>
  );
};

export default LectureCard;