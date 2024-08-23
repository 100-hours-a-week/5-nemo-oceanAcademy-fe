import React from 'react';
import styles from './Category.module.css';

interface CategoryProps {
  selected: string;
  onChange: (category: string) => void;
}

const Category: React.FC<CategoryProps> = ({ selected, onChange }) => {
    const categories = [
        '프로그래밍', '개발 (웹, 앱, 게임)', '음악', '미술', '요리', '운동', 
        '사진', '외국어', '마케팅', '디자인', '심리학', '과학', '비즈니스 스킬', 
        '투자', '작문', '댄스', '역사', '커뮤니케이션', '가드닝'
    ];

    return (
        <div className="categoryContainer">
            <select 
                className={styles.categoryDropdown} 
                value={selected} 
            onChange={(e) => onChange(e.target.value)}
            >
            <option value="All">전체</option>
            {categories.map(category => (
                <option key={category} value={category}>
                {category}
                </option>
            ))}
            </select>
        </div>
  );
};

export default Category;