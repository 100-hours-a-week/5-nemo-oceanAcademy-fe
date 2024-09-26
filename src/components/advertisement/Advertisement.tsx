// Advertisement - Main, LectureList의 광고 섹션
import React from 'react';
import styles from './Advertisement.module.css';

// 광고 이미지 가져오기
import adImageSmall1 from '../../assets/images/ad/ad_nemo0.png';
import adImageSmall2 from '../../assets/images/ad/ad_nemo1.png';
import adImageSmall3 from '../../assets/images/ad/ad_nemo2.png';
import adImageSmall4 from '../../assets/images/ad/ad_nemo3.png';
import adImageSmall5 from '../../assets/images/ad/ad_small1.png';
import adImageSmall6 from '../../assets/images/ad/ad_small2.png';
import adImageSmall7 from '../../assets/images/ad/ad_small3.png';
import adImageSmall8 from '../../assets/images/ad/ad_small4.png';
import adImageTmt from '../../assets/images/ad/ad_tmt.png';

interface AdvertisementProps {
  size?: 'small' | 'large';
}

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'small' }) => {
  // TO DO : 백오피스 개발 후 광고 랜덤 이미지 출력 삭제 
  const adImagesSmall = [adImageSmall1, adImageSmall2, adImageSmall3, adImageSmall4, adImageSmall5, adImageSmall6, adImageSmall7, adImageSmall8];
  const adImagesLarge = [adImageTmt];

  // 랜덤 이미지 선택
  const randomIndex = Math.floor(Math.random() * adImagesSmall.length);
  const adImage = size === 'large' ? adImageTmt : adImagesSmall[randomIndex];

  const handleAdClick = () => {
    if (adImage === adImageTmt) {
      window.open('https://youtu.be/qDvZ14qCRCU?si=xGtG-kfe9HEFUMAM', '_blank');
    } else {
      window.open('https://github.com/100-hours-a-week/5-nemo-oceanAcademy-fe', '_blank');
    }
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
