import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
import * as Sentry from '@sentry/react';
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/header/Header';
import Main from './pages/main/Main';
import Enrollment from './pages/lecture/enrollment/Enrollment';
import LectureInfo from './pages/lecture/lecture-info/LectureInfo';
import LectureList from './pages/lecture/lecturelist/LectureList';
import LiveList from './pages/lecture/livelist/LiveList';
import LiveStudent from './pages/live/live-student/LiveStudent';
import LiveTeacher from './pages/live/live-teacher/LiveTeacher';
import Classroom from './pages/student/classroom/Classroom';
import DashboardStudent from './pages/student/dashboard-student/DashboardStudent';
import DashboardTeacher from './pages/teacher/dashboard-teacher/DashboardTeacher';
import EditDashboard from './pages/teacher/edit-dashboard/EditDashboard';
import LectureCreated from './pages/teacher/lecture-created/LectureCreated';
import LectureOpen from './pages/teacher/lecture-open/LectureOpen';
import StudentList from './pages/teacher/student-list/StudentList';
import Login from './pages/user/login/Login';
import KakaoCallback from 'pages/user/login/KakaoCallback';
import MyPage from './pages/user/mypage/MyPage';
import SignInfo from './pages/user/sign-info/SignInfo';
import PrivateRoute from 'components/PrivateRoute';
import NotFound from 'components/NotFound';

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    const trackingId = process.env.REACT_APP_GA_TRACKING_ID;
    if (trackingId) {
      ReactGA.initialize(trackingId);
      ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    } else {
      console.error('구글 애널리틱스 추적 ID가 설정되지 않았습니다.');
    }
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <Sentry.ErrorBoundary 
      fallback={<p>앱에서 오류가 발생했습니다.</p>}
      onError={(error, componentStack) => {
        console.error("Sentry에 의해 잡힌 오류:", error);
      }}
    >
      <Router>
        <Analytics />
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
          <Route path="/sign-info" element={<SignInfo />} />
          <Route path="/list" element={<LectureList />} />
          <Route path="/live-list" element={<LiveList />} />
          <Route path="/test-sign" element={<SignInfo />} />

          {/* 이하 로그인 후 접근 가능 */}
          <Route
            path="/enrollment"
            element={
              <PrivateRoute>
                <Enrollment />
              </PrivateRoute>
            }
          />
          <Route
            path="/enrollment/:classId"
            element={
              <PrivateRoute>
                <Enrollment />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/info/:classId"
            element={
              <PrivateRoute>
                <LectureInfo />
              </PrivateRoute>
            }
          />

          {/* Live Routes */}
          <Route
            path="/live/student/:classId"
            element={
              <PrivateRoute>
                <LiveStudent />
              </PrivateRoute>
            }
          />
          <Route
            path="/live/teacher/:classId"
            element={
              <PrivateRoute>
                <LiveTeacher />
              </PrivateRoute>
            }
          />
          
          {/* Student Routes */}
          <Route
            path="/classroom"
            element={
              <PrivateRoute>
                <Classroom />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/student/:classId"
            element={
              <PrivateRoute>
                <DashboardStudent />
              </PrivateRoute>
            }
          />

          {/* Teacher Routes */}
          <Route
            path="/dashboard/teacher/:classId"
            element={
              <PrivateRoute>
                <DashboardTeacher />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/edit/:classId"
            element={
              <PrivateRoute>
                <EditDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/created"
            element={
              <PrivateRoute>
                <LectureCreated />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/created/:classId"
            element={
              <PrivateRoute>
                <LectureCreated />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/open"
            element={
              <PrivateRoute>
                <LectureOpen />
              </PrivateRoute>
            }
          />
          <Route
            path="/lecture/students/:classId"
            element={
              <PrivateRoute>
                <StudentList />
              </PrivateRoute>
            }
          />
          
          {/* User Routes */}
          <Route
            path="/mypage"
            element={
              <PrivateRoute>
                <MyPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        
        </Routes>
      </Router>
    </Sentry.ErrorBoundary>
  );
}

export default App;
