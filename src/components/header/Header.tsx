import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import profImage from '../../assets/images/profile_default.png';
import backIcon from '../../assets/images/back.png';
import settingIcon from '../../assets/images/setting.png';
import outIcon from '../../assets/images/out.png';
import closeIcon from '../../assets/images/close.png';
import Modal from '../modal/Modal'; 

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = false;

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    // 로그아웃 로직
    navigate('/login');
  };

  const handleLeaveClick = () => {
    setShowModal(true); // 모달 열기
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1); // 이전 화면으로 이동
  };

  const handleModalCancel = () => {
    setShowModal(false); // 모달 닫기
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/mypage');
    } else {
      handleLogin();
    }
  };

  const handleSettingClick = () => {
    // 세팅 버튼 클릭 시 드롭다운 메뉴 표시 로직 필요
  };

  const handleLectureOut = () => {
    // 강의 나가기 

  }

  // 페이지에 따라 헤더의 버튼 요소 다르게 띄우는 코드 
  const renderLeftButton = () => {
    if (location.pathname === '/live/student' || location.pathname === '/live/teacher') {
      return (
        <img
          src={location.pathname === '/live/student' ? outIcon : closeIcon}
          alt="나가기"
          className={styles.icon}
          onClick={handleLeaveClick}
        />
      );
    } else if (
      location.pathname === '/mypage' ||
      location.pathname === '/lecture/open' ||
      location.pathname === '/lecture/info' ||
      location.pathname === '/dashboard/teacher' ||
      location.pathname === '/dashboard/student' ||
      location.pathname === '/student/list' ||
      location.pathname === '/dashboard/edit'
    ) {
      return (
        <img
          src={backIcon}
          alt="뒤로가기"
          className={styles.icon}
          onClick={handleBackClick}
        />
      );
    }
    return null;
  };

  const renderRightButton = () => {
    if (location.pathname === '/mypage') {
      return (
        <img
          src={settingIcon}
          alt="설정"
          className={styles.icon}
          onClick={handleSettingClick}
        />
      );
    } else if (!isLoggedIn && (location.pathname === '/' || location.pathname === '/list' || location.pathname === '/live-list')) {
      return (
        <div className={styles.loginText} onClick={handleLogin}>
          Login
        </div>
      );
    } else if (
      location.pathname === '/' ||
      location.pathname === '/list' ||
      location.pathname === '/live-list' ||
      location.pathname === '/classroom' ||
      location.pathname === '/lecture/open' ||
      location.pathname === '/lecture/info' ||
      location.pathname === '/dashboard/teacher' ||
      location.pathname === '/dashboard/student' ||
      location.pathname === '/lecture/students' ||
      location.pathname === '/dashboard/edit'
    ) {
      return (
        <img
          src={profImage}
          alt="프로필"
          className={styles.icon}
          onClick={handleProfileClick}
        />
      );
    }
    return null;
  };
  
  return (
    <header className={styles.header}>
      <div className={styles.leftButton}>
        {renderLeftButton()}
      </div>
      <div onClick={handleLogoClick} className={styles.logo}>
        Ocean Academy
      </div>
      <div className={styles.rightButton}>
        {renderRightButton()}
      </div>
      {showModal && (
        <Modal
          title="강의를 나가시겠습니까?"
          content="아직 강의 중이에요!"
          leftButtonText="나가기"
          rightButtonText="취소"
          onLeftButtonClick={handleModalLeave}
          onRightButtonClick={handleModalCancel}
        />
      )}
    </header>
  );
};

export default Header;