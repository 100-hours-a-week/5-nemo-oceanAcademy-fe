// Header Component - App.tsx에서 사용 
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import Modal from '../modal/Modal';
import axios from 'axios';
import endpoints from '../../api/endpoints';

// image import
import profileDefault1 from '../../assets/images/profile/jellyfish.png';
import profileDefault2 from '../../assets/images/profile/whale.png';
import profileDefault3 from '../../assets/images/profile/crab.png';
import backIcon from '../../assets/images/icon/back.png';
import settingIcon from '../../assets/images/icon/setting.png';
import outIcon from '../../assets/images/icon/out.png';
import closeIcon from '../../assets/images/icon/close.png';

const profileImages = [profileDefault1, profileDefault2, profileDefault3];

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
          // 유효하지 않은 토큰인 경우, 토큰을 지우고 로그인 상태를 false로 설정
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setIsLoggedIn(false);
          // navigate('/login');
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
    setShowModal(true); // 모달 열기
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1);
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
    setShowDropdown(!showDropdown);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true); // 회원탈퇴 모달 열기
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
    if (location.pathname === '/mypage') {
      return (
        <>
          <img
            src={settingIcon}
            alt="설정"
            className={styles.icon}
            onClick={handleSettingClick}
          />
          {showDropdown && (
            <div className={styles.dropdown}>
              <div onClick={handleLogout}>로그아웃</div>
              <div onClick={handleDeleteAccount}>회원탈퇴</div>
            </div>
          )}
        </>
      );
    } else if (!isLoggedIn) {
      return (
        <div className={styles.loginButton} onClick={handleLogin}>
          로그인
        </div>
      );
    } else if (
      location.pathname === '/' ||
      location.pathname === '/list' ||
      location.pathname === '/live-list' ||
      location.pathname === '/classroom' ||
      location.pathname.includes('/lecture/open') ||
      location.pathname.includes('/lecture/info') ||
      location.pathname.includes('/dashboard') ||
      location.pathname.includes('/lecture/students')
    ) {
      return (
        <img
          src={profileImage}
          alt="프로필"
          className={styles.icon}
          onClick={handleProfileClick}
          onError={(e) => {
            // 이미지 로드에 실패하면 기본 이미지로 교체
            // (e.target as HTMLImageElement).src = getProfileImage(nickname);
          }}
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
        바다서원
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
    </header>
  );
};

export default Header;
