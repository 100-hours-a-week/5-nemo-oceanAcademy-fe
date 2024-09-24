import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from '../../../components/input-field/InputField';
import FileUpload from '../../../components/file-upload/FileUpload';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import CategorySelect from 'components/category-select/CategorySelect';
import styles from './LectureOpen.module.css';
import { Container } from '../../../styles/GlobalStyles'
import axios from 'axios';
import endpoints from '../../../api/endpoints'; 
import { isValidTextInput, getTitleHelperText } from '../../../utils/validation';

interface Category {
  id: number;
  name: string;
}

const LectureOpen: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [isFormValid, setIsFormValid] = useState(false); // 필수값이 모두 입력되었는지 확인
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructorInfo, setInstructorInfo] = useState<string>('');
  const [prerequisite, setPrerequisite] = useState<string>('');
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  
  const [categoryHelperText, setCategoryHelperText] = useState<string>('카테고리는 필수 항목입니다.');
  const [titleHelperText, setTitleHelperText] = useState<string>('강의 제목은 필수 항목입니다.');
  const [objectiveHelperText, setObjectiveHelperText] = useState<string>('강의 목표는 필수 항목입니다.');
  const [descriptionHelperText, setDescriptionHelperText] = useState<string>('강의 소개는 필수 항목입니다.');
  const { classId } = useParams<{ classId: string }>();

  useEffect(() => {
    // 카테고리 목록 가져오기
    const fetchCategories = async () => {
      try {
        const categoryResponse = await axios.get(endpoints.getCategories, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(categoryResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategories([]);
        alert('카테고리 정보를 가져오는 데 실패했습니다.');
      }
    };

    fetchCategories();
  }, [token]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    // [x] formData 확인
    const formData = new FormData();
    const categoryId = categories.find(cat => cat.name === selectedCategory)?.id || 0;

    const classroomCreateDto = {
      categoryId: categoryId,
      name: title,
      object: objective,
      description: description,
      instructorInfo: instructorInfo,
      prerequisite: prerequisite || null,
      announcement: announcement || null,
    };

    // JSON 데이터를 Blob으로 변환하여 추가
    formData.append('classroomCreateDto', new Blob([JSON.stringify(classroomCreateDto)], { type: 'application/json' }));

    // 이미지 파일 추가
    if (bannerImage) {
      formData.append('imagefile', bannerImage || null); // key를 'imagefile'로 설정
    }

    try {
      const response = await axios.post(endpoints.classes, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log(response.data.message_kor);
        // NOTE: 생성된 강의의 id를 path로 전달하도록 변경
        navigate(`/lecture/created/${response.data.data.id}`);
      } 
    } catch (error) {
          if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
              alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
          } else if (error.response?.status === 400) {
            alert(error.response.data.message_kor || '강의 개설에 실패했습니다.');
          } else {
              alert('알 수 없는 오류가 발생했습니다.');
          }
      } else {
          console.error('Enrollment request failed:', error);
          alert('강의 개설에 실패했습니다.');
      }
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBannerImageUpload = (file: File | null) => {
    setBannerImage(file);
  };

  // [x] 버튼 valid 테스트 
  const validateForm = () => {
    let isValid = true;

    if (!selectedCategory) {
      isValid = false;
      setCategoryHelperText('카테고리는 필수 항목입니다.');
    } else {
      setCategoryHelperText('');
    }

    if (!isValidTextInput(title)) {
      isValid = false;
      setTitleHelperText('강의 제목은 필수 항목입니다.');
    } else {
      const titleValidation = getTitleHelperText(title);
      setTitleHelperText(titleValidation);
      if (titleValidation) {
        isValid = false;
      }
    }

    if (!isValidTextInput(objective)) {
      isValid = false;
      setObjectiveHelperText('강의 목표는 필수 항목입니다.');
    } else {
      setObjectiveHelperText('');
    }

    if (!isValidTextInput(description)) {
      isValid = false;
      setDescriptionHelperText('강의 소개는 필수 항목입니다.');
    } else {
      setDescriptionHelperText('');
    }

    setIsFormValid(isValid);
  }; 
  
  useEffect(validateForm, [selectedCategory, title, objective, description]);

  return (
    <Container>
      <h1 className={styles.title}>강의 개설하기</h1>

      <div className={styles.inputField}>
        <label className={styles.label}>
          카테고리 <span className={styles.required}>*</span>
        </label>
        <CategorySelect 
          categories={categories} 
          selected={selectedCategory} 
          onSelectCategory={handleCategoryChange} 
          // NOTE : '전체 카테고리' 항목 대신 '카테고리 선택' 표시
          defaultVal=''
          defaultName='카테고리 선택'
        />
        {categoryHelperText && <p className={styles.helperText}>{categoryHelperText}</p>}
      </div>

      <InputField 
        label="강의 제목" 
        placeholder="강의 제목을 작성해주세요" 
        isRequired 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        helperText={titleHelperText}
      />

      <InputField 
        label="강의 목표" 
        placeholder="강의 목표를 작성해주세요" 
        isRequired 
        value={objective}
        onChange={(e) => setObjective(e.target.value)}
        helperText={objectiveHelperText}
      />

      <InputField 
        label="강의 소개" 
        placeholder="강의 소개를 작성해주세요" 
        isRequired 
        isTextArea 
        height={100}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        helperText={descriptionHelperText}
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
        value={prerequisite}
        onChange={(e) => setPrerequisite(e.target.value)}
      />

      <FileUpload onFileSelect={handleBannerImageUpload}/>

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