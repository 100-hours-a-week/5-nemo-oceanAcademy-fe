// Advertisement - Main, LectureList의 광고 섹션
import React from 'react';
import styles from './Advertisement.module.css';

interface AdvertisementProps {
  size?: 'small' | 'large';
}

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'small' }) => {
/*
  const handleAdClick = () => {
    if (adImage === adImageTmt) {
      window.open('https://youtu.be/qDvZ14qCRCU?si=xGtG-kfe9HEFUMAM', '_blank');
    } else {
      window.open('https://github.com/100-hours-a-week/5-nemo-oceanAcademy-fe', '_blank');
    }
  };
*/

  return (
    <section className={styles.adSection}>
      <div className={styles.adImage}>
        {/* <img /> */}
      </div>
    </section>
  );
};

export default Advertisement;
