import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LectureCard.module.css';

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
      navigate(`/lecture/info?id=${classId}`);
    }
  };

    const displayImage = bannerImage ?? 'path/to/default/image.png'; // bannerImage가 null일 경우 기본 이미지 사용

    return (
        <div className={styles.container} onClick={handleClick}>
            <div
                className={styles.banner}
                style={{ backgroundImage: `url(${displayImage})` }} // null 처리 후 기본 이미지 사용
            ></div>
            <h2 className={styles.title}>{name}</h2>
            <p className={styles.details}>
                {instructor} | {category}
            </p>
        </div>
    );
};

export default LectureCard;
