import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './SignInfo.module.css';
import { Container, Empty } from '../../../styles/GlobalStyles';
import profImage1 from '../../../assets/images/profile_default.png';
import profImage2 from '../../../assets/images/profile_default1.png';
import profImage3 from '../../../assets/images/profile_default2.png';
import profImage4 from '../../../assets/images/profile_default3.png';
import WideButton from '../../../components/wide-button/WideButton';

interface LocationState {
  token: string;
  refreshToken: string;
}

const SignInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 파일 객체 저장
  const [email, setEmail] = useState<string>('');
  const [nickname, setNickname] = useState<string>('');
  const [helperText, setHelperText] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { token, refreshToken } = location.state as LocationState; // KakaoCallback에서 전달된 토큰

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file); // 파일 객체 저장
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string); // 미리보기
      reader.readAsDataURL(file);
    } else {
      alert('유효하지 않은 파일입니다. 5MB 이하의 .jpg/jpeg 또는 .png 파일만 가능합니다.');
    }
  };

  // 회원가입 완료 처리
  const handleSignupComplete = async () => {
    if (!nickname) {
      setHelperText('닉네임을 입력해주세요.');
      return;
    }

    const signupRequestDto = {
      nickname,
      email,
    };

    const formData = new FormData();
    formData.append('signupRequestDto', new Blob([JSON.stringify(signupRequestDto)], { type: 'application/json' }));

    if (selectedFile) {
      formData.append('imagefile', selectedFile); // 이미지 파일이 있을 경우 추가
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
        // AxiosError인 경우
        console.error('Error during sign-up:', error.response?.data || error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else if (error instanceof Error) {
        // 일반 Error 객체인 경우
        console.error('Error during sign-up:', error.message);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      } else {
        // 알 수 없는 에러인 경우
        console.error('Unknown error during sign-up:', error);
        alert('알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
      <div className={styles.container}>
        <h2 className={styles.title}>추가 정보 입력</h2>

        <div className={styles.imageContainer}>
          <label className={styles.label}>프로필 사진(선택)</label>
          <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
          />
          <button
              className={styles.uploadButton}
              onClick={() => document.getElementById('fileInput')?.click()}
          >
            {preview ? (
                <img src={preview} alt="Preview" className={styles.previewImage} />
            ) : (
                '+'
            )}
          </button>
          <div className={styles.bulletList}>
            <p>
              - 사진은 1개만 업로드할 수 있습니다. <br />
              - 파일 사이즈는 100*100을 권장합니다. <br />
              - 파일 크기는 5MB 이하만 가능합니다. <br />
              - 파일은 .jpg, .jpeg, .png만 업로드할 수 있습니다. <br />
              - 사진을 업로드하지 않을 경우 기본 프로필로 설정됩니다.
            </p>
          </div>
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label}>
            닉네임<span className={styles.requiredMark}>*</span>
          </label>
          {helperText && <p className={styles.helperText}>{helperText}</p>}
          <input
              type="text"
              className={styles.inputField}
              placeholder="닉네임을 설정해주세요."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label className={styles.label}>이메일 (선택)</label>
          <input
            type="email"
            className={styles.inputField}
            placeholder="이메일을 입력해주세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <WideButton 
          text="회원 가입 완료" 
          onClick={handleSignupComplete}
          fixed
        />
      </div>
  );
};

export default SignInfo;
