// #C-1: MyPage(/mypage) - 사용자 페이지 (프로필 수정, 내가 개설한 강의 조회, 강의 개설 페이지로 이동)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import { Container } from '../../../styles/GlobalStyles';
import LectureCard from '../../../components/lecture-card/LectureCard';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import styles from './MyPage.module.css';

interface Lecture {
    classId: number;
    name: string;
    bannerImage: string;
    instructor: string;
    category: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();

  // 사용자 정보와 강의 정보 (예시 데이터)
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('닉네임');
  const [profilePicture, setProfilePicture] = useState('');
  const lectures: Lecture[] = []; // 개설한 강의 리스트

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };

  const handleAddLectureClick = () => {
    navigate('/lecture/open');
  };

  const handleLectureClick = (classId: number) => {
    navigate(`/dashboard/student/${classId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <img 
          src={profilePicture} 
          alt="Profile" 
          className={isEditing ? styles.profilePictureEditing : styles.profilePicture} 
        />
        {isEditing ? (
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className={styles.usernameInput} 
          />
        ) : (
          <p className={styles.username}>{username}</p>
        )}
        {isEditing ? (
          <Button text="완료" onClick={handleSaveClick} />
        ) : (
          <button className={styles.editButton} onClick={handleEditClick}>✏️</button>
        )}
      </div>

      <div className={styles.lecturesHeader}>
        <h3>내가 개설한 강의</h3>
        <button className={styles.addLectureButton} onClick={handleAddLectureClick}>+</button>
      </div>

      {lectures.length === 0 ? (
        <div className={styles.noLecturesContainer}>
          <p>아직 강의를 개설하지 않았어요.</p>
          <p>+ 버튼을 눌러 강의를 시작해보세요!</p>
          <div className={styles.placeholderImage}></div>
        </div>
      ) : (
        <div className={styles.lectureGrid}>
          {lectures.map((lecture) => (
            <div key={lecture.classId} onClick={() => handleLectureClick(lecture.classId)}>
              <LectureCard 
                classId={lecture.classId} 
                bannerImage={lecture.bannerImage} 
                name={lecture.name} 
                instructor={lecture.instructor} 
                category={lecture.category} 
              />
            </div>
          ))}
        </div>
      )}

      <Navigation />
    </div>
  );
};

export default MyPage;