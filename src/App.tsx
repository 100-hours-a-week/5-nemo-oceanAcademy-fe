import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WebRTCComponent from './components/web-rtc/WebRTCComponent';
import Header from './components/header/Header';
import Main from './pages/main/Main';
import WebRTCTestComponent from 'components/web-rtc-test/WebRTCTestComponent';
import WebRTCTestStudent from 'components/web-rtc-test/WebRTCTestStudent';
import WebRTCTestTeacher from 'components/web-rtc-test/WebRTCTestTeacher';

const App: React.FC = () => {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/webrtc" element={<WebRTCComponent />} />
        <Route path="/webrtc-test" element={<WebRTCTestComponent/>}/>
        <Route path="/webrtc-student" element={<WebRTCTestStudent/>}/>
        <Route path="/webrtc-teacher" element={<WebRTCTestTeacher/>}/>
      </Routes>
    </Router>
  );
}


export default App;
