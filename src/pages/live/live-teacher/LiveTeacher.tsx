import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/modal/Modal';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';
import profImage from '../../../assets/images/profile_default.png';
import {
  connectToServerAsTeacher,
  startWebcamStream,
  stopWebcamStream,
  startScreenShareStream,
  stopScreenShareStream,
  Producer
} from '../../../components/web-rtc/utils/teacher/teacherClient';

const LiveTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  // WebRTC 관련 상태
  const [roomId, setRoomId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [webcamStatus, setWebcamStatus] = useState('');
  const [screenStatus, setScreenStatus] = useState('');
  const [isPublishingDisabled, setIsPublishingDisabled] = useState(true);
  const [useSimulcast, setUseSimulcast] = useState(false);

  // Producer 상태
  const [webcamProducer, setWebcamProducer] = useState<Producer | null>(null);
  const [screenShareProducer, setScreenShareProducer] = useState<Producer | null>(null);

  // 비디오 요소 참조
  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 서버 연결 핸들러
  const handleConnect = async () => {
    await connectToServerAsTeacher(roomId, setConnectionStatus, setIsPublishingDisabled);
  };

  // 웹캠 스트림 시작/중지 핸들러
  const handleStartWebcam = async () => {
    if (!webcamProducer) {
      const producer = await startWebcamStream(roomId, useSimulcast, setWebcamStatus, webcamVideoRef.current);
      setWebcamProducer(producer);
    }
  };

  const handleStopWebcam = () => {
    if (webcamProducer) {
      stopWebcamStream(webcamProducer, setWebcamStatus);
      setWebcamProducer(null);
    }
  };

  // 화면 공유 스트림 시작/중지 핸들러
  const handleStartScreenShare = async () => {
    if (!screenShareProducer) {
      const producer = await startScreenShareStream(roomId, useSimulcast, setScreenStatus, screenShareVideoRef.current);
      setScreenShareProducer(producer);
    }
  };

  const handleStopScreenShare = () => {
    if (screenShareProducer) {
      stopScreenShareStream(screenShareProducer, setScreenStatus);
      setScreenShareProducer(null);
    }
  };  
  
  const handleLeaveClick = () => {
    setShowModal(true);
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1); // TO DO: 이전 화면으로 이동 -> 대시보드나 마이페이지로 이동 
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <Container>
      {showModal && (
        <Modal 
          title="강의를 종료하시겠습니까?"
          content="강의가 끝났나요?"
          leftButtonText="종료"
          rightButtonText="취소"
          onLeftButtonClick={handleModalLeave}
          onRightButtonClick={handleModalCancel}
        />
      )}
      <div className={styles.videoSection}>
        <div className={styles.video}>강의 화면</div>
        <div className={styles.smallVideo}>작은 화면</div>
      </div>

      <div className={styles.info}>
        <h2>스티븐의 이안이 좋아요</h2>
        <p>강사: 스티븐</p>
      </div>

      <div className={styles.controls}>
        <button>녹화</button>
        <button>동영상 on</button>
        <button>음성 on</button>
        <button>화면공유</button>
      </div>
      
      <div className={styles.chatSection}>
        <div className={styles.chatWindow}>
          <div className={styles.chat}>
            <div className={styles.profContainer}>
              <img
                src={profImage}
                alt="프로필"
                className={styles.icon}
              />
              <div className={styles.chatContainer}>
                <div className={styles.chatInfo}>
                  <h5>스티븐</h5>
                  <p>9:43 am</p>
                </div>
                <div className={styles.chatBubble}>
                  <p>강유석 엎드려</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.chatInput}>
          <input type="text" placeholder="메시지를 입력하세요" />
          <button>Send</button>
        </div>
      </div>
    </Container>
  );
};

export default LiveTeacher;