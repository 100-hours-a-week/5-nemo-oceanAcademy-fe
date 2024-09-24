import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import InfoSection from '../../../components/dashboard/InfoSection';
import styles from './EditDashboard.module.css';
import { Container } from '../../../styles/GlobalStyles';
import axios from 'axios';
import endpoints from '../../../api/endpoints';

const EditDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [dashboard, setDashboard] = useState({
    instructor: '',
    category_id: 0,
    category: '',
    name: '',
    object: '',
    description: '',
    instructor_info: '',
    prerequisite: '',
    announcement: '',
    banner_image_path: '',
    is_active: false,
  });
  const token = localStorage.getItem('accessToken');
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력 필드 참조

  // 기존 강의 정보 불러오기
  useEffect(() => {
    const fetchLectureData = async () => {
      try {
        const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const lecture = response.data.data;
        setDashboard({
          instructor: lecture.instructor,
          category_id: lecture.category_id,
          category: lecture.category,
          name: lecture.name,
          object: lecture.object,
          description: lecture.description,
          instructor_info: lecture.instructor_info,
          prerequisite: lecture.prerequisite,
          announcement: lecture.announcement,
          banner_image_path: lecture.banner_image_path,
          is_active: lecture.is_active,
        });
      } catch (error) {
        console.error('Failed to fetch lecture data:', error);
        alert('강의 정보를 불러오는 데 실패했습니다.');
      }
    };
    
    if (classId) {
      fetchLectureData();
    }
  }, [classId, token]);

  // 입력값 변경 핸들러
  const handleInputChange = (field: string, value: string | boolean) => {
    setDashboard(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  // 파일 변경 핸들러 (이미지)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => handleInputChange('banner_image_path', reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Invalid file. Please select a .jpg or .png file under 5MB.');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      console.log('fileInputRef exists');  // 참조 확인
      fileInputRef.current.click();
    }
  };


  // 저장 핸들러 (API 요청)
  const handleSave = async () => {
    const formData = new FormData();

    formData.append('categoryId', String(dashboard.category_id));
    formData.append('name', dashboard.name);
    formData.append('object', dashboard.object);
    formData.append('description', dashboard.description);
    formData.append('instructorInfo', dashboard.instructor_info);
    formData.append('prerequisite', dashboard.prerequisite);
    formData.append('announcement', dashboard.announcement);
    if (dashboard.banner_image_path) formData.append('bannerImagefile', dashboard.banner_image_path);
    formData.append('isActive', String(dashboard.is_active));

    try {
      const response = await axios.patch(endpoints.getLectureInfo.replace('{classId}', classId || ''), formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('수정이 완료되었습니다.');
        navigate(`/teacher/dashboard/${classId}`);
      } else {
        alert('수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error updating lecture:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    navigate(`dashboard/teacher/${classId}`);
  };

  return (
    <Container>
        <LectureMeta
            className="editSection"
            instructor={dashboard.instructor}
            category=
              {dashboard.category}
            
        />
        <div style={{"width" : "100%", "height" : "10px"}}/>

        <InfoSection
            className="editSection"
            title="강의 제목"
            helpertext="* helpertext"
            essential="*"
            content={
                <input
                    style={{
                        "border": "none",
                        "width": "100%",
                        "height": "10px",
                        "padding": "0",
                        "margin": "0",
                        "outline": "none",
                        "fontSize":"14px"
                    }}
                    className={styles.input}
                    value={dashboard.name}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                />

            }
        />

      <Announcement
        className="editSection"
        content={
          <textarea
            className={styles.textarea}
            value={dashboard.announcement}
            onChange={(e) => handleInputChange('announcement', e.target.value)}
          />
        }
      />

      <InfoSection
        className="editSection"
        title="강의 목표"
        helpertext="* helpertext"
        essential="*"
        content={
          <textarea
            className={styles.textarea}
            value={dashboard.object}
            onChange={(e) => handleInputChange('objective', e.target.value)}
          />
        }
      />

      <InfoSection
        className="editSection"
        title="강의 소개"
        helpertext="* helpertext"
        essential="*"
        content={
          <textarea
            className={styles.textarea}
            value={dashboard.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        }
      />

      <InfoSection
        className="editSection"
        title="강사 소개 (선택)"
        helpertext="* helpertext"
        essential=""
        content={
          <textarea
            className={styles.textarea}
            value={dashboard.instructor_info}
            onChange={(e) => handleInputChange('instructorInfo', e.target.value)}
          />
        }
      />

      <InfoSection
        className="editSection"
        title="강의에 필요한 사전 지식 및 준비 안내 (선택)"
        helpertext="* helpertext"
        essential=""
        content={
          <textarea
            className={styles.textarea}
            value={dashboard.prerequisite}
            onChange={(e) => handleInputChange('precourse', e.target.value)}
          />
        }
      />

        <div className={styles.imagetitle}>
            <h4>강의 배너 사진 업로드</h4>
        </div>
        <Banner image={dashboard.banner_image_path}></Banner>
        <div>
          <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ visibility: 'hidden', position: 'absolute' }} 
          />

          <div className={styles.warningtext}>
            <li>사진은 1개만 업로드할 수 있습니다.</li>
            <li>파일 사이즈는 350*100을 권장합니다.</li>
            <li>파일 확장자는 .jpg, .png만 가능합니다</li>
            <li>5MB이하의 파일만 업로드할 수 있습니다.</li>
          </div>

          <button
              className={styles.uploadButton}
              onClick={handleImageClick}
          >
            {dashboard.banner_image_path ? '이미지 변경' : '이미지 등록'}
          </button>
        </div>

      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
        <button className={styles.saveButton} onClick={handleSave}>수정 완료</button>
      </div>



    </Container>
  );
};


export default EditDashboard;