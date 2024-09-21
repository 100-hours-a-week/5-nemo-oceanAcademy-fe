import React from 'react';
import styles from '../styles/BoxDisplay.module.css';

interface SpaceProps {
    height?: string;
}

const Space: React.FC<SpaceProps> = ({ height = '0' }) => {
    return (
        <div className={styles.space} style={{ height }}></div>
    );
};

export default Space;
