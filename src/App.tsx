import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import { Container } from './styles/GlobalStyles'

const App: React.FC = () => {  
  return (
    <Router>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/sign-info" element={<SignInfo />} />
        <Route path="/list" element={<LectureList />} />
        <Route path="/live-list" element={<LiveList />} />

        {/* 이하 로그인 후 접근 가능 */}
        <Route path="/enrollment" element={<Enrollment />} />
        <Route path="/enrollment/:classId" element={<Enrollment />} />
        <Route path="/lecture/info/:classId" element={<LectureInfo />} />
        
        {/* Live Routes */}
        <Route path="/live/student/:classId" element={<LiveStudent />} />
        <Route path="/live/teacher/:classId" element={<LiveTeacher />} />
        
        {/* Student Routes */}
        <Route path="/classroom" element={<Classroom />} />
        <Route path="/dashboard/student/:classId" element={<DashboardStudent />} />
        
        {/* Teacher Routes */}
        <Route path="/dashboard/teacher/:classId" element={<DashboardTeacher />} />
        <Route path="/dashboard/edit/:classId" element={<EditDashboard />} />
        <Route path="/lecture/created" element={<LectureCreated />} />
        <Route path="/lecture/created/:classId" element={<LectureCreated />} />
        <Route path="/lecture/open" element={<LectureOpen />} />
        <Route path="/lecture/students/:classId" element={<StudentList />} />
        
        {/* User Routes */}
        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <MyPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
