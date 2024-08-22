import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LiveCard.module.css';

interface LiveCardProps {
  title: string;
  instructor: string;
  category: string;
}

const LiveCard: React.FC<LiveCardProps> = ({ title, instructor, category }) => {
  return (
    <div className={styles.card}>
      <div className={styles.liveBox}>live 강의 화면</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.details}>
        {instructor} | {category}
      </p>
    </div>
  );
};

export default LiveCard;