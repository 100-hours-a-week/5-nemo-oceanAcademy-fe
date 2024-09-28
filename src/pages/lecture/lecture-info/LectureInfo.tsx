// #H-1: LectureInfo (/lecture/info) - 강의 소개 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Navigation from '../../../components/navigation/Navigation';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LectureInfo.module.css';
import { Container } from '../../../styles/GlobalStyles';

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
        return <Container>Loading...</Container>; // 데이터를 불러오기 전 로딩 표시
    }

    return (
        <div className={styles.container}>
            {lecture.banner_image_path && (
              <div
                className={styles.banner}
                style={{ backgroundImage: `url(${lecture.banner_image_path})` }}
              />)
            }
            <section className={styles.basicInfo}>
              <p className={styles.category}>
                {lecture.category}
              </p>
              <div className={styles.row}>
                <div className={styles.title}>
                  {lecture.name}
                </div>
                <button 
                    className={styles.button}
                    onClick={handleButtonClick}
                    >
                    {userRole === '강사' ? "대시보드 가기" : userRole === '수강생' ? "대시보드 가기" : "수강신청"}
                </button>
              </div>
            </section>

            <section className={styles.instructorSection}>
              <img src={profileImage} alt="instructor profile image" />
              <div className={styles.column}>
                <h5>{lecture.instructor}</h5>
                <p>{lecture.instructor_info}</p>
              </div>
            </section>

            <section className={styles.info}>
              <h5>강의 소개</h5>
              <p>{lecture.description ? lecture.description : '강의 소개가 없습니다.'}</p>
            </section>

            <section className={styles.info}>
              <h5>강의 목표</h5>
              <p>{lecture.object ? lecture.object : '강의 목표가 없습니다.'}</p>  
            </section>

            <div className={styles.divider} />

            {lecture.prerequisite && (
              <section className={styles.info}>
                <h5>강의에 필요한 사전 지식 및 준비 안내</h5>
                <p>{lecture.prerequisite}</p>
              </section>
            )}

            <Navigation />
        </div>
    );
};

export default LectureInfo;
