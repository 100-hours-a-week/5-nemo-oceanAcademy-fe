// 강의 소개

import React from 'react';
import styles from './InfoSection.module.css';

interface InfoSectionProps {
    title: string;
    content: string | JSX.Element;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, content }) => {
    return (
        <div>
            <h4 className={styles.title}>{title}</h4>
            <div className={styles.container}>
                <p>{content}</p>
            </div>
        </div>
    );
};

export default InfoSection;
