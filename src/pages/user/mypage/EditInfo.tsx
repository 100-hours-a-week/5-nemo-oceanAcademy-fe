// #C-2: MyPage(/EditInfo) - 사용자 페이지 (프로필 수정)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './EditInfo.module.css';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import WideButton from '../../../components/wide-button/WideButton';
import { Container, Space, Row, Column } from '../.\./../styles/GlobalStyles';

// import images
import editImage from '../../../assets/images/icon/edit.svg';
import addImage from '../../../assets/images/icon/add.svg';
import profile1 from '../../../assets/images/profile/crab.png';
import profile2 from '../../../assets/images/profile/jellyfish.png';
import profile3 from '../../../assets/images/profile/seahorse.png';
import profile4 from '../../../assets/images/profile/turtle.png';
import profile5 from '../../../assets/images/profile/whale.png';

const profileImages = [ profile1, profile2, profile3, profile4, profile5 ];

const EditInfo: React.FC = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [helperText, setHelperText] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [initialNickname, setInitialNickname] = useState('');
    const [initialEmail, setInitialEmail] = useState('');
    const [initialProfilePic, setInitialProfilePic] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isButtonActive, setIsButtonActive] = useState(false);
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

              const fetchedProfileImage = userData.profile_image_path 
                ? userData.profile_image_path 
                : getProfileImage(userData.nickname);

                setProfileImage(fetchedProfileImage);
                setPreview(fetchedProfileImage);
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
    
        if (!file) {
          return;
        }
    
        if (
          (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') &&
          file.size <= 5 * 1024 * 1024
        ) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result as string);
          reader.readAsDataURL(file);
    
          // 파일을 선택한 후에는 선택창이 다시 나오지 않도록 input 값을 리셋
          event.target.value = ''; 
        } else {
          alert('유효하지 않은 파일입니다. 5MB 이하의 .jpg/jpeg 또는 .png 파일만 가능합니다.');
        }
      };
    
    const handleRemovePhoto = () => {
    setSelectedFile(null);
    setPreview(null);
    };

    const handleFileClick = () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.click();
    }};

    const handleSaveClick = async () => {
        const isChanged = 
        nickname !== initialNickname || 
        email !== initialEmail || 
        selectedFile !== null;

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

    const confirmDeleteAccount = () => {
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

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const handleClass = () => {
      navigate('/mypage');
    }  
    
    const handleClassroom = () => {
        navigate('/classroom');
    }

    const handleEdit = () => {
        navigate('/edit-info');
    }

    const breadcrumbItems = [
      { label: '홈', link: '/' },
      { label: '내 강의실', link: '/mypage' },
      { label: '프로필 설정', link: '/edit-info' }
    ];

    return (
        <div className={styles.container}>
          <Breadcrumb items={breadcrumbItems} />
            <Space height={"48px"} />
            <Row>
                <div className={styles.user}>
                    <Row align={"fill"}>
                        <h3>강좌 관리 by {nickname}</h3>
                        <img src={editImage} className={styles.editIcon} onClick={handleEdit} alt="Edit Button" /> 
                    </Row>

                    <Space height={"32px"} />
                    <button className={styles.myClassesButton} onClick={handleClass}>
                        내가 개설한 강의
                    </button>
                    <button className={styles.myClassroomButton} onClick={handleClassroom}>
                        내가 수강 중인 강의
                    </button>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        로그아웃
                    </button>
                </div>

            <section className={styles.profile}>
                <Column>
                    <Row align='left'><div className={styles.title}>프로필 설정</div></Row>
                    <div className={styles.divider} />
                    <Space height='24px'/>
                    <Row align='left'>
                    <label htmlFor="fileInput" className={styles.label}>프로필 사진</label>
                    <Column>
                        <div className={styles.imageContainer}>
                        <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                        <button className={styles.uploadImageButton} onClick={handleFileClick}>
                            {preview ? (
                            <img src={preview} alt="Preview" className={styles.previewImage} />
                            ) : (
                            <img src={profile5} alt="default profile image" className={styles.previewImage} />
                            )}
                        </button>
                        
                        <div className={styles.buttonContainer}>  
                            <button className={styles.uploadButton} onClick={handleFileClick}>
                            사진 변경
                            </button>
                            <button className={styles.deleteButton} onClick={handleRemovePhoto}>
                            삭제
                            </button>
                        </div>
                        <ul className={styles.bulletList}>
                            <li className={styles.listItem}>파일 사이즈는 100*100을 권장합니다.</li>
                            <li className={styles.listItem}>파일 크기는 5MB 이하만 가능합니다.</li>
                            <li className={styles.listItem}>파일은 .jpg, .jpeg, .png만 업로드할 수 있습니다. </li>
                            <li className={styles.listItem}>사진을 업로드하지 않을 경우 기본 프로필로 설정됩니다.</li>
                        </ul>
                        </div>
                    </Column>
                    </Row>
                    <Space height='36px'/>
                    <Row align='left'>
                    <label className={styles.label}>닉네임<span className={styles.requiredMark}>*</span></label>
                    <Column>
                        <input
                        type="text"
                        className={styles.inputField}
                        placeholder="닉네임을 입력해주세요."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        />
                        {helperText && <p className={styles.helperText}>{helperText}</p>}
                    </Column>
                    </Row>
                    <Space height='20px'/>
                    <Row align='left'>
                    <label className={styles.label}>이메일</label>
                    <Column>
                        <input
                        type="email"
                        className={styles.inputField}
                        placeholder="이메일을 입력해주세요."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </Column>
                    </Row>
                    <Space height='64px'/>
                    <WideButton 
                    text="저장" 
                    onClick={handleSaveClick}
                    />
                    <Space height={"24px"} />
                    <button className={styles.quitButton} onClick={confirmDeleteAccount}>
                        회원탈퇴
                    </button>
                    <Space height={"48px"} />
                </Column>
            </section>
        </Row>
      </div>
    )
};

export default EditInfo;