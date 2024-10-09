// #C-1: MyPage(/mypage) - 사용자 페이지 (프로필 수정, 내가 개설한 강의 조회, 강의 개설 페이지로 이동)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import LectureCard from '../../../components/lecture-card/LectureCard';
import EmptyContent from '../../../components/empty-content/EmptyContent';
import Navigation from '../../../components/navigation/Navigation';
import styles from './MyPage.module.css';
import { Container, Space } from '../.\./../styles/GlobalStyles';

// import images
import profileDefault1 from '../../../assets/images/profile/jellyfish.png';
import profileDefault2 from '../../../assets/images/profile/whale.png';
import profileDefault3 from '../../../assets/images/profile/crab.png';
import emptyImage from '../../../assets/images/utils/empty.png';
import editImage from '../../../assets/images/icon/edit_w.png';
import image1 from '../../../assets/images/banner/image1.png';
import image2 from '../../../assets/images/banner/image2.jpeg';
import image3 from '../../../assets/images/banner/image3.png';
import image4 from '../../../assets/images/banner/image4.png';
import image5 from '../../../assets/images/banner/image5.jpeg';
import image6 from '../../../assets/images/banner/image6.png';
import image7 from '../../../assets/images/banner/image7.png';
import image8 from '../../../assets/images/banner/image8.jpeg';
import image9 from '../../../assets/images/banner/image9.png';
import image10 from '../../../assets/images/banner/image10.jpeg';

const profileImages = [profileDefault1, profileDefault2, profileDefault3];

// 기본 이미지 배열
const defaultImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
];

interface Lecture {
    classId: number;
    name: string;
    bannerImage: string | null;
    instructor: string;
    category: string;
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [initialNickname, setInitialNickname] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const [initialProfilePic, setInitialProfilePic] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력 필드 참조
  const token = localStorage.getItem('accessToken');

  const getProfileImage = (nickname: string): string => {
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
      hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % profileImages.length);
    return profileImages[index];
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const userData = response.data.data;
          setNickname(userData.nickname);
          setEmail(userData.email || '이메일 정보 없음');
          setProfileImage(userData.profile_image_path ? userData.profile_image_path : getProfileImage(nickname));
        }
      } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.status === 401) {
          alert('사용자 인증에 실패했습니다. 다시 로그인하세요.');
          navigate('/login');
        } else {
          console.error('사용자 정보를 가져오는 중 오류가 발생했습니다:', axiosError.message);
        }
      }
    };

    fetchUserInfo();
  }, [navigate, token]);

  // 강의 목록 가져오기 API 요청 (페이지와 카테고리, 필터 적용)
  const fetchLectures = useCallback(async ( page: number = 0) => {
    setIsFetching(true);
    setIsLoading(true);

    try {
      const response = await axios.get(`${endpoints.classes}?page=${page}&target=created`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const lecturesData = response.data.data;

      if (lecturesData && lecturesData.length > 0) {
        const classes = response.data.data.map((item: any) => ({
          classId: item.id,
          name: item.name,
          bannerImage: item.banner_image_path || defaultImages[item.id % 10],
          instructor: item.instructor,
          category: item.category
        }));

        setLectures((prevLectures) => [...prevLectures, ...classes]);
        setHasMore(classes.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch lectures:', error.message);
      } else {
        console.error('Failed to fetch created classes:', error);
      }
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  // 스크롤이 끝에 도달했는지 확인하는 함수
  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isFetching, hasMore]);

  // 페이지가 변경되면 새 강의 목록을 불러옴
  useEffect(() => {
    if (page === 0) {
      setLectures([]);
    }

    fetchLectures(page);
  }, [page, fetchLectures]);

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0])); // preview
      setIsButtonActive(true);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const isChanged = 
    nickname !== initialNickname || 
    email !== initialEmail || 
    selectedFile !== null;

    if (!isChanged) {
      setIsEditing(false); // 아무 변경 사항이 없을 경우 편집 모드 해제만
      return;
    }

    setIsEditing(false);

    // 수정된 정보를 FormData로 구성
    const formData = new FormData();
    const userUpdateDTO = { nickname, email };
    formData.append(
      'userUpdateDTO',
      new Blob([JSON.stringify(userUpdateDTO)], { type: 'application/json' })
    );
    if (selectedFile) {
      formData.append('imagefile', selectedFile);
    }

    try {
      const response = await axios.patch(endpoints.userInfo, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log("수정 요청 완료");
        window.location.reload(); // 성공적으로 수정 후 페이지 새로고침
        // alert('회원 정보가 수정되었습니다.');
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
        alert('사용자 인증에 실패했습니다. 다시 로그인하세요.');
        navigate('/login');
      } else {
        console.error('회원 정보를 수정하는 중 오류가 발생했습니다:', axiosError.message);
      }
    }
  };

  const handleAddLectureClick = () => {
    navigate('/lecture/open');
  };

  const handleLectureClick = (classId: number) => {
    navigate(`/dashboard/teacher/${classId}`);
  };

  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 지워도 될 것 같다. main 올려보고 오류 없으면 지우기 
  const handleImageError = () => {
    setProfileImage(getProfileImage(nickname));
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <div className={styles.profileImageContainer} onClick={handleImageClick}>
          <img 
            src={profileImage} 
            alt="Profile" 
            className={`${styles.profilePicture} ${isEditing ? styles.profilePictureEditing : ''}`} 
            onError={handleImageError}
          />
          {isEditing && (
            <div className={styles.editOverlay}>
              <img src={editImage} alt="Edit Icon" className={styles.editIcon} />
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        <div className={styles.textContainer}>
          {isEditing ? (
            <input 
              type="text" 
              value={nickname} 
              onChange={(e) => setNickname(e.target.value)} 
              className={styles.nicknameInput} 
            />
          ) : (
            <p className={styles.nickname}>{nickname}</p>
          )}
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
            />
          ) : (
            <p className={styles.email}>{email}</p>
          )}
        </div>
        {isEditing ? (
          <button className={styles.saveButton} onClick={handleSaveClick}>
            완료
          </button>
        ) : (
          <button className={styles.saveButton} onClick={handleEditClick}>
            수정
          </button>
        )}
      </div>

      <div className={styles.lecturesHeader}>
        <h3>내가 개설한 강의</h3>
        <button className={styles.addLectureButton} onClick={handleAddLectureClick}>+</button>
      </div>
      <section>
      {lectures.length === 0 ? (
        <div className={styles.emptyContainer}>
          <p>아직 강의를 개설하지 않았어요.</p>
          <p>+ 버튼을 눌러 강의를 시작해보세요!</p>
          <img src={emptyImage} alt="No lectures available" className={styles.emptyImage} />
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
      </section>
      {isLoading && <p>Loading more lectures...</p>}
    </div>
  );
};

export default MyPage;