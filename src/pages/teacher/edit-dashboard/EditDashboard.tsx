import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import InfoSection from '../../../components/dashboard/InfoSection';
import styles from './EditDashboard.module.css';
import { Container } from '../../../styles/GlobalStyles';

const EditDashboard: React.FC = () => {
  const navigate = useNavigate();

  // 강의 데이터를 useState로 관리
  const [lectureData, setLectureData] = useState({
    instructor: '헤이즐리',
    title: '즐리가 만든 소금빵이 제일 맛있어',
    category: '쿠킹',
    bannerImage: '', // 배너 이미지 URL
    announcement: '8/2 수업 오후 10시 시작\n준비물 : 밀가루, 물, 치킨, 초콜릿, 감자, 해파리\n상담 가능 시간 : 8/1 오후 7시~',
    objective: '이 강의는 소금빵을 만드는 방법을 배우는 것을 목표로 합니다.',
    description: '소금빵의 다양한 레시피와 실습을 통해 최고의 소금빵을 만들 수 있습니다.',
    instructorInfo: '헤이즐리 강사는 쿠킹 전문가로 다년간의 경험을 보유하고 있습니다.',
    precourse: '밀가루와 물을 사전에 준비해 주세요.',
  });

  const handleInputChange = (field: string, value: string) => {
    setLectureData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => handleInputChange('bannerImage', reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Invalid file. Please select a .jpg or .png file under 5MB.');
    }
  };

  const handleCancel = () => {
    navigate('/teacher/dashboard');
  };
/*
  const handleSave = () => {
    // 수정 완료 버튼을 누르면 API 요청을 보내고, 요청이 성공하면 DashboardTeacher로 이동
    try {
      const response = await fetch('/api/update-lecture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          title,
          objective,
          description,
          instructorInfo,
          precourse,
          announcement,
          bannerImage,
        }),
      });

      if (response.ok) {
        alert('수정이 완료되었습니다.');
        navigate('/teacher/dashboard');
      } else {
        alert('수정에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생하였습니다. 다시 시도해주세요.');
    }
  };
*/
  return (
    <Container>
      <LectureMeta
        instructor={lectureData.instructor}
        title={
          <input
            className={styles.input}
            value={lectureData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        }
        category={
          <select
            className={styles.select}
            value={lectureData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="프로그래밍">프로그래밍</option>
            <option value="쿠킹">쿠킹</option>
            <option value="미술">미술</option>
            {/* 추가 카테고리 옵션 */}
          </select>
        }
      />

      <Banner image={lectureData.bannerImage}>
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="bannerImageInput"
        />
        <button
          className={styles.uploadButton}
          onClick={() => document.getElementById('bannerImageInput')?.click()}
        >
          {lectureData.bannerImage ? '이미지 변경' : '이미지 등록'}
        </button>
      </Banner>

      <Announcement
        content={
          <textarea
            className={styles.textarea}
            value={lectureData.announcement}
            onChange={(e) => handleInputChange('announcement', e.target.value)}
          />
        }
      />

      <InfoSection
        title="강의 목표"
        content={
          <textarea
            className={styles.textarea}
            value={lectureData.objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
          />
        }
      />

      <InfoSection
        title="강의 소개"
        content={
          <textarea
            className={styles.textarea}
            value={lectureData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        }
      />

      <InfoSection
        title="강사 소개"
        content={
          <textarea
            className={styles.textarea}
            value={lectureData.instructorInfo}
            onChange={(e) => handleInputChange('instructorInfo', e.target.value)}
          />
        }
      />

      <InfoSection
        title="사전 준비 사항"
        content={
          <textarea
            className={styles.textarea}
            value={lectureData.precourse}
            onChange={(e) => handleInputChange('precourse', e.target.value)}
          />
        }
      />

      <div className={styles.buttonContainer}>
        <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
        <button className={styles.saveButton}>수정 완료</button>
      </div>
    </Container>
  );
};


export default EditDashboard;