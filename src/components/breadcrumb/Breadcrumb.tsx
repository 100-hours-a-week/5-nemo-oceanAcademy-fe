import React from 'react';
import { Link } from 'react-router-dom'; // for proper internal navigation
import styles from './Breadcrumb.module.css';

interface BreadcrumbProps {
  items: { label: string; link: string }[]; // items will contain page label and link
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <>
      <nav className={styles.breadcrumb}>
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1; // Check if it's the last item (current page)
          return (
            <React.Fragment key={index}>
              {!isLastItem ? (
                // For all items except the last one, make them clickable
                <Link to={item.link} className={styles.breadcrumbItem}>
                  {item.label}
                </Link>
              ) : (
                // Last item, current page (non-clickable)
                <span className={styles.currentItem}>{item.label}</span>
              )}
              {index < items.length - 1 && <span className={styles.separator}>{'>'}</span>}
            </React.Fragment>
          );
        })}
      </nav>
      <div className={styles.divider} />
    </>
  );
};

export default Breadcrumb;