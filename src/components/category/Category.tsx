import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from './Category.module.css';

interface CategoryProps {
  selected: string;
  onChange: (category: string) => void;
}

const Category: React.FC<CategoryProps> = ({ selected, onChange }) => {
    // TO DO: 카테고리 api로 가져오기 
    const categories = [
        '프로그래밍', '개발', '음악', '미술', '요리', '운동', 
        '사진', '외국어', '마케팅', '디자인', '심리학', '과학', '비즈니스 스킬', 
        '투자', '작문', '댄스', '역사', '커뮤니케이션', '가드닝'
    ];

    const handleChange = (event: SelectChangeEvent) => {
        onChange(event.target.value as string);
      };

    return (
        <div className="categoryContainer">
            <Box className={styles.categoryContainer} sx={{ minWidth: 150 }}>
                <FormControl fullWidth>
                    <InputLabel id="category-select-label">카테고리</InputLabel>
                    <Select
                        labelId="category-select-label"
                        id="category-select"
                        value={selected} 
                        label="카테고리"
                        onChange={handleChange}
                        sx={{ height: 40 }}  // 높이 설정
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </div>
    );
};

export default Category;