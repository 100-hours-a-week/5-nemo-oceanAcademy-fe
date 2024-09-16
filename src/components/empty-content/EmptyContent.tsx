import React from 'react';
import styles from './emptyContent.module.css';
import emptyImage from '../../../src/assets/images/utils/empty.png';

const EmptyContent: React.FC = () => {
    return (
        <div className={styles.container}>
            <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
            <h5>아직 강의가 없어요!</h5>
        </div>
    );
};

export default EmptyContent;