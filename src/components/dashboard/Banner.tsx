import React from 'react';
import styles from './Banner.module.css';

interface BannerProps {
    image: string;
}

const Banner: React.FC<BannerProps> = ({ image }) => {
    return (
        <div
            className={styles.banner}
            style={{ backgroundImage: `url(${image})` }}
        />
    );
};

export default Banner;
