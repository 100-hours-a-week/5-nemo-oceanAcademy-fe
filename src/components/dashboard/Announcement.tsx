import React, {useState} from 'react';
import styles from './Announcement.module.css';

interface AnnouncementProps {
    className?: string;
    content: string | JSX.Element;
}

const Announcement: React.FC<AnnouncementProps> = ({ className, content }) => {
    // editSection : edit dashboard, editSection 클래스 추가
    const containerClass = className === 'editSection' ? `${styles.container} ${styles.editSection}` : styles.container;
    const contentClass = className === 'editSection' ? `${styles.content} ${styles.editContent}` : styles.content;
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184); // 모바일 상태 추가

    return (
        <div className={containerClass}>
            {
                window.location.pathname === '/lecture/open' ? (
                    <h4 className={styles.title}>강의 공지 (선택)</h4>
                ) : (
                    <h4 className={styles.title}>강의 공지</h4>
                )
            }


            <div className={contentClass}>
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
            <div />
        </div>
    );
};

export default Announcement;
