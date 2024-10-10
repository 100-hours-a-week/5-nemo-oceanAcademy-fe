import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container, Row, Column, Space } from '../../../styles/GlobalStyles';
import Button from '../../../components/button/Button';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import DefaultInstructorImage from './InstructorImage.png';
import DefaultLecturebannerImage from './LecturebannerImage.png';

// import image
import profileDefault1 from '../../../assets/images/profile/jellyfish.png';
import profileDefault2 from '../../../assets/images/profile/whale.png';
import profileDefault3 from '../../../assets/images/profile/crab.png';
const profileImages = [profileDefault1, profileDefault2, profileDefault3];

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
    student_count: number;
    banner_image_path: string | null;
    is_active: boolean;
}

const LectureInfo: React.FC = () => {
    const navigate = useNavigate();
    const { classId } = useParams<{ classId: string }>();
    const [lecture, setLecture] = useState<Lecture | null>(null);
    const [isEnrolled, setIsEnrolled] = useState<boolean | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1184);
    const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
    const [userRole, setUserRole] = useState<string | null>(null);
    const token = localStorage.getItem('accessToken');

    const getProfileImage = (nickname: string): string => {
        let hash = 0;
        for (let i = 0; i < nickname.length; i++) {
            hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash % profileImages.length);
        return profileImages[index];
    };

    useEffect(() => {
        const fetchLectureInfo = async () => {
            try {
                const response = await axios.get(`${endpoints.classes}/${classId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLecture(response.data.data);
                setProfileImage(getProfileImage(response.data.data.instructor));
            } catch (error) {
                console.error('Failed to fetch lecture data:', error);
                alert('강의 정보를 불러오는 데 실패했습니다.');
            }
        };

        const fetchUserRole = async () => {
            try {
                const response = await axios.get(endpoints.getRole.replace('{classId}', classId || ''), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserRole(response.data.data);
            } catch (error) {
                console.error('Failed to fetch user role:', error);
                setUserRole(null); 
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
        if (userRole === '강사') {
            navigate(`/dashboard/teacher/${classId}`);
        } else if (userRole === '수강생') {
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
        return <Container>Loading...</Container>;
    }

    const breadcrumbItems = [
        { label: '홈', link: '/' },
        { label: '내 강의실', link: '/mypage' },
        { label: '강의 소개', link: '/lecture/info' }
    ];

    return (
        <div>
            {isMobile ? (
                // 모바일 UI
                <div className={styles.mobileContainer}>
                    <h1 className={styles.title}>{lecture.name}</h1>
                    <div className={styles.banner} style={{ backgroundImage: `url(${lecture.banner_image_path || DefaultLecturebannerImage})` }}></div>
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
            ) : (
                // 데스크탑 UI
                <Column align={"all"}>
                {/*
                <Row align={"left"}>
                    <div className={styles.desktopNavigator}>
                        <a href="/">홈</a> &gt;
                        <a href="/mypage"> 내 강의실</a> &gt;
                        <span> 강의소개</span>
                    </div>
                </Row>
                <hr className={styles.stylehr}/>
                */}

                <div className={styles.desktopContainer}>
                    <Breadcrumb items={breadcrumbItems} />
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
                            <hr className={styles.stylehr}/>
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
                </div>
                </Column>
            )}
        </div>
    );
};

export default LectureInfo;
