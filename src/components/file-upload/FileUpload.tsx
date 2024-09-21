import React, { useState } from 'react';
import styles from './FileUpload.module.css';

const FileUpload: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);

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
    <div className={styles.fileUpload}>
      <label className={styles.uploadLabel}>강의 배너 사진 업로드 (선택)</label>
      <div className={styles.imageContainer}>
          <div className={styles.previewContainer}>
              {preview ? (
                  <img src={preview} alt="Preview" className={styles.previewImage} />
              ) : (
                  <div className={styles.placeholder}>사진을 등록하세요</div>
              )}
          </div>
        <button className={styles.uploadButton} onClick={() => document.getElementById('fileInput')?.click()}>
            {preview ? (
                "사진 변경하기"
            ) : (
                "사진 등록하기"
            )}
        </button>
        <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
      </div>
      <p className={styles.instructions}>
        사진은 1개만 업로드할 수 있습니다.<br />
        파일 사이즈는 350*100을 권장합니다.<br />
        파일 확장자는 .jpg, .png만 가능합니다.<br />
        5MB 이하의 파일만 업로드할 수 있습니다.
      </p>
    </div>
  );
};

export default FileUpload;