import React, { useState } from 'react';
import styles from './SignInfo.module.css';

const SignInfo: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string>('');

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
    </div>
  );
};

export default SignInfo;