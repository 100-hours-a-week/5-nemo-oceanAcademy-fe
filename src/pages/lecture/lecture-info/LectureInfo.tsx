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
import DefaultInstructorImage from './InstructorImage.png';
import DefaultLecturebannerImage from './LecturebannerImage.png';

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
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184);
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
            setIsMobile(window.innerWidth <= 1184);
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
                    // alert(response.data.message);
                    console.log(response.data.message_kor);
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
            <div className={styles.desktopNavigator}>
                <a href="/">홈</a> &gt;
                <a href="/mypage"> 내 강의실</a> &gt;
                <span> 강의소개</span>
            </div>
            <hr />

            {isMobile ? (
                // 모바일 UI
                <div className={styles.mobileContainer}>
                    <h1 className={styles.title}>{lecture.name}</h1>
                    <div className={styles.banner} style={{ backgroundImage: `url(${lecture.banner_image_path || DefaultLecturebannerImage})` }}></div>
                    <div className={styles.category}>{lecture.category}</div>

                    <div className={styles.infoSection}>
                        <p className={styles.infoContent}>{lecture.description || '등록된 강의 소개가 없습니다.'}</p>
                    </div>

                    <div className={styles.buttonContainer}>
                        <Button text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleButtonClick} />
                    </div>

                    <Navigation />
                </div>
            ) : (
                // 데스크탑 UI
                <Column align={"all"}>
                <div className={styles.desktopContainer}>



                    <Space height={"40px"}/>

                    {/* 강의 배너이미지 */}
                    <Row align={"fill"}>
                        <div className={styles.desktopBanner} style={{ backgroundImage: `url(${lecture.banner_image_path || DefaultLecturebannerImage})` }}></div>
                    </Row>
                    <Space height={"40px"}/>

                    {/* 강의 제목 */}
                    <Row align={"fill"}>
                        <Column align={"fill"} gap={"18px"}>
                            <div className={styles.desktopCategory}>{lecture.category}</div>
                            <div className={styles.desktopTitle}>{lecture.name}</div>
                            <div className={styles.desktopReview}>리뷰 4.8 (12)</div>
                        </Column>
                        <Row align={"right"}>
                            {/* 수강신청 버튼 */}
                            <Button backgroundColor={"#2A62F2"} text={isEnrolled ? "대시보드 가기" : "수강신청"} onClick={handleButtonClick} />
                        </Row>
                    </Row>
                    <Space height={"30px"}/>


                    {/* 강사 소개 */}

                    <div className={styles.desktopBox}>
                        <div>
                            <div className={styles.desktopInstructorImage} style={{ backgroundImage: `url(${lecture.banner_image_path || DefaultInstructorImage})` }}></div>
                        </div>
                        <Column align={"top"} gap={"10px"}>
                            <Space height={"10px"}/>
                            <div className={styles.desktopSubTitle}>{lecture.instructor}</div>
                            <hr />
                            <div className={styles.desktopBoxTitle}>강사 소개</div>
                            <div className={styles.desktopBoxContent}>
                                {lecture.instructor_info || '등록된 강사 소개가 없습니다.'}
                            </div>
                        </Column>
                    </div>

                    <Space height={"30px"}/>


                    {/* 강의 소개 */}
                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의 소개</div>
                            <div className={styles.desktopBoxContent}>
                                {lecture.description || '등록된 강의 소개가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"30px"}/>


                    {/* 강의 목표 */}
                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의 목표</div>
                            <div className={styles.desktopBoxContent}>
                                {lecture.object || '등록된 강의 목표가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"30px"}/>

                    {/* 강의 사전 준비 사항 */}
                    <div className={styles.desktopBox}>
                        <Column align={"fill"} gap={"10px"}>
                            <div className={styles.desktopBoxTitle}>강의에 필요한 사전 지식 및 준비 안내</div>
                            <div className={styles.desktopBoxContent}>
                                {lecture.prerequisite || '등록된 사전 지식 및 준비 안내 정보가 없습니다.'}
                            </div>
                        </Column>
                    </div>
                    <Space height={"200px"}/>

                    {/* 네비게이션 */}
                    <Navigation />
                </div>
                </Column>
            )}
        </div>
    );
};

export default LectureInfo;
