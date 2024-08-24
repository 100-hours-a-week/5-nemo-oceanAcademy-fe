import React from 'react';
import styles from './CategorySelect.module.css';

interface CategorySelectProps {
  onSelectCategory: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onSelectCategory }) => {
  const categories = [
    '전체 카테고리',
    '프로그래밍', '개발', '음악', '미술', '요리', '운동', 
    '사진', '외국어', '마케팅', '디자인', '심리학', '과학', '비즈니스 스킬', 
    '투자', '작문', '댄스', '역사', '커뮤니케이션', '가드닝'
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectCategory(event.target.value);
  };

  return (
    <div className={styles.categoryContainer}>
      <select className={styles.categoryDropdown} onChange={handleChange}>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
