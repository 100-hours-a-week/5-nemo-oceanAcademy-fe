import React from 'react';
import styles from '../styles/BoxDisplay.module.css';

interface ColumnProps {
    align?: 'top' | 'bottom' | 'center' | 'fill' | 'all';
    gap?: string;
    children: React.ReactNode; // 자식 요소
}

const Column: React.FC<ColumnProps> = ({ align = 'top', gap = '0', children }) => {
    // 기본값 'left'
    let alignItems = 'flex-start';
    let justifyContent = 'flex-start';

    if (align === 'center') {
        alignItems = 'flex-start';
        justifyContent = 'center';
    } else if (align === 'bottom') {
        alignItems = 'flex-start';
        justifyContent = 'flex-end';
    } else if (align === 'fill') {
        alignItems = 'flex-start';
        justifyContent = 'space-between';
    }
    else if (align === 'all') {
        alignItems = 'center';
        justifyContent = 'center';
    }

    return (
        <div className={styles.column} style={{ alignItems, justifyContent, gap }}>
            {children}
        </div>
    );
};

export default Column;
