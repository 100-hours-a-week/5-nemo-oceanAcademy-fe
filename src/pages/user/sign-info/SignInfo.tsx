// SignInfo Page - 회원가입 중 프로필 사진 및 닉네임 등 추가 정보 입력

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SignInfo.module.css';
import WideButton from '../../../components/wide-button/WideButton';

const SignInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');
  const [helperText, setHelperText] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      alert('Invalid file. Please select a .jpg or .png file under 5MB.');
    }
  };

  const handleSignupComplete = () => {
    // 회원 정보 전송하는 API 요청
    // 예시: api.sendUserData({ nickname, preview }).then(response => {...});

    if (!nickname) {
      setHelperText('닉네임을 입력해주세요.');
      return;
    }

    // API 요청 작성할 것. 
    fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
    })
    .then(response => {
      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        alert('회원가입에 실패하였습니다. 다시 시도해주세요.');
      }
    })
  }

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
        <ul className={styles.bulletList}>
          <li className={styles.listItem}>사진은 1개만 업로드할 수 있습니다.</li>
          <li className={styles.listItem}>파일 사이즈는 100*100을 권장합니다.</li>
          <li className={styles.listItem}>파일 크기는 5MB 이하만 가능합니다.</li>
          <li className={styles.listItem}>파일은 .jpg, .png만 업로드할 수 있습니다.</li>
          <li className={styles.listItem}>사진을 업로드하지 않을 경우 기본 프로필로 설정됩니다.</li>
        </ul>
      </div>

      <div className={styles.nicknameContainer}>
        <label className={styles.label}>
            닉네임<span className={styles.requiredMark}>*</span>
          </label>
          <p className={styles.helperText}>필수 입력 사항입니다.</p>
          <input
            type="text"
            className={styles.inputField}
            placeholder="닉네임을 설정해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
      </div>
      <WideButton text="회원 가입 완료" onClick={handleSignupComplete} />
    </div>
  );
};

export default SignInfo;
