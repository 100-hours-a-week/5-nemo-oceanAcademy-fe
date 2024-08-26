import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './SignInfo.module.css';
import WideButton from '../../../components/wide-button/WideButton';

const SignInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 파일 객체 저장
  const [nickname, setNickname] = useState<string>('');
  const [helperText, setHelperText] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = (location.state as { token: string })?.token; // KakaoCallback에서 전달된 토큰

  // 파일 선택 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file); // 파일 객체 저장
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string); // 미리보기
      reader.readAsDataURL(file);
    } else {
      alert('Invalid file. Please select a .jpg or .png file under 5MB.');
    }
  };

  // 회원가입 완료 처리
  const handleSignupComplete = () => {
    if (!nickname) {
      setHelperText('닉네임을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    if (selectedFile) {
      formData.append('profileImage', selectedFile); // 파일 객체를 FormData에 추가
    }

    fetch('https://www.nemooceanacademy.com:5000/api/auth/signup', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // KakaoCallback에서 받은 토큰
      },
      body: formData,
    })
        .then(response => {
          if (response.ok) {
            alert('회원가입이 완료되었습니다.');
            navigate('/'); // 회원가입 후 메인 페이지로 리다이렉트
          } else {
            alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
          }
        })
        .catch(error => {
          console.error('Error during sign-up:', error);
          alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        });
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
        </div>

        <div className={styles.nicknameContainer}>
          <label className={styles.label}>
            닉네임<span className={styles.requiredMark}>*</span>
          </label>
          <input
              type="text"
              className={styles.inputField}
              placeholder="닉네임을 설정해주세요."
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
          />
          {helperText && <p className={styles.helperText}>{helperText}</p>}
        </div>

        <WideButton text="회원 가입 완료" onClick={handleSignupComplete} />
      </div>
  );
};

export default SignInfo;
