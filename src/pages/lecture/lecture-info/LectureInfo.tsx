import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/button/Button';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container } from '../../../styles/GlobalStyles';
import Row from '../../../components/Row';
import Column from '../../../components/Column';
import Space from '../../../components/Space';

interface Lecture {
    id: number;
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
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 600);
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
                setIsEnrolled(false);
            }
        };

        if (classId) {
            fetchLectureInfo();
            fetchUserRole();
        }

        // 윈도우 크기 변화 감지
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [classId, token]);

    const handleButtonClick = async () => {
        if (isEnrolled) {
            navigate(`/dashboard/student/${classId}`);
        } else {
            try {
                const response = await axios.post(endpoints.enrollment.replace('{classId}', classId || ''), {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    navigate(`/enrollment/${classId}`);
                }
            } catch (error) {
                console.error('Enrollment request failed:', error);
                alert('수강신청을 실패했습니다.');
            }
        }
    };

    if (!lecture) {
        return <Container>Loading...</Container>;
    }

    return (
        <div>
            {isMobile ? (
                // Mobile HTML
                <div className={styles.mobileContainer}>
                    <h1 className={styles.title}>{lecture.name}</h1>
                    <div className={styles.banner} style={{ backgroundImage: `url(${lecture.banner_image_path || '/default-image.png'})` }}></div>
                    <div className={styles.category}>{lecture.category}</div>

                    <div className={styles.infoSection}>
                        <p className={styles.infoContent}>{lecture.description || '강의 소개 정보 없음'}</p>
                    </div>

                    <div className={styles.buttonContainer}>
                        <Button text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleButtonClick} />
                    </div>

                    <Navigation />
                </div>
            ) : (
                // Desktop HTML
                <div className={styles.desktopContainer}>

                    <Row align={"fill"}>
                        <div className={styles.desktopBanner} style={{ backgroundImage: `url(${lecture.banner_image_path || '/default-image.png'})` }}></div>
                    </Row>
                    <Space height={"80px"}/>
                    <Row align={"fill"}>
                        <Column align={"center"}>
                            <div className={styles.desktopCategory}>{lecture.category}</div>
                            <h1 className={styles.title}>{lecture.name}</h1>
                            <div>리뷰 4.8 (12)</div>

                        </Column>
                        <Column align={"center"}>
                            <Button text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleButtonClick} />
                        </Column>
                    </Row>

                    <Row align="left">
                        <p className={styles.instructor}>{lecture.instructor}</p>
                    </Row>




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



                    <Navigation />
                </div>
            )}
        </div>
    );
};

export default LectureInfo;
