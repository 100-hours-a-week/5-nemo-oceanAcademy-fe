// Advertisement - Main, LectureList의 광고 섹션
import React from 'react';
import styles from './Advertisement.module.css';

import ad from '../../assets/images/ad/goormthon.png';

interface AdvertisementProps {
  size?: 'small' | 'large';
}

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'small' }) => {

  const handleAdClick = () => {
    window.open('https://9oormthon.goorm.io/');
  };


  return (
    <section className={styles.adSection}>
      <div className={styles.adImage}>
        <img src={ad} onClick={handleAdClick} alt="advertisement image" />
      </div>
    </section>
  );
};

export default Advertisement;
