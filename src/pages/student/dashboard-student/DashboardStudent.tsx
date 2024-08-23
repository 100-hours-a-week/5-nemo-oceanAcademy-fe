import React from 'react';
import { useNavigate } from 'react-router-dom';
import LectureMeta from '../../../components/dashboard/LectureMeta';
import Banner from '../../../components/dashboard/Banner';
import Announcement from '../../../components/dashboard/Announcement';
import ScheduleList from '../../../components/dashboard/ScheduleList';
import InfoSection from '../../../components/dashboard/InfoSection';
import styles from './DashboardStudent.module.css';
import { Container } from '../../../styles/GlobalStyles'
import bn from '../../../assets/images/ad_big0.png';

// [ ] 헤더 밑에 마진 or 패딩? 아무튼 빈 공간이 화면 사이즈에 따라서 바껴요
// NOTE 확인해보니 dashboard/teacher 페이지는 안 그래서, 제가 뭘 잘못 만졌나봅니다... 시간 나실 때 도움주세요 ㅠㅠ

const DashboardStudent: React.FC = () => {
    const navigate = useNavigate();

    // 더미 데이터
    const lectureData = {
        instructor: '헤이즐리',
        title: '즐리가 만든 소금빵이 제일 맛있어',
        category: '쿠킹',
        bannerImage: bn, // 배너 이미지 URL
        announcement: '8/2 수업 오후 10시 시작\n준비물 : 밀가루, 물, 치킨, 초콜릿, 감자, 해파리, 말미잘, 지렁이, 말미잘, 지렁이, 지렁이\n상담 가능 시간 : 8/1 오후 7시~',
        schedules: [
            { content: '헤이즐리의 말랑말랑 반죽 만들기', start_time: '13:00', end_time: '15:00' },
            { content: '헤이즐리의 끄아아아앙아아앙아아아악 고라니 만들기', start_time: '13:00', end_time: '15:00' },
        ],
        studentCount: 20,
        objective: '이 강의는 소금빵을 만드는 방법을 배우는 것을 목표로 합니다.',
        description: '소금빵의 다양한 레시피와 실습을 통해 최고의 소금빵을 만들 수 있습니다.',
        instructorInfo: '헤이즐리 강사는 쿠킹 전문가로 다년간의 경험을 보유하고 있습니다.',
        precourse: '밀가루와 물을 사전에 준비해 주세요.',
    };

    return (
        <Container>
            <LectureMeta
                instructor={lectureData.instructor}
                title={lectureData.title}
                category={lectureData.category}
            />
            <div className={styles.buttonContainer}>
                <button className={styles.primaryButton}>강의 소개 보러가기</button>
            </div>
            <Banner image={lectureData.bannerImage} />
            <Announcement content={lectureData.announcement} />
            <ScheduleList schedules={lectureData.schedules} />
            <InfoSection title="강의 목표" content={lectureData.objective} />
            <InfoSection title="강의 소개" content={lectureData.description} />
            <InfoSection title="강사 소개" content={lectureData.instructorInfo} />
            <InfoSection title="사전 준비 사항" content={lectureData.precourse} />
            <button className={styles.wideButton} onClick={() => navigate('/live/student')}>라이브 강의 입장</button>
        </Container>
    );
};

export default DashboardStudent;
