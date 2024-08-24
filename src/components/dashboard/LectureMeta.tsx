import React from 'react';
import styles from './LectureMeta.module.css';

interface LectureMetaProps {
    className?: string;
    instructor?: string;
    title?: string | JSX.Element;
    category?: string | JSX.Element;
    editSection?: boolean; // editSection prop 추가
}

const LectureMeta: React.FC<LectureMetaProps> = ({ instructor, title, category, editSection }) => {
    return (
        <div className={`${styles.metaContainer} ${editSection ? styles.editSection : ''}`}>
            <div className={`${styles.topRow} ${editSection ? styles.editSection : ''}`}>
                {instructor && (
                    <p className={`${styles.instructor} ${editSection ? styles.editSection : ''}`}>
                        {instructor}
                    </p>
                )}
                {category && (
                    <div className={`${styles.categoryBox} ${editSection ? styles.editSection : ''}`}>
                        <p className={`${styles.category} ${editSection ? styles.editSection : ''}`}>
                            {category}
                        </p>
                    </div>
                )}
            </div>
            {title && (
                <p className={`${styles.title} ${editSection ? styles.editSection : ''}`}>
                    {title}
                </p>
            )}
        </div>
    );
};

export default LectureMeta;
