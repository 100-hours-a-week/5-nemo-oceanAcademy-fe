import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../../components/modal/Modal';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';
import profImage from '../../../assets/images/profile_default.png';
import {
  Producer,
  connectToServerAsTeacher,
  startWebcamStream,
  stopWebcamStream,
  startScreenShareStream,
  stopScreenShareStream,
  startMicrophoneStream,
  stopMicrophoneStream,
  startSystemAudioStream,
  stopSystemAudioStream
} from '../../../components/web-rtc/utils/teacher/teacherClient';

const LiveTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');

  // webRTC 관련
  const roomId = classId ? parseInt(classId, 10) : null;
  const [connectionStatus, setConnectionStatus] = useState('');
  const [webcamStatus, setWebcamStatus] = useState('');
  const [screenStatus, setScreenStatus] = useState('');
  const [microphoneStatus, setMicrophoneStatus] = useState('');
  const [systemAudioStatus, setSystemAudioStatus] = useState('');
  const [isPublishingDisabled, setIsPublishingDisabled] = useState(true);
  const [useSimulcast, setUseSimulcast] = useState(false);
  const [isScreenShareSupported, setIsScreenShareSupported] = useState(true);

  const [webcamProducer, setWebcamProducer] = useState<Producer | null>(null);
  const [screenShareProducer, setScreenShareProducer] = useState<Producer | null>(null);
  const [microphoneProducer, setMicrophoneProducer] = useState<Producer | null>(null);
  const [systemAudioProducer, setSystemAudioProducer] = useState<Producer | null>(null);

  // 토글 상태
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isSystemAudioOn, setIsSystemAudioOn] = useState(false);

  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 페이지 로딩 시 강의 정보 가져오기
  useEffect(() => {
    const fetchLectureInfo = async () => {
      if (classId) {
        try {
          const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId));
          const lectureData = response.data;
          setTitle(lectureData.title);
          setInstructor(lectureData.instructor);
        } catch (error) {
          console.error('Failed to fetch lecture info:', error);
        }
      } else {
        console.error('Invalid classId');
      }
    };

    fetchLectureInfo();

    // 화면 공유 기능 지원 여부 확인
    if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
      setScreenStatus('Not supported');
      setIsScreenShareSupported(false);
    }
  }, [classId]);

  // 서버 연결 핸들러
  const handleConnect = async () => {
    await connectToServerAsTeacher(roomId, setConnectionStatus, setIsPublishingDisabled);
    console.log("연결 상태: ", connectionStatus);
};

  // 웹캠 스트림 시작/중지 핸들러
  const handleStartWebcam = async () => {
    if (!webcamProducer) {
        const producer = await startWebcamStream(roomId, useSimulcast, setWebcamStatus, webcamVideoRef.current);
        setWebcamProducer(producer);
    }
};

  // 웹캠 토글 핸들러
  const handleToggleWebcam = async () => {
    if (isWebcamOn) {
      if (webcamProducer) {
        stopWebcamStream(webcamProducer, () => {});
        setWebcamProducer(null);
        setIsWebcamOn(false);
      }
    } else {
      const producer = await startWebcamStream(roomId, useSimulcast, () => {}, webcamVideoRef.current);
      setWebcamProducer(producer);
      setIsWebcamOn(true);
    }
  };

  // 화면 공유 토글 핸들러
  const handleToggleScreenShare = async () => {
    if (isScreenShareOn) {
      if (screenShareProducer) {
        stopScreenShareStream(screenShareProducer, () => {});
        setScreenShareProducer(null);
        setIsScreenShareOn(false);
      }
    } else {
      const producer = await startScreenShareStream(roomId, useSimulcast, () => {}, screenShareVideoRef.current);
      setScreenShareProducer(producer);
      setIsScreenShareOn(true);
    }
  };

  // 마이크 토글 핸들러
  const handleToggleMicrophone = async () => {
    if (isMicrophoneOn) {
      if (microphoneProducer) {
        stopMicrophoneStream(microphoneProducer, () => {});
        setMicrophoneProducer(null);
        setIsMicrophoneOn(false);
      }
    } else {
      const producer = await startMicrophoneStream(roomId, () => {});
      setMicrophoneProducer(producer);
      setIsMicrophoneOn(true);
    }
  };

  // 시스템 오디오 토글 핸들러
  const handleToggleSystemAudio = async () => {
    if (isSystemAudioOn) {
      if (systemAudioProducer) {
        stopSystemAudioStream(systemAudioProducer, () => {});
        setSystemAudioProducer(null);
        setIsSystemAudioOn(false);
      }
    } else {
      const producer = await startSystemAudioStream(roomId, () => {});
      setSystemAudioProducer(producer);
      setIsSystemAudioOn(true);
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
  
  const handleStartMicrophone = async () => {
    if (!microphoneProducer) {
        const producer = await startMicrophoneStream(roomId, setMicrophoneStatus);
        setMicrophoneProducer(producer);
    }
  };

  const handleStopMicrophone = () => {
    if (microphoneProducer) {
        stopMicrophoneStream(microphoneProducer, setMicrophoneStatus);
        setMicrophoneProducer(null);
    }
  };

  const handleStartSystemAudio = async () => {
    if (!systemAudioProducer) {
        const producer = await startSystemAudioStream(roomId, setSystemAudioStatus);
        setSystemAudioProducer(producer);
    }
  };

  const handleStopSystemAudio = () => {
    if (systemAudioProducer) {
        stopSystemAudioStream(systemAudioProducer, setSystemAudioStatus);
        setSystemAudioProducer(null);
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
        <div className={styles.video}>
          <video 
            ref={webcamVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%' }}
          ></video>
        </div>
        <div className={styles.smallVideo}>
          <video 
            ref={screenShareVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%' }}
          ></video>
        </div>
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.instructor}>{instructor}</p>
      </div>

      <div className={styles.controls}>
        <button
          onClick={handleToggleWebcam}
          style={{ backgroundColor: isWebcamOn ? '#FCFAC5' : '#FFFFFF' }}
        >
          Cam
        </button>
        <button
          onClick={handleToggleScreenShare}
          style={{ backgroundColor: isScreenShareOn ? '#FCFAC5' : '#FFFFFF' }}
        >
          Share
        </button>
        <button
          onClick={handleToggleMicrophone}
          style={{ backgroundColor: isMicrophoneOn ? '#FCFAC5' : '#FFFFFF' }}
        >
          Mic
        </button>
        <button
          onClick={handleToggleSystemAudio}
          style={{ backgroundColor: isSystemAudioOn ? '#FCFAC5' : '#FFFFFF' }}
        >
          Audio
        </button>
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
            </div>  
            <div className={styles.chatContainer}>
              <div className={styles.chatInfo}>
                <h5>스티븐</h5>
                <p>9:43 am</p>
              </div>
              <div className={styles.chatBubble}>
                <p>유석이형 아프지마</p>
              </div>
            </div>
          </div>
          <div className={styles.chat}>
            <div className={styles.profContainer}>
              <img
                src={profImage}
                alt="프로필"
                className={styles.icon}
              />
            </div>  
            <div className={styles.chatContainer}>
              <div className={styles.chatInfo}>
                <h5>지렁이</h5>
                <p>9:43 am</p>
              </div>
              <div className={styles.chatBubble}>
                <p>유석이형 건강해</p>
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
