// 강의 소개

import React from 'react';
import styles from './InfoSection.module.css';

interface InfoSectionProps {
    title: string;
    content: string | JSX.Element;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, content }) => {
    return (
        <div className={styles.container}>
            <h4>{title}</h4>
            <p>{content}</p>
        </div>
    );
};

export default InfoSection;
