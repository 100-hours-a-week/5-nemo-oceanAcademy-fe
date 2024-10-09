import React from 'react';
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  items: { label: string; link: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <>
      <nav className={styles.breadcrumb}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <a href={item.link} className={styles.breadcrumbItem}>
              {item.label}
            </a>
            {index < items.length - 1 && <span className={styles.separator}>/</span>}
          </React.Fragment>
        ))}
      </nav>
      <div className={styles.divider} />
    </>
  );
};

export default Breadcrumb;