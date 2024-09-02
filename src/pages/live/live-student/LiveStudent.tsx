import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../../components/modal/Modal';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveStudent.module.css';
import { Container } from '../../../styles/GlobalStyles';
import profImage from '../../../assets/images/profile_default.png';
import noCam from '../../../assets/images/no_cam.png';
import share from '../../../assets/images/share.png';
import { connectToServerAsStudent } from '../../../components/web-rtc/utils/student/studentClient';

const LiveStudent: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState(true);

  const [isScreenClicked, setIsScreenClicked] = useState(false);

  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 페이지 로딩 시 강의 정보 가져오기
  useEffect(() => {
    const fetchLectureInfo = async () => {
      if (classId) {
        try {
          const response = await axios.get(endpoints.getLectureInfo.replace('{classId}', classId));
          const lectureData = response.data.data;
          setTitle(lectureData.name);
          setInstructor(lectureData.instructor);
          console.log(response.data.message_eng, response.data.timestamp);
        } catch (error) {
          console.error('LiveStudent: 강의 정보를 불러오는 데 실패했습니다 > ', error);
        }
      } else {
        console.error('Invalid classId');
      }
    };

    fetchLectureInfo();
  }, [classId]);
  
  // 서버 연결 및 강의 참여 핸들러
  const handleConnect = async () => {
    await connectToServerAsStudent(
      classId ?? '',
      setConnectionStatus,
      setIsSubscriptionDisabled,
      webcamVideoRef,
      screenShareVideoRef
    );
  };

  // 페이지에 들어오자마자 서버에 연결
  useEffect(() => {
    if (classId) {
        handleConnect();
    }
  }, [classId]);
  
  // 비디오 스트림 이벤트 처리
  useEffect(() => {
    const handleWebcamLoadedMetadata = () => {
      console.log('Webcam video metadata loaded');
    };

    const handleWebcamCanPlay = () => {
      console.log('Webcam video can play');
    };

    const handleWebcamPlaying = () => {
      console.log('Webcam video is playing');
    };

    const handleScreenShareLoadedMetadata = () => {
      console.log('Screen share video metadata loaded');
    };

    const handleScreenShareCanPlay = () => {
      console.log('Screen share video can play');
    };

    const handleScreenSharePlaying = () => {
      console.log('Screen share video is playing');
    };

    if (webcamVideoRef.current) {
      const webcamVideo = webcamVideoRef.current;
      webcamVideo.addEventListener('loadedmetadata', handleWebcamLoadedMetadata);
      webcamVideo.addEventListener('canplay', handleWebcamCanPlay);
      webcamVideo.addEventListener('playing', handleWebcamPlaying);
    }

    if (screenShareVideoRef.current) {
      const screenShareVideo = screenShareVideoRef.current;
      screenShareVideo.addEventListener('loadedmetadata', handleScreenShareLoadedMetadata);
      screenShareVideo.addEventListener('canplay', handleScreenShareCanPlay);
      screenShareVideo.addEventListener('playing', handleScreenSharePlaying);
    }

    return () => {
      if (webcamVideoRef.current) {
        const webcamVideo = webcamVideoRef.current;
        webcamVideo.removeEventListener('loadedmetadata', handleWebcamLoadedMetadata);
        webcamVideo.removeEventListener('canplay', handleWebcamCanPlay);
        webcamVideo.removeEventListener('playing', handleWebcamPlaying);
      }

      if (screenShareVideoRef.current) {
        const screenShareVideo = screenShareVideoRef.current;
        screenShareVideo.removeEventListener('loadedmetadata', handleScreenShareLoadedMetadata);
        screenShareVideo.removeEventListener('canplay', handleScreenShareCanPlay);
        screenShareVideo.removeEventListener('playing', handleScreenSharePlaying);
      }
    };
  }, []);

  const handleLeaveClick = () => {
    setShowModal(true);
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1); // 이전 화면으로 이동
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleScreenClick = () => {
    setIsScreenClicked((prev) => !prev);
  };

  return (
    <Container>
      {showModal && (
        <Modal 
          title="강의를 나가시겠습니까?"
          content="아직 강의 중이에요!"
          leftButtonText="나가기"
          rightButtonText="취소"
          onLeftButtonClick={handleModalLeave}
          onRightButtonClick={handleModalCancel}
        />
      )}
      <div className={styles.videoSection}>
        <div className={styles.screenShare}>
          <video 
            ref={screenShareVideoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ objectFit: isScreenClicked ? 'cover' : 'contain' }}
          />
        </div>
        <div className={styles.smallVideo}>
          <video 
            ref={webcamVideoRef} 
            autoPlay
            playsInline
            muted 
          />
        </div>
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.instructor}>{instructor}</p>
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

export default LiveStudent;