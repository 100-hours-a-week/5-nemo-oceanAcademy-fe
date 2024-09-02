import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from '../../../components/modal/Modal';
import axios from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';
import profImage from '../../../assets/images/profile_default.png';
import noCam from '../../../assets/images/no_cam.png';
import share from '../../../assets/images/share.png';
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
import ChatApp from '../../../components/ChatApp';

const LiveTeacher: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [userInfo, setUserInfo] = useState<{ nickname: string; profileImage: string } | null>(null);

  // webRTC 관련
  // roomId 대신 classId 사용, string이라 문제될 경우 int로 바꿔주기 
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

  // Chat 관련
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<{ room: string; message: string; nickname: string; profileImage: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState("");

  // 토글 상태
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isSystemAudioOn, setIsSystemAudioOn] = useState(false);

  const [isScreenClicked, setIsScreenClicked] = useState(false);

  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async() => {
      try {
        const response = await axios.get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log('LiveTeacher: 유저 정보를 정상적으로 받아왔습니다: ', response.data);
          setUserInfo(response.data.data);
        }
      } catch(error) {
        if (error.response && error.response.status === 401) {
          alert('권한이 없습니다.');
          navigate('/');
        } else {
            console.error('Error occurred: ', error);
        }
      }
    };

    fetchUserInfo();
  }, [navigate, token]);

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
          console.error('LiveTeacher: 강의 정보를 가져오는 데 실패했습니다 > ', error);
        }
      } else {
        console.error('classId가 유효하지 않습니다.');
      }
    };

    fetchLectureInfo();

    // 화면 공유 기능 지원 여부 확인
    if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
      setScreenStatus('Not supported');
      setIsScreenShareSupported(false);
    }
  }, [classId]);

  // RTC Connection
  useEffect(() => {
    if (classId) {
      // LiveTeacher 컴포넌트가 로드될 때 서버에 연결
      // TO DO: classId.toString() -> classId로 해도 문제 없는지 체크 
      connectToServerAsTeacher(classId.toString(), setConnectionStatus, setIsPublishingDisabled)
        .then(() => {
          console.log("Successfully connected to server as a teacher");
          console.log("연결 상태: ", connectionStatus);
        })
        .catch((error) => {
          console.error("Failed to connect to server:", error);
        });
    }
  }, [classId]);

  // 웹캠 스트림 시작/중지 핸들러
  const handleStartWebcam = async () => {
    if (!webcamProducer) {
        const producer = await startWebcamStream(classId, useSimulcast, setWebcamStatus, webcamVideoRef.current);
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
      const producer = await startWebcamStream(classId, useSimulcast, () => {}, webcamVideoRef.current);
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
      const producer = await startScreenShareStream(classId, useSimulcast, () => {}, screenShareVideoRef.current);
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
      const producer = await startMicrophoneStream(classId, () => {});
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
      const producer = await startSystemAudioStream(classId, () => {});
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
        const producer = await startScreenShareStream(classId, useSimulcast, setScreenStatus, screenShareVideoRef.current);
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
        const producer = await startMicrophoneStream(classId, setMicrophoneStatus);
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
        const producer = await startSystemAudioStream(classId, setSystemAudioStatus);
        setSystemAudioProducer(producer);
    }
  };

  const handleStopSystemAudio = () => {
    if (systemAudioProducer) {
        stopSystemAudioStream(systemAudioProducer, setSystemAudioStatus);
        setSystemAudioProducer(null);
    }
  };

  // Websocket Connection
  useEffect(() => {
    const connect = () => {
      const socket = new SockJS(endpoints.connectWebSocket);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: () => {
          setStompClient(client);
          setConnected(true);
          subscribeToRoom(classId);
          loadChatHistory(classId);
          console.log('STOMP client connected');
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
        onDisconnect: () => {
          setConnected(false);
          console.log("Disconnected");
        }
      });

      client.activate();
    };

    const disconnect = () => {
      if (stompClient) {
        stompClient.deactivate();
        setConnected(false);
        console.log("Disconnected");
      }
    };

    if (classId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [classId, stompClient]);

  // 채팅 관련 핸들러
  const subscribeToRoom = (roomId: string) => {
    if (stompClient && connected) {
      stompClient.subscribe(`/topic/greetings/${roomId}`, (greeting) => {
        const messageContent = JSON.parse(greeting.body).content;
        showGreeting(roomId, messageContent, userInfo?.nickname || 'Anonymous', userInfo?.profileImage || profImage);
      });
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected && classId) {
      const chatMessage = {
        roomId: Number(classId),
        content: content,
        writerId: userInfo ? userInfo.nickname : 'Anonymous',
        createdDate: new Date().toISOString()
      };

      stompClient.publish({
        destination: endpoints.sendMessage,
        body: JSON.stringify(chatMessage),
      });

      setContent('');
    } else {
      console.error('STOMP client is not connected. Cannot send message.');
    }
  };

  const showGreeting = (room: string, message: string, nickname: string, profileImage: string) => {
    setMessages(prevMessages => [...prevMessages, { room, message, nickname, profileImage }]);
  };

  const loadChatHistory = (roomId: string) => {
    axios.get(endpoints.getChatHistory(roomId))
      .then(response => {
        setMessages(response.data.map(msg => ({
          room: roomId,
          message: msg.content,
          nickname: msg.writerId || 'Anonymous',
          profileImage: profImage
        })));
      })
      .catch(error => {
        console.error("Failed to load chat history:", error);
      });
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

  const handleScreenClick = () => {
    setIsScreenClicked((prev) => !prev);
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
          {messages.map((msg, index) => (
            <div key={index} className={styles.chat}>
              <div className={styles.profContainer}>
                <img
                  src={profImage} // {msg.profileImage}
                  alt="프로필"
                  className={styles.icon}
                />
              </div>  
              <div className={styles.chatContainer}>
                <div className={styles.chatInfo}>
                  <h5>{msg.nickname}</h5>
                  <p>{new Date().toLocaleTimeString()}</p>
                </div>
                <div className={styles.chatBubble}>
                  <p>{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.chatInput}>
          <input 
            type="text" 
            placeholder="메시지를 입력하세요" 
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </Container>
  );
};

export default LiveTeacher;
