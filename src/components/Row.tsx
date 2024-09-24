import React from 'react';
import styles from '../styles/BoxDisplay.module.css';

interface RowProps {
    align?: 'left' | 'right' | 'center' | 'fill';
    gap?: string;
    children: React.ReactNode; // 자식 요소
}

const Row: React.FC<RowProps> = ({ align = 'left', gap = '0', children }) => {
    // 기본값 'left'
    let justifyContent = 'flex-start';
    let alignItems = 'flex-start';

    if (align === 'center') {
        justifyContent = 'center';
    } else if (align === 'right') {
        justifyContent = 'flex-end';
        alignItems = 'center';
    } else if (align === 'fill') {
        justifyContent = 'space-between';
        alignItems = 'center';
    }

    return (
        <div className={styles.row} style={{ justifyContent, alignItems, gap }}>
            {children}
        </div>
    );
};

export default Row;
