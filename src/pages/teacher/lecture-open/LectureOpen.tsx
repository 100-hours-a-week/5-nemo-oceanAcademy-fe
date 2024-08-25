import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../components/input-field/InputField';
import FileUpload from '../../../components/file-upload/FileUpload';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import CategorySelect from 'components/category-select/CategorySelect';
import styles from './LectureOpen.module.css';
import { Container } from '../../../styles/GlobalStyles'
import axios from 'axios';
import endpoints from '../../../api/endpoints'; 

interface Category {
  category_id: number;
  name: string;
}

const LectureOpen: React.FC = () => {
  const navigate = useNavigate();
  const [isFormValid, setIsFormValid] = useState(false); // 필수값이 모두 입력되었는지 확인
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructorInfo, setInstructorInfo] = useState<string>('');
  const [precourse, setPrecourse] = useState<string>('');
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  useEffect(() => {
    // 카테고리 목록 가져오기
    const fetchCategories = async () => {
      try {
        const response = await axios.get(endpoints.getCategories);
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', title);
    formData.append('category', selectedCategory);
    formData.append('object', objective);
    formData.append('description', description);
    formData.append('instructor_info', instructorInfo);
    formData.append('precourse', precourse);
    if (bannerImage) formData.append('banner_image', bannerImage);

    try {
      const response = await axios.post(endpoints.openLecture, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        navigate('/lecture/created'); 
      } else {
        alert('강의 개설에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error creating lecture:', error);
      alert('강의 개설에 실패했습니다. 다시 시도해 주세요.');
    }
  };


  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBannerImageUpload = (file: File) => {
    setBannerImage(file);
  };

  const validateForm = () => {
    const isValid = title && selectedCategory && objective && description;
    setIsFormValid(isValid);
  };
  
  useEffect(validateForm, [title, selectedCategory, objective, description]);

  return (
    <Container>
      <h1 className={styles.title}>강의 개설하기</h1>

      <CategorySelect 
        categories={categories} 
        selected={selectedCategory} 
        onSelectCategory={handleCategoryChange} 
        width="100%" // 드롭다운 너비를 더 넓게 설정
      />

      <InputField 
        label="강의 제목" 
        placeholder="강의 제목을 작성해주세요" 
        isRequired 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        helperText="강의 제목은 필수 항목입니다."
      />

      <InputField 
        label="강의 목표" 
        placeholder="강의 목표를 작성해주세요" 
        isRequired 
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        helperText="강의 목표는 필수 항목입니다."
      />

      <InputField 
        label="강의 소개" 
        placeholder="강의 소개를 작성해주세요" 
        isRequired 
        isTextArea 
        height={100}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        helperText="강의 소개는 필수 항목입니다."
      />

      <InputField 
        label="강사 소개 (선택)" 
        placeholder="강사 소개를 작성해주세요" 
        isTextArea 
        height={100}
        value={instructorInfo}
        onChange={(e) => setInstructorInfo(e.target.value)}
      />

      <InputField 
        label="강의에 필요한 사전 지식 및 준비 안내 (선택)" 
        placeholder="사전 지식 및 준비 안내를 작성해주세요" 
        isTextArea 
        height={100}
        value={precourse}
        onChange={(e) => setPrecourse(e.target.value)}
      />

      <FileUpload />

      <div className={styles.buttonContainer}>
        <Button 
          text="강의 개설하기" 
          onClick={handleSubmit} 
          disabled={!isFormValid}
        />
      </div>

      <Navigation />
    </Container>
  );
};

export default LectureOpen;