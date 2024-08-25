import React from 'react';
import styles from './CategorySelect.module.css';

interface CategorySelectProps {
  categories: { category_id: number; name: string }[];
  selected: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories = [], selected, onSelectCategory }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectCategory(event.target.value);
  };

  return (
    <div className={styles.categoryContainer}>
      <select className={styles.categoryDropdown} value={selected} onChange={handleChange}>
      <option value="전체 카테고리">전체 카테고리</option>
        {categories.map((category) => (
          <option key={category.category_id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
