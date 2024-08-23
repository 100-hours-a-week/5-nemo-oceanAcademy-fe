// 강의 메타 정보 - 강사 이름, 제목, 카테고리

import React from 'react';
import styles from './LectureMeta.module.css';

interface LectureMetaProps {
    instructor: string;
    title: string | JSX.Element; 
    category: string | JSX.Element;
}

const LectureMeta: React.FC<LectureMetaProps> = ({ instructor, title, category }) => {
    return (
        <div className={styles.metaContainer}>
            <div className={styles.topRow}>
                <p className={styles.instructor}>{`${instructor}`}</p>
                <div className={styles.categoryBox}>
                    <p className={styles.category}>{`${category}`}</p>
                </div>
            </div>
            <p className={styles.title}>{`${title}`}</p>
        </div>
    );
};


export default LectureMeta;
