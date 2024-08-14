import React from 'react';
import styles from './Main.module.css';
import Header from '../../components/header/Header';

const Main: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        {/* 광고 섹션 */}
        <section className={styles.adSection}>
          <h2>광고</h2>
          <div className={styles.adContent}>
            {/* 광고 내용 */}
            광고가 들어갈 위치입니다.
          </div>
        </section>

        {/* 라이브 강의 섹션 */}
        <section className={styles.liveLectureSection}>
          <h2>라이브 강의</h2>
          <div className={styles.liveLectureContent}>
            {/* 라이브 강의 내용 */}
            라이브 강의를 볼 수 있는 위치입니다.
          </div>
        </section>

        {/* 수강생이 많은 강의 TOP 10 섹션 */}
        <section className={styles.topLecturesSection}>
          <h2>수강생이 많은 강의 TOP 10</h2>
          <div className={styles.topLecturesContent}>
            {/* TOP 10 강의 내용 */}
            수강생이 많은 강의 TOP 10이 들어갈 위치입니다.
          </div>
        </section>
      </div>
    </>
  );
};

export default Main;