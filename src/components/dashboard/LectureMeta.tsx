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
            <p>{`강사 이름: ${instructor}`}</p>
            <p>{`강의 제목: ${title}`}</p>
            <p>{`카테고리: ${category}`}</p>
        </div>
    );
};

export default LectureMeta;
