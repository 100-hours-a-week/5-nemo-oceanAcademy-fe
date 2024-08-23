// Advertisement - Main, LectureList의 광고 섹션
import React from 'react';
import styles from './Advertisement.module.css';
import adImageSmall from '../../assets/images/ad_nemo3.png';
import adImageLarge from '../../assets/images/ad_big0.png';

interface AdvertisementProps {
  size?: 'small' | 'large';
}

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'small' }) => {
  const adImage = size === 'large' ? adImageLarge : adImageSmall;

  const handleAdClick = () => {
    window.location.href = 'https://goormkdx.notion.site/8-3f7349ec404f4c09aeb9ed240f60bb69';
  };

  return (
    <div className={`${styles.container} ${size === 'large' ? styles.large : styles.small}`}
      onClick={handleAdClick}
    >
      <img src={adImage} alt="advertisement image" />
    </div>
  );
};

export default Advertisement;
