import React, { useState, useRef, useEffect } from 'react';
import styles from './CategorySelect.module.css';

interface Category {
    id: number;
    name: string;
}

interface CategorySelectProps {
    categories: Category[];
    selected: string;
    onSelectCategory: (category: string) => void;
    defaultVal?: string;
    defaultName?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    categories = [],
    selected,
    onSelectCategory,
    defaultVal = '',
    defaultName = '카테고리 선택'
}) => {
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement>(null);

// 외부 클릭 시 드롭다운 닫기
useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

const toggleDropdown = () => setIsOpen(!isOpen);

const handleSelect = (category: string) => {
    onSelectCategory(category);
    setIsOpen(false);
};

return (
    <div className={styles.categoryContainer} ref={dropdownRef}>
        <div className={styles.dropdownHeader} onClick={toggleDropdown}>
            {selected || defaultName}
            <span className={styles.arrow}>
                {isOpen ? (
                    <span className="material-symbols-outlined">keyboard_arrow_up</span>
                ) : (
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>
                )}
            </span>
        </div>
        {isOpen && (
            <ul className={styles.dropdownList}>
                {defaultVal && (
                    <li
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(defaultVal)}
                    >
                        {defaultName}
                    </li>
                )}
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li
                            key={category.id}
                            className={styles.dropdownItem}
                            onClick={() => handleSelect(category.name)}
                        >
                            {category.name}
                        </li>
                    ))
                ) : (
                    <li className={styles.dropdownItem}>카테고리 없음</li>
                )}
            </ul>
        )}
    </div>
);
};

export default CategorySelect;
