// 강의 소개

import React from 'react';
import styles from './InfoSection.module.css';

interface InfoSectionProps {
    title: string;
    content: string | JSX.Element;
    className?: string;
    helpertext?: string;
    essential?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ className, title, content, helpertext, essential}) => {
    // editSection : edit dashboard, editSection 클래스 추가
    const containerClass = className === 'editSection' ? `${styles.container} ${styles.editSection}` : styles.container;

    return (
        <div>
            <h4 className={styles.title}>{title}<a className={styles.essentialPoint}> {essential}</a></h4>

            {className === 'editSection' && (
                <div className={styles.helperTextBox}>
                    <p className={styles.helperText}>{helpertext}</p>
                </div>
            )}

            <div className={containerClass}>
                {typeof content === 'string' ? <p>{content}</p> : content}
            </div>
        </div>
    );
};

export default InfoSection;
