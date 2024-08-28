// Advertisement - Main, LectureList의 광고 섹션
import React from 'react';
import styles from './Advertisement.module.css';
import adImageSmall from '../../assets/images/ad_nemo3.png';
import adImageLarge from '../../assets/images/ad_big0.png';

// 광고 이미지 가져오기
import adImageSmall1 from '../../assets/images/ad_nemo0.png';
import adImageSmall2 from '../../assets/images/ad_nemo1.png';
import adImageSmall3 from '../../assets/images/ad_nemo2.png';
import adImageSmall4 from '../../assets/images/ad_nemo3.png';
import adImageSmall5 from '../../assets/images/ad_small1.png';
import adImageSmall6 from '../../assets/images/ad_small2.png';
import adImageSmall7 from '../../assets/images/ad_small3.png';
import adImageSmall8 from '../../assets/images/ad_small4.png';
import adImageLarge1 from '../../assets/images/ad_big0.png';
import adImageLarge2 from '../../assets/images/ad_big1.png';
import adImageLarge3 from '../../assets/images/ad_big2.png';
import adImageLarge4 from '../../assets/images/ad_big3.png';
import adImageLarge5 from '../../assets/images/ad_big4.png';
import adImageLarge6 from '../../assets/images/ad_big5.png';
import adImageLarge7 from '../../assets/images/ad_big6.png';
import adImageLarge8 from '../../assets/images/ad_big7.png';

interface AdvertisementProps {
  size?: 'small' | 'large';
}

const Advertisement: React.FC<AdvertisementProps> = ({ size = 'small' }) => {
  // TO DO : 백오피스 개발 후 광고 랜덤 이미지 출력 삭제 
  const adImagesSmall = [adImageSmall1, adImageSmall2, adImageSmall3, adImageSmall4, adImageSmall5, adImageSmall6, adImageSmall7, adImageSmall8];
  const adImagesLarge = [adImageLarge1, adImageLarge2, adImageLarge3, adImageLarge4, adImageLarge5, adImageLarge6, adImageLarge7, adImageLarge8];

  // 랜덤 이미지 선택
  const randomIndex = Math.floor(Math.random() * adImagesSmall.length);
  const adImage = size === 'large' ? adImagesLarge[randomIndex] : adImagesSmall[randomIndex];

  const handleAdClick = () => {
    window.location.href = 'https://github.com/100-hours-a-week/5-nemo-oceanAcademy-fe';
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
