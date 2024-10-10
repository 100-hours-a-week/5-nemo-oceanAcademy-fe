import React, { useState, useEffect } from 'react';
import styles from './FileUpload.module.css';

interface FileUploadProps {
    onFileSelect: (file: File | null) => void;
    initialPreview?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, initialPreview }) => {
    const [preview, setPreview] = useState<string | null>(null);

    // useEffect를 사용하여 initialPreview가 있을 경우 미리보기에 설정
    useEffect(() => {
        if (initialPreview) {
            setPreview(initialPreview);  // 초기 이미지를 미리보기에 설정
        }
    }, [initialPreview]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string); // 파일 선택 시 미리보기를 업데이트
            reader.readAsDataURL(file);
            onFileSelect(file);
        } else {
            alert('파일 확장자는 .jpg .png만 가능합니다. 5MB 이하의 파일만 업로드할 수 있습니다.');
            onFileSelect(null);
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
                        <div className={styles.placeholder}>사진을 등록해주세요</div>
                    )}
                </div>
                <button className={styles.uploadButton} onClick={() => document.getElementById('fileInput')?.click()}>
                    {preview ? "사진 변경하기" : "사진 등록하기"}
                </button>
                <input type="file" id="fileInput" className={styles.fileInput} onChange={handleFileChange} />
            </div>
            <p className={styles.instructions}>
                사진은 1개만 업로드할 수 있습니다.<br />
                파일 확장자는 .jpg, .png만 가능합니다.<br />
                5MB 이하의 파일만 업로드할 수 있습니다.
            </p>
        </div>
    );
};

export default FileUpload;
