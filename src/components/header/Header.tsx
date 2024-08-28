import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import profImage from '../../assets/images/profile_default.png';
import backIcon from '../../assets/images/back.png';
import settingIcon from '../../assets/images/setting.png';
import outIcon from '../../assets/images/out.png';
import closeIcon from '../../assets/images/close.png';
import Modal from '../modal/Modal';
import axios from 'axios';
import endpoints from '../../api/endpoints';  

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState(profImage);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
    setIsLoggedIn(!!token);
  
    if (token) {
      axios
        .get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserName(response.data.nickname);
          setUserProfileImage(response.data.profile_image);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            console.error('Unauthorized:', error.response);
            // Handle unauthorized error, e.g., redirect to login
          } else {
            console.error('Failed to fetch user info:', error);
          }
        });
    }
  }, [navigate]);


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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      handleLogin();
    }
  };

  const handleSettingClick = () => {
    // 세팅 버튼 클릭 시 드롭다운 메뉴 표시 로직 필요
    alert('아직 구현 안됐거든요 로그아웃 안해드립니다 탈퇴? 못합니다');
    console.log('들어올 땐 마음대로지만 나갈 땐 아니란다. ');
  };

  const handleLectureOut = () => {
    // 강의 나가기 

  }

  // 페이지에 따라 헤더의 버튼 요소 다르게 띄우는 코드 
  const renderLeftButton = () => {
    if (location.pathname.includes('/live/student') || location.pathname.includes('/live/teacher')) {
      return (
        <img
          src={location.pathname.includes('/live/student') ? outIcon : closeIcon}
          alt="나가기"
          className={styles.icon}
          onClick={handleLeaveClick}
        />
      );
    } else if (
      location.pathname.includes('/mypage') ||
      location.pathname.includes('/lecture/open') ||
      location.pathname.includes('/lecture/info') ||
      location.pathname.includes('/dashboard/teacher') ||
      location.pathname.includes('/dashboard/student') ||
      location.pathname.includes('/dashboard/edit') ||
      location.pathname.includes('/lecture/students')
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
    if (
        location.pathname === '/login' ||
        location.pathname === '/sign-info'
    ) {
      return null;
    }
    if (location.pathname.includes('/mypage')) {
      return (
        <img
          src={settingIcon}
          alt="설정"
          className={styles.icon}
          onClick={handleSettingClick}
        />
      );
    } else if (!isLoggedIn) {
      return (
        <div className={styles.loginText} onClick={handleLogin}>
          Login
        </div>
      );
    } else if (
      location.pathname === '/' ||
      location.pathname === '/list' ||
      location.pathname === '/live-list' ||
      location.pathname.includes('/classroom') ||
      location.pathname.includes('/lecture/open') ||
      location.pathname.includes('/lecture/info') ||
      location.pathname.includes('/dashboard/teacher') ||
      location.pathname.includes('/dashboard/student') ||
      location.pathname.includes('/lecture/students') ||
      location.pathname.includes('/dashboard/edit')
    ) {
      return (
        <img
          src={userProfileImage}
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
