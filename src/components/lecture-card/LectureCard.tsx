import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LectureCard.module.css';

// import image
import banner from '../../assets/images/banner/image9.png';

interface LectureCardProps {
  classId: number;
  name: string;
  bannerImage: string | null;
  instructor: string;
  category: string;
  onClick?: () => void;
}

const LectureCard: React.FC<LectureCardProps> = ({ classId, bannerImage, name, instructor, category, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/lecture/info/${classId}`);
    }
  };

    const displayImage = bannerImage ?? banner;

    return (
        <div className={styles.container} onClick={handleClick}>
            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${displayImage})` }}
            ></div>
            <h2 className={styles.title}>{name}</h2>
            <p className={styles.details}>
                {instructor} | {category}
            </p>
        </div>
    );
};

export default LectureCard;
