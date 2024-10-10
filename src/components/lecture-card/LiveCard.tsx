import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LiveCard.module.css';
import { Space } from '../../styles/GlobalStyles';

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

interface LiveCardProps {
  classId: number;
  name: string;
  bannerImage: string | null;
  instructor: string | null;
  category: string;
  rank: number;
  onClick?: () => void;
}

const LiveCard: React.FC<LiveCardProps> = ({ classId, bannerImage, name, instructor, category, rank, onClick }) => {
  const navigate = useNavigate();

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
      <div className={styles.imageWrapper}>
        <div
          className={styles.banner}
          style={{ backgroundImage: `url(${displayImage})` }}
        />
        <div className={styles.overlay}>
          <div className={styles.topContainer}>
            <span className={styles.hotBadge}>HOT</span>
            <span className={styles.category}>{category}</span>
          </div>
          <div className={styles.bottomContainer}>
          <div className={styles.rank}>{rank < 10 ? `0${rank}` : rank}</div>
            <div className={styles.infoContainer}>
              <h2 className={styles.title}>{name}</h2>
              <p className={styles.instructor}>{instructor}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;