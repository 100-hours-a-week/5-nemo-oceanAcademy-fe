import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './SignInfo.module.css';
import WideButton from '../../../components/wide-button/WideButton';
import { Row, Column, Space } from '../../../styles/GlobalStyles';

// image import
import profile1 from '../../../assets/images/profile/crab.png';
import profile2 from '../../../assets/images/profile/jellyfish.png';
import profile3 from '../../../assets/images/profile/seahorse.png';
import profile4 from '../../../assets/images/profile/turtle.png';
import profile5 from '../../../assets/images/profile/whale.png';

const profileImages = [ profile1, profile2, profile3, profile4, profile5 ];

interface LocationState {
  token: string;
  refreshToken: string;
}

const SignInfo = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [helperText, setHelperText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1184);

  // 오류 수정: location.state가 없을 때 기본값 처리 및 경고 메시지
  const token = location?.state?.token;
  const refreshToken = location?.state?.refreshToken;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1184);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    }
  };

  const handleSignupComplete = async () => {
    if (!nickname) {
      setHelperText('닉네임을 입력해주세요.');
      return;
    }

    if (!token || !refreshToken) {
      alert('인증 토큰이 없습니다. 다시 로그인해주세요.');
      return;
    }

    const signupRequestDto = {
      nickname,
      email: email.trim() === '' ? null : email,
    };

    const formData = new FormData();
    formData.append('signupRequestDto', new Blob([JSON.stringify(signupRequestDto)], { type: 'application/json' }));

    if (selectedFile) {
      formData.append('imagefile', selectedFile);
    }

    try {
      const response = await axios.post(endpoints.user, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error during sign-up:', error.response?.data || error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else if (error instanceof Error) {
        console.error('Error during sign-up:', error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        console.error('Unknown error during sign-up:', error);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Column>
        <Row align='left'><div className={styles.title}>프로필 설정</div></Row>
        <div className={styles.divider} />
        <Space height='24px'/>
        <Row align='left'>
          <label htmlFor="fileInput" className={styles.label}>프로필 사진<span className={styles.requiredMark}>*</span></label>
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
          <label className={styles.label}>이메일<span className={styles.requiredMark}>*</span></label>
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
          text="회원가입 완료" 
          onClick={handleSignupComplete}
        />
      </Column>
    </div>
  );
};

export default SignInfo;