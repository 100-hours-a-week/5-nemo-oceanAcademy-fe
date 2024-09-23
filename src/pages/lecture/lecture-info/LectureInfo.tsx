// #H-1: LectureInfo (/lecture/info) - 강의 소개 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container } from '../../../styles/GlobalStyles';

interface Lecture {
    id: number; // class ID
    user_id: number;
    category_id: number;
    instructor: string;
    category: string;
    name: string;
    object: string;
    description: string;
    instructor_info: string;
    prerequisite: string;
    announcement: string;
    banner_image_path: string | null;
    is_active: boolean;
}

const LectureInfo: React.FC = () => {
    const navigate = useNavigate();
    const { classId } = useParams<{ classId: string }>();
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchLectureInfo = async () => {
            try {
                const response = await axios.get(`${endpoints.classes}/${classId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLecture(response.data.data);
            } catch (error) {
                console.error('Failed to fetch lecture data:', error);
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await axios.get(endpoints.getRole.replace('{classId}', classId || ''), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.data === '강사' || response.data.data === '수강생') {
                    setIsEnrolled(true);
                } else {
                    setIsEnrolled(false);
                }
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                setIsEnrolled(false); // 오류 시 수강 신청 버튼을 표시
            }
        };

        if (classId) {
            fetchLectureInfo();
            fetchUserRole();
        }
    }, [classId, token]);

    const handleButtonClick = async () => {
        if (isEnrolled) {
            console.log('수강신청 되어 있나요?: ', isEnrolled);
            navigate(`/dashboard/student/${classId}`);
        } else {
            try {
                console.log('수강신청 요청 드갑니다');
                const response = await axios.post(endpoints.enrollment.replace('{classId}', classId || ''), {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    // alert(response.data.message);
                    console.log(response.data.message_kor);
                    navigate(`/enrollment/${classId}`);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
                    } else if (error.response?.status === 400) {
                        alert(error.response.data.message || '수강신청을 실패했습니다.');
                    } else {
                        alert('알 수 없는 오류가 발생했습니다.');
                    }
                } else {
                    console.error('Enrollment request failed:', error);
                    alert('수강신청을 실패했습니다.');
                }
            }
        }
    };

    if (!lecture) {
        return <Container>Loading...</Container>; // 데이터를 불러오기 전 로딩 표시
    }

    return (
        <div className={styles.container}>
            <p className={styles.instructor}>{lecture.instructor}</p>
            <h1 className={styles.title}>{lecture.name}</h1>
            <div className={styles.banner} style={{ backgroundImage: `url(${lecture.banner_image_path || '/default-image.png'})` }}></div>
            <div className={styles.category}>{lecture.category}</div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강의 목표</h3>
                <p className={styles.infoContent}>{lecture.object || '강의 목표 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강의 소개</h3>
                <p className={styles.infoContent}>{lecture.description || '강의 소개 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>강사 소개</h3>
                <p className={styles.infoContent}>{lecture.instructor_info || '강사 소개 정보 없음'}</p>
            </div>

            <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>사전 준비 사항</h3>
                <p className={styles.infoContent}>{lecture.prerequisite || '사전 준비 사항 정보 없음'}</p>
            </div>

            <div className={styles.buttonContainer}>
                <Button text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleButtonClick} />
            </div>

            <Navigation />
        </div>
    );
};

export default LectureInfo;
