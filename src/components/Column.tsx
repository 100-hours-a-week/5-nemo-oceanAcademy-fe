import React from 'react';
import styles from '../styles/BoxDisplay.module.css';

interface ColumnProps {
    align?: 'left' | 'right' | 'center' | 'fill';
    gap?: string;
    children: React.ReactNode; // 자식 요소
}

const Column: React.FC<ColumnProps> = ({ align = 'left', gap = '0', children }) => {
    // 기본값 'left'
    let alignItems = 'flex-start';

    if (align === 'center') {
        alignItems = 'center';
    } else if (align === 'right') {
        alignItems = 'flex-end';
    } else if (align === 'fill') {
        alignItems = 'space-between';
    }

    return (
        <div className={styles.Column} style={{ alignItems, gap }}>
            {children}
        </div>
    );
};

export default Column;
