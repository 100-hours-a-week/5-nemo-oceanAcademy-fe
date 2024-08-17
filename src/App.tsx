import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import WebRTCComponent from './components/web-rtc/WebRTCComponent';
import Header from './components/header/Header';
import Main from './pages/main/Main';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/webrtc" element={<WebRTCComponent />} />
      </Routes>
    </Router>
  );
}


export default App;
