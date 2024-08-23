import React from 'react';
import styles from './Announcement.module.css';

interface AnnouncementProps {
    content: string | JSX.Element;
}

const Announcement: React.FC<AnnouncementProps> = ({ content }) => {
    return (
        <div className={styles.container}>
            <h4>강의 공지</h4>
            <div className={styles.content}>
                {typeof content === 'string'
                    ? content.split('\n').map((line, index: number) => (
                        <div key={index} className={styles.line}>
                            <span className={styles.bullet}>•</span>
                            <span className={styles.text}>{line}</span>
                        </div>
                    ))
                    : content
                }
            </div>
        </div>
    );
};

export default Announcement;
