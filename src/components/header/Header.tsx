// Header Component - in App.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import Modal from '../modal/Modal';
import axios from 'axios';
import endpoints from '../../api/endpoints';
import { useUserStore } from '../../stores/userStore';

// image import
import backIcon from '../../assets/images/icon/back.png';
import outIcon from '../../assets/images/icon/out.png';
import closeIcon from '../../assets/images/icon/close.png';
import profile1 from '../../assets/images/profile/crab.png';
import profile2 from '../../assets/images/profile/jellyfish.png';
import profile3 from '../../assets/images/profile/seahorse.png';
import profile4 from '../../assets/images/profile/turtle.png';
import profile5 from '../../assets/images/profile/whale.png';

const profileImages = [ profile1, profile2, profile3, profile4, profile5 ];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState<string | null>(null);

  const getProfileImage = (nickname: string): string => {
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % profileImages.length);
    return profileImages[index];
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); 
  
    if (!token) { 
      setIsLoggedIn(false);
      return; 
    }

    setIsLoggedIn(true);

    axios
      .get(endpoints.userInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const nickname = response.data.data.nickname;
        setNickname(nickname);
        const profilePath = response.data.data.profile_image_path;

        setProfileImage(profilePath || getProfileImage(nickname));
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          console.error('Unauthorized:', error.response);
          
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          navigate('/login');
        } else {
          console.error('Failed to fetch user info:', error);
        }
      });
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
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLeaveClick = () => {
    setShowModal(true);
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate('/mypage');
    } else {
      handleLogin();
    }
  };

  const handleSettingClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('권한이 없습니다.');
      return;
    }
    axios.delete(endpoints.user, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        alert('회원탈퇴가 완료되었습니다.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        navigate('/');
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        alert('권한이 없습니다.');
      } else {
        console.error('Failed to delete account:', error);
        alert('회원탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    });
    setShowDeleteModal(false);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteModal(false);
  };

  // 페이지에 따라 헤더의 버튼 요소 다르게 띄우는 코드 
  const renderLeftButton = () => {
    if (
      location.pathname === '*'
    ) return null;

    if (location.pathname.includes(`/live/student`) || location.pathname.includes('/live/teacher')) {
      return (
        <img
          src={location.pathname.includes('/live/student') ? outIcon : closeIcon}
          alt="나가기"
          className={styles.icon}
          onClick={handleLeaveClick}
        />
      );
    } else if (
      location.pathname === '/mypage' ||
      location.pathname === '/lecture/open' ||
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
        location.pathname === '/sign-info' ||
        location.pathname === '/oauth/kakao/callback' ||
        location.pathname === '*'
    ) {
      return null;
    }
    if (!isLoggedIn) {
      return (
        <button className={styles.loginButton} onClick={handleLogin}>
          로그인
        </button>
      );
    } else if (
      location.pathname === '/' ||
      location.pathname === '/list' ||
      location.pathname === '/live-list' ||
      location.pathname === '/classroom' ||
      location.pathname === '/mypage' || 
      location.pathname.includes('/lecture/open') ||
      location.pathname.includes('/lecture/info') ||
      location.pathname.includes('/dashboard') ||
      location.pathname.includes('/lecture/students')
    ) {
      return (
        <div className={styles.classroom} onClick={handleProfileClick}>
          <h5>내 강의실</h5>
          <img
            src={profileImage}
            alt="프로필"
            className={styles.profileImage}
            onError={(e) => {
              // 이미지 로드에 실패하면 기본 이미지로 교체
              // (e.target as HTMLImageElement).src = getProfileImage(nickname);
            }}
          />
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.leftButton}>
          {renderLeftButton()}
        </div>
        <div onClick={handleLogoClick} className={styles.logo}>
          바다서원
        </div>
        <div className={styles.rightButton}>
          {renderRightButton()}
        </div>
      </div>
      <div className={styles.divider} />
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
      {showDeleteModal && (
        <Modal
          title="탈퇴하시겠습니까?"
          content="삭제한 계정은 복구할 수 없습니다.
          그래도 탈퇴하시겠습니까?"
          leftButtonText="탈퇴"
          rightButtonText="취소"
          onLeftButtonClick={confirmDeleteAccount}
          onRightButtonClick={cancelDeleteAccount}
        />
      )}
    </div>
  );
};

export default Header;
