import React from 'react';
import styles from './CategorySelect.module.css';

interface Category {
    id: number; // 'category_id' 대신 'id'로 설정
    name: string;
}

interface CategorySelectProps {
    categories: Category[]; // Category 타입 사용
    selected: string;
    onSelectCategory: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories = [], selected, onSelectCategory }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectCategory(event.target.value);
    };

    return (
        <div className={styles.categoryContainer}>
            <select className={styles.categoryDropdown} value={selected ?? ''} onChange={handleChange}>
                <option value="전체 카테고리">전체 카테고리</option>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <option key={category.id} value={category.name}>
                            {category.name}
                        </option>
                    ))
                ) : (
                    <option value="">카테고리 없음</option>
                )}
            </select>
        </div>
    );
};

export default CategorySelect;
