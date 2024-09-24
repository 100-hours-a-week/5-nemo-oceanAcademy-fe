import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputField from '../../../components/input-field/InputField';
import FileUpload from '../../../components/file-upload/FileUpload';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import CategorySelect from 'components/category-select/CategorySelect';
import styles from './LectureOpen.module.css';
import { Container } from '../../../styles/GlobalStyles';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import { isValidTextInput, getTitleHelperText } from '../../../utils/validation';

import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Space from '../../../components/Space';
import Announcement from "../../../components/dashboard/Announcement";

interface Category {
  id: number;
  name: string;
}

const LectureOpen: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const [isFormValid, setIsFormValid] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [objective, setObjective] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [instructorInfo, setInstructorInfo] = useState<string>('');
  const [prerequisite, setPrerequisite] = useState<string>('');
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184); // 모바일 상태 추가
  const [categoryHelperText, setCategoryHelperText] = useState<string>('카테고리는 필수 항목입니다.');
  const [titleHelperText, setTitleHelperText] = useState<string>('강의 제목은 필수 항목입니다.');
  const [objectiveHelperText, setObjectiveHelperText] = useState<string>('강의 목표는 필수 항목입니다.');
  const [descriptionHelperText, setDescriptionHelperText] = useState<string>('강의 소개는 필수 항목입니다.');

  useEffect(() => {
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

    // 윈도우 크기 감지
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1184); // 1184px 이하일 경우 모바일 상태로 간주
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [token]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

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
        },
      });

      if (response.status === 200) {
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

  // 강의공지

  const [dashboard, setDashboard] = useState({
    instructor: '',
    category_id: 0,
    name: '',
    object: '',
    description: '',
    instructor_info: '',
    prerequisite: '',
    announcement: '',
    banner_image_path: '',
    is_active: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setDashboard(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
      <div>
        <div className={styles.desktopNavigator}>
          <a href="/">홈</a> &gt;
          <a href="/mypage"> 내 강의실</a> &gt;
          <span> 강의개설</span>
        </div>
        <hr />

        {isMobile ? (
            // 모바일 UI
            <Container>
              <Row align={"center"}>
                <h1 className={styles.title}>강의 개설하기</h1>
              </Row>

              <div className={styles.mobileContainer}>
              <div className={styles.inputField}>
                <label className={styles.label}>
                  카테고리 <span className={styles.required}>*</span>
                </label>
                {categoryHelperText && <p className={styles.helperText}>{categoryHelperText}</p>}
                <CategorySelect
                    categories={categories}
                    selected={selectedCategory}
                    onSelectCategory={handleCategoryChange}
                    defaultVal=''
                    defaultName='카테고리 선택'
                />
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

              <FileUpload />

              <div className={styles.buttonContainer}>
                <Button
                    text="강의 개설하기"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                />
              </div>
            </div>
            </Container>
        ) : (
            // 데스크탑 UI
            <Column align={"all"}>
              <div className={styles.desktopContainer}>
                <Space height={"30px"} />

                {/* 강의 배너 이미지 */}
                <FileUpload />
                <Space height={"20px"} />

                <div className={styles.desktopBox}>
                  <Column>
                    <Row gap={"20px"}>

                      {/* 강의 제목 */}
                      <InputField
                          label="강의 제목"
                          placeholder="2자 이상 24자 이하의 강의 제목을 작성해주세요."
                          isRequired
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          helperText={titleHelperText}
                      />

                      {/* 카테고리 선택 */}
                      <div className={styles.inputField}>
                        <label className={styles.label}>
                          카테고리 <span className={styles.required}>*</span>
                        </label>
                        <Row align={"left"}>
                          <CategorySelect
                              categories={categories}
                              selected={selectedCategory}
                              onSelectCategory={handleCategoryChange}
                              defaultVal=''
                              defaultName='카테고리 선택'
                          />
                        </Row>
                        {categoryHelperText && <p className={styles.helperText}>{categoryHelperText}</p>}
                      </div>

                    </Row>

                    {/* 강의 목표 */}
                    <InputField
                        label="강의 목표"
                        placeholder="강의 목표를 작성해주세요"
                        isRequired
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        helperText={objectiveHelperText}
                    />

                    {/* 강의 소개 */}
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

                    {/* 강의 공지, API 수정 필요 */}
                    <Announcement
                        className="editSection"
                        content={
                          <textarea
                              className={styles.textarea}
                              onChange={(e) => handleInputChange('announcement', e.target.value)}
                          />
                        }
                    />

                    {/* 강사 소개 */}
                    <InputField
                        label="강사 소개 (선택)"
                        placeholder="강사 소개를 작성해주세요"
                        isTextArea
                        height={100}
                        value={instructorInfo}
                        onChange={(e) => setInstructorInfo(e.target.value)}
                        helperText="no"
                    />

                    {/* 사전 지식 준비 */}
                    <InputField
                        label="강의에 필요한 사전 지식 및 준비 안내 (선택)"
                        placeholder="사전 지식 및 준비 안내를 작성해주세요"
                        isTextArea
                        height={100}
                        value={prerequisite}
                        onChange={(e) => setPrerequisite(e.target.value)}
                        helperText="no"
                    />

                  </Column>
                </div>
                <Space height={"20px"} />

                <Row align={"center"}>
                  <div className={styles.buttonContainer}>
                    <Button
                        backgroundColor={"#2A62F2"}
                        text="강의 개설하기"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    />
                  </div>
                </Row>
                <Space height={"100px"} />

              </div>
            </Column>
        )}

        <Navigation />
      </div>
  );
};

export default LectureOpen;
