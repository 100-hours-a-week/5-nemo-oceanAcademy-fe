import React from 'react';
import styles from './CategorySelect.module.css';

interface Category {
    id: number; // 'category_id' 대신 'id'로 설정
    name: string;
}

// 강의 개설 페이지를 위해 defaultVal, defaultName이라는 optional 매개변수 추가
interface CategorySelectProps {
    categories: Category[]; // Category 타입 사용
    selected: string;
    onSelectCategory: (category: string) => void;
    defaultVal?: string;  
    defaultName?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ 
    categories = [], 
    selected, 
    onSelectCategory, 
    defaultVal = "전체 카테고리", 
    defaultName = "전체 카테고리" 
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onSelectCategory(event.target.value);
    };

    return (
        <div className={styles.categoryContainer}>
            <select 
                className={styles.categoryDropdown} 
                value={selected || defaultVal} 
                onChange={handleChange}
            >
                {defaultVal === '' ? (
                    <option value={defaultVal} disabled hidden>{defaultName}</option> // 빈 문자열일 때는 선택 불가능한 placeholder로 설정
                ) : (
                    <option value={defaultVal}>{defaultName}</option> // 빈 문자열이 아닐 때는 일반 옵션으로 설정
                )}
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
