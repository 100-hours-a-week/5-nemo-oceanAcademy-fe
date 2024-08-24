import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LiveCard.module.css';

interface LiveCardProps {
  classId: number;
  name: string;
  bannerImage: string;
  instructor: string;
  category: string;
}

const LiveCard: React.FC<LiveCardProps> = ({ classId, bannerImage, name, instructor, category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/lecture/info?id=${classId}`);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.banner} style={{ backgroundImage: `url(${bannerImage})` }}></div>
      <h2 className={styles.title}>{name}</h2>
      <p className={styles.details}>
        {instructor} | {category}
      </p>
    </div>
  );
};

export default LiveCard;