// 강의 공지

import React from 'react';
import styles from './Announcement.module.css';

interface AnnouncementProps {
    content: string | JSX.Element;
}

const Announcement: React.FC<AnnouncementProps> = ({ content }) => {
    return (
        <div className={styles.container}>
            <h4>강의 공지</h4>
            <p>{content}</p>
        </div>
    );
};

export default Announcement;
