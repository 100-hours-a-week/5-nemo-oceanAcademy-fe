import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.css';
import arrow from '../../assets/images/icon/arrow_bl.svg';

interface BreadcrumbProps {
  items: { label: string; link: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <>
      <nav className={styles.breadcrumb}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {!isLastItem ? (
                <Link to={item.link} className={styles.breadcrumbItem}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.currentItem}>{item.label}</span>
              )}
              {index < items.length - 1 && <img src={arrow} className={styles.separator} />}
            </React.Fragment>
          );
        })}
      </nav>
      <div className={styles.divider} />
    </>
  );
};

export default Breadcrumb;