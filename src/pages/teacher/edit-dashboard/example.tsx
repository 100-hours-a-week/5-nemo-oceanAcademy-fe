import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import InfoSection from '../../../components/dashboard/InfoSection';
import styles from './EditDashboard.module.css';
import {Column, Container, Row, Space} from '../../../styles/GlobalStyles';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import InputField from "../../../components/input-field/InputField";
import {Button} from "@mui/material";
import FileUpload from "../../../components/file-upload/FileUpload";
import CategorySelect from "../../../components/category-select/CategorySelect";

interface Category {
    id: number;
    name: string;
}
const EditDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { classId } = useParams<{ classId: string }>();
    const [selectedFile, setSelectedFile] = useState<File | null | undefined>(null);
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184); // 모바일 상태 추가
    const [categoryHelperText, setCategoryHelperText] = useState<string>('카테고리는 필수 항목입니다.');
    const [titleHelperText, setTitleHelperText] = useState<string>('강의 제목은 필수 항목입니다.');
    const [objectiveHelperText, setObjectiveHelperText] = useState<string>('강의 목표는 필수 항목입니다.');
    const [descriptionHelperText, setDescriptionHelperText] = useState<string>('강의 소개는 필수 항목입니다.');
    const [title, setTitle] = useState<string>('');

    const [dashboard, setDashboard] = useState({
        instructor: '',
        category_id: 0,
        category: '',
        name: '',
        object: '',
        description: '',
        instructor_info: '',
        prerequisite: '',
        announcement: '',
        banner_image_path: '',
        is_active: false,
    });
    const token = localStorage.getItem('accessToken');
    const fileInputRef = useRef<HTMLInputElement>(null); // 파일 입력 필드 참조

    // 기존 강의 정보 불러오기
    useEffect(() => {
        const fetchLectureData = async () => {
            try {
                const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId || ''), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const lecture = response.data.data;
                setDashboard({
                    instructor: lecture.instructor,
                    category_id: lecture.category_id,
                    category: lecture.category,
                    name: lecture.name,
                    object: lecture.object,
                    description: lecture.description,
                    instructor_info: lecture.instructor_info,
                    prerequisite: lecture.prerequisite,
                    announcement: lecture.announcement,
                    banner_image_path: lecture.banner_image_path,
                    is_active: lecture.is_active,
                });
            } catch (error) {
                console.error('Failed to fetch lecture data:', error);
                alert('강의 정보를 불러오는 데 실패했습니다.');
            }
        };

        const fetchCategories = async () => {
            try {
                const categoryResponse = await axios.get(endpoints.getCategories, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(categoryResponse.data || []);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setCategories([]);
                alert('카테고리 정보를 가져오는 데 실패했습니다.');
            }
        };

        fetchCategories();

        if (classId) {
            fetchLectureData();
        }
    }, [classId, token]);

    // 입력값 변경 핸들러
    const handleInputChange = (field: string, value: string | boolean) => {
        setDashboard(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    // 파일 변경 핸들러 (이미지)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file);
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 5 * 1024 * 1024) {
            const reader = new FileReader();
            reader.onloadend = () => handleInputChange('banner_image_path', reader.result as string);
            reader.readAsDataURL(file);
        } else {
            alert('Invalid file. Please select a .jpg or .png file under 5MB.');
        }
    };

    const handleBannerImageUpload = (file: File | null) => {
        if (file) {
            setBannerImage(file); // 파일이 있을 때만 처리
        } else {
            setBannerImage(null); // 파일이 없거나 잘못된 파일일 때 처리
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            console.log('fileInputRef exists');  // 참조 확인
            fileInputRef.current.click();
        }
    };

    // 윈도우 크기 감지
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 1184); // 1184px 이하일 경우 모바일 상태로 간주
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    // 저장 핸들러 (API 요청)
    const handleSave = async () => {
        const formData = new FormData();
        // 카테고리는 수정 x
        const classroomUpdateDto = {
            name: dashboard.name,
            categoryId: dashboard.category_id,
            category: dashboard.category,
            object: dashboard.object,
            description: dashboard.description,
            instructorInfo: dashboard.instructor_info,
            prerequisite: dashboard.prerequisite || null,
            announcement: dashboard.announcement || null,
        };

        formData.append('classroomUpdateDto', new Blob([JSON.stringify(classroomUpdateDto)], { type: 'application/json' }));

        // 이미지 파일 추가
        if (selectedFile) {
            formData.append('imagefile', selectedFile || null); // key를 'imagefile'로 설정
        }


        try {
            const response = await axios.patch(endpoints.getLectureInfo.replace('{classId}', classId || ''), formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert('수정이 완료되었습니다.');
                navigate(`/dashboard/teacher/${classId}`);
            } else {
                alert('수정에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('Error updating lecture:', error);
            alert('수정 중 오류가 발생했습니다.');
        }
    };

    const handleCancel = () => {
        navigate(`/dashboard/teacher/${classId}`);
    };

    return (
        <div>
            {isMobile ? (
                // 모바일 UI
                <Container>
                    <LectureMeta className="editSection" instructor={dashboard.instructor} category={dashboard.category}/>
                    <div style={{"width" : "100%", "height" : "10px"}}/>

                    <InfoSection
                        className="editSection"
                        title="강의 제목"
                        helpertext="* helpertext"
                        essential="*"
                        content={ <input style={{ "border": "none", "width": "100%", "height": "10px", "padding": "0", "margin": "0", "outline": "none", "fontSize":"14px" }} className={styles.input} value={dashboard.name} onChange={(e) => handleInputChange('name', e.target.value)} /> }
                    />

                    <Announcement className="editSection" content={ <textarea className={styles.textarea} value={dashboard.announcement} onChange={(e) => handleInputChange('announcement', e.target.value)}/> }/>

                    <InfoSection
                        className="editSection"
                        title="강의 목표"
                        helpertext="* helpertext"
                        essential="*"
                        content={ <textarea className={styles.textarea} value={dashboard.object} onChange={(e) => handleInputChange('object', e.target.value)}/> }
                    />

                    <InfoSection
                        className="editSection"
                        title="강의 소개"
                        helpertext="* helpertext"
                        essential="*"
                        content={ <textarea className={styles.textarea} value={dashboard.description} onChange={(e) => handleInputChange('description', e.target.value)}/> }
                    />

                    <InfoSection
                        className="editSection"
                        title="강사 소개 (선택)"
                        helpertext="* helpertext"
                        essential=""
                        content={ <textarea className={styles.textarea} value={dashboard.instructor_info} onChange={(e) => handleInputChange('instructor_info', e.target.value)}/> }
                    />

                    <InfoSection
                        className="editSection"
                        title="강의에 필요한 사전 지식 및 준비 안내 (선택)"
                        helpertext="* helpertext"
                        essential=""
                        content={ <textarea className={styles.textarea} value={dashboard.prerequisite} onChange={(e) => handleInputChange('precourse', e.target.value)}/> }
                    />

                    <div className={styles.imagetitle}><h4>강의 배너 사진 업로드</h4></div>
                    <Banner image={dashboard.banner_image_path}></Banner>
                    <div>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ visibility: 'hidden', position: 'absolute' }}/>
                        <div className={styles.warningtext}>
                            <li>사진은 1개만 업로드할 수 있습니다.</li>
                            <li>파일 사이즈는 350*100을 권장합니다.</li>
                            <li>파일 확장자는 .jpg, .png만 가능합니다</li>
                            <li>5MB이하의 파일만 업로드할 수 있습니다.</li>
                        </div>
                        <button className={styles.uploadButton} onClick={handleImageClick}>{dashboard.banner_image_path ? '이미지 변경' : '이미지 등록'}</button>
                    </div>

                    <div className={styles.buttonContainer}>
                        <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
                        <button className={styles.saveButton} onClick={handleSave}>수정 완료</button>
                    </div>
                </Container>
            ) : (
                // 데스크탑 UI
                <Column align={"all"}>
                    <div className={styles.desktopContainer}>
                        <Space height={"30px"} />

                        {/* 강의 배너 이미지 */}
                        <FileUpload onFileSelect={handleBannerImageUpload} />
                        <Space height={"20px"} />

                        <div className={styles.desktopBox}>
                            <Column>
                                <Row gap={"20px"}>

                                    {/* 강의 제목 */}
                                    <InputField
                                        label="강의 제목"
                                        placeholder="강의 제목을 작성해주세요"
                                        isRequired
                                        value={dashboard.name}
                                        onChange={(e) => setDashboard((prevState) => ({...prevState, name: e.target.value,}))}
                                        helperText={titleHelperText}
                                    />

                                    {/* 카테고리 선택 */}
                                    <div className={styles.inputField}>
                                        <label className={styles.label}>
                                            카테고리 <span className={styles.required}>*</span>
                                        </label>
                                        <Row align={"left"}>
                                            <CategorySelect
                                                categories={categories}
                                                selected={selectedCategory}
                                                onSelectCategory={handleCategoryChange}
                                                defaultVal=''
                                                defaultName={dashboard.category}
                                            />
                                        </Row>
                                        {categoryHelperText && <p className={styles.helperText}>{categoryHelperText}</p>}
                                    </div>
                                </Row>

                                {/* 강의 목표 */}
                                <InputField
                                    label="강의 목표"
                                    placeholder="강의 목표를 작성해주세요"
                                    isRequired
                                    value={dashboard.object}
                                    onChange={(e) => setDashboard((prevState) => ({...prevState, object: e.target.value,}))}
                                    helperText={titleHelperText}
                                />

                                {/* 강의 소개 */}
                                <InputField
                                    label="강의 소개"
                                    placeholder="강의 소개를 작성해주세요"
                                    isRequired
                                    value={dashboard.description}
                                    onChange={(e) => setDashboard((prevState) => ({...prevState, description: e.target.value,}))}
                                    helperText={titleHelperText}
                                />

                                {/* 강의 공지, API 수정 필요 */}
                                <Announcement className="editSection" content={ <textarea className={styles.textarea} value={dashboard.announcement} onChange={(e) => handleInputChange('announcement', e.target.value)}/> }/>

                                {/* 강사 소개 */}
                                <InputField
                                    label="강사 소개"
                                    placeholder="강의 소개를 작성해주세요"
                                    isRequired
                                    value={dashboard.instructor_info}
                                    onChange={(e) => setDashboard((prevState) => ({...prevState, instructor_info: e.target.value,}))}
                                    helperText={titleHelperText}
                                />

                                {/* 사전 지식 준비 */}
                                <InputField
                                    label="강사 소개"
                                    placeholder="강의 소개를 작성해주세요"
                                    isRequired
                                    value={dashboard.prerequisite}
                                    onChange={(e) => setDashboard((prevState) => ({...prevState, prerequisite: e.target.value,}))}
                                    helperText={titleHelperText}
                                />

                            </Column>
                        </div>
                        <Space height={"20px"} />

                        <Row align={"center"}>
                            <div className={styles.buttonContainer}>
                                <button className={styles.cancelButton} onClick={handleCancel}>취소</button>
                                <button className={styles.saveButton} onClick={handleSave}>수정 완료</button>
                            </div>
                        </Row>
                        <Space height={"100px"} />

                    </div>
                </Column>
            )}
        </div>
    );
};


export default EditDashboard;