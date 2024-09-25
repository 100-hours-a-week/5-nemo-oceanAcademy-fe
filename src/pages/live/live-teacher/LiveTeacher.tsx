import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Modal from '../../../components/modal/Modal';
import axios, { AxiosError } from 'axios';
import endpoints from '../../../api/endpoints';
import styles from './LiveTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';
import {
  Producer,
  connectToServerAsTeacher,
  DisconnectToServer,
  startWebcamStream,
  stopWebcamStream,
  startScreenShareStream,
  stopScreenShareStream,
  startMicrophoneStream,
  stopMicrophoneStream,
  startSystemAudioStream,
  stopSystemAudioStream
} from '../../../components/web-rtc/utils/teacher/teacherClient';

// import images
import profileDefault1 from '../../../assets/images/profile/jellyfish.png';
import profileDefault2 from '../../../assets/images/profile/whale.png';
import profileDefault3 from '../../../assets/images/profile/crab.png';
import noCam from '../../../assets/images/icon/no_cam.png';
import share from '../../../assets/images/icon/share.png';
import videoOn from '../../../assets/images/icon/video.png';
import videoOff from '../../../assets/images/icon/no_video.png';
import shareScreen from '../../../assets/images/icon/sharescreen.png';
import micOn from '../../../assets/images/icon/mic.png';
import micOff from '../../../assets/images/icon/no_mic.png';
import audioOn from '../../../assets/images/icon/audio.png';
import audioOff from '../../../assets/images/icon/no_audio.png';

const profileImages = [profileDefault1, profileDefault2, profileDefault3];

interface Message {
  room: string;
  message: string;
  nickname: string;
  profileImage: string;
  time: string;
}

const LiveTeacher: React.FC = () => {
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const { classId } = useParams<{ classId: string }>();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [userInfo, setUserInfo] = useState<{ nickname: string; profileImage: string } | null>(null);

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

  // Chat 관련
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [currentRoom, setCurrentRoom] = useState(classId);
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState("");

  const getProfileImage = (nickname: string | null): string => {
    const safeNickname = nickname || '익명';
    let hash = 0;
    for (let i = 0; i < safeNickname.length; i++) {
      hash = safeNickname.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % profileImages.length);
    return profileImages[index];
  };

  // 라이브 상태 업데이트 함수
  const updateLiveStatus = async () => {
    try {
      const response = await axios.patch(endpoints.isActive.replace('{classId}', classId || ''), 
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('라이브 상태 변경 성공!!!!!:', response.data.data);
      console.log('시간체크: ', response.data.timestamp);
    } catch (error) {
      console.error('라이브 상태 변경 중 오류 발생:', error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          // alert('토큰이 만료되었거나 권한이 없습니다. 다시 로그인해 주세요.');
          // navigate('/login');
          console.log('왜 오류가 뜨죠?');
        } else if (error.response.status === 404) {
          alert('해당하는 강의를 찾을 수 없습니다.');
          navigate('/mypage');
        } else if (error.response.status === 418) {
          alert('강의 접근 권한이 없습니다.');
          navigate('/');
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  // 페이지 진입 시 is_active 상태 확인 및 true로 변경
  useEffect(() => {
    // 강의가 활성화되어 있는지 확인하고, 활성화되어 있지 않다면 활성화
    const initializeLiveStatus = async () => {
      try {
        const response = await axios.get(endpoints.isActive.replace('{classId}', classId || ''), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const isActive = response.data.data.active; 
        console.log("현재 라이브 상태 체크 (false여야 할걸?): ", isActive);
        if (!isActive) {
          // 활성화되어 있지 않다면 활성화
          await updateLiveStatus();
        } else {
          console.warn('이미 활성화된 강의입니다.');
        }
      } catch (error) {
        console.error('강의 활성화 상태 확인 중 오류 발생:', error);
      }
    };

    initializeLiveStatus();

    /* 언마운트 시점에서 is_active 상태를 false로 변경
    return () => {
      updateLiveStatus(); // 강의 종료 시 is_active=false로 변경
    };
    */
  }, [classId, token]);


  const setConnectedState = (connected: boolean) => {
    setConnected(connected);
    if (!connected) {
        setMessages([]);
    }
  };

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS(endpoints.connectWebSocket);
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        beforeConnect: () => {
          client.connectHeaders = {
            Authorization: `Bearer ${token}`
          };
        },
        onConnect: () => {
            setStompClient(client);
            setConnectedState(true);
  
            console.log('STOMP client connected');
        },
        onStompError: (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        },
        onDisconnect: () => {
            setConnectedState(false);
            console.log("Disconnected");
        }
      });
  
      client.activate();
    }; 

    connect();
  }, [classId]);

  // useEffect를 사용하여 stompClient 상태가 업데이트된 후 작업 수행
  useEffect(() => {
    if (stompClient && connected && currentRoom) {
        console.log(stompClient);
        console.log("Attempting to subscribe...");
        subscribeToRoom(currentRoom); // 현재 방에 구독
        loadChatHistory(currentRoom); // 현재 방의 채팅 기록 로드
    }
  }, [stompClient, connected, currentRoom]);

  const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();
        setConnectedState(false);
        console.log("Disconnected");
    }
  };

  const subscribeToRoom = (classId: string) => {
    if (!stompClient) {
      console.error('STOMP client is not initialized. Cannot subscribe.');
      return;
    }

    if (!stompClient.connected) {
      console.error('STOMP client is not connected. Cannot subscribe.');
      return;
    }

    if (subscription) {
      console.log('Unsubscribing from previous room');
      subscription.unsubscribe();  // 이전 방에 대한 구독 해제
    }
    
    console.log("Attempting to subscribe to roomId = " + classId);
    console.log("currentRoom = " + currentRoom);
    
    try {
      const newSubscription = stompClient.subscribe(`/topic/greetings/${classId}`, (greeting) => {
        console.log('Raw message received:', greeting.body); // raw data

        const messageContent = JSON.parse(greeting.body);
        const pf = messageContent.profile_image_path || getProfileImage(messageContent.writer);
        const tm = new Date(messageContent.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        console.log(`Received message: ${messageContent.content}`);
        showGreeting(messageContent.roomId, messageContent.content, messageContent.writer, pf, tm);
      });

      setSubscription(newSubscription);
      console.log("Successfully subscribed to room " + classId);
    } catch (error) {
      console.error("Failed to subscribe: ", error);
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        roomId: currentRoom,
        content: content,
        writer: userInfo ? userInfo.nickname : null,
        profile_image_path: userInfo?.profileImage,
        createdDate: new Date().toISOString()
      };

      // 메시지를 서버로 전송
      stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify(chatMessage),
      });

      setContent('');

      // 채팅 기록 다시 로드
      if (currentRoom) {
        loadChatHistory(currentRoom);
      }
    } else {
      console.error('STOMP client is not connected. Cannot send message.');
    }
  };

  const showGreeting = (room: string, message: string, nickname: string, profileImage: string, time: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { 
        room, 
        message, 
        nickname,
        profileImage,
        time
      }
    ]);
  };  
  
  const loadChatHistory = (classId: string) => {
    axios.get(endpoints.getChatHistory.replace('{classId}', classId))
      .then(response => {
        console.log('Teacher-Server Response Data:', response.data);

        setMessages(response.data.map((msg:any) => ({
          room: msg.roomId,
          message: msg.content,
          nickname: msg.writer || '익명',
          profileImage: msg.profile_image_path || getProfileImage(msg.writer),
          time: new Date(msg.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })));
      })
      .catch(error => {
          console.error("Failed to load chat history:", error);
      });
  };

  // 토글 상태
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isScreenShareOn, setIsScreenShareOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isSystemAudioOn, setIsSystemAudioOn] = useState(false);
  const [isScreenClicked, setIsScreenClicked] = useState(false);

  //Ref
  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // 유저 정보 조회 (for 채팅)
  useEffect(() => {
    const fetchUserInfo = async() => {
      try {
        const response = await axios.get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setUserInfo(response.data.data);
        }
      } catch(error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.status === 401) {
            alert('권한이 없습니다.');
            navigate('/');
        } else {
            console.error('Error occurred: ', axiosError);
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
          console.log("RTC: Successfully connected to server as a teacher");
        })
        .catch((error) => {
          console.error("Failed to connect to server:", error);
        });
    }
  }, [classId]);

  //언마운트 시점에서 isWebcamOn과 webcamProducer의 상태를 정확히 반영할 수있도록 상태 등록
  const webcamOnRef = useRef(isWebcamOn);
  const screenShareOnRef = useRef(isScreenShareOn);
  const microphoneOnRef = useRef(isMicrophoneOn);
  const systemAudioOnRef = useRef(isSystemAudioOn);
  
  const webcamProducerRef = useRef(webcamProducer);
  const screenShareProducerRef = useRef(screenShareProducer);
  const microphoneProducerRef = useRef(microphoneProducer);
  const systemAudioProducerRef = useRef(systemAudioProducer);
  
  // isWebcamOn과 webcamProducer 상태가 변경될 때마다 Ref를 업데이트
  useEffect(() => {
    webcamOnRef.current = isWebcamOn;
    webcamProducerRef.current = webcamProducer;

    screenShareOnRef.current = isScreenShareOn;
    screenShareProducerRef.current = screenShareProducer;

    microphoneOnRef.current = isMicrophoneOn;
    microphoneProducerRef.current = microphoneProducer;

    systemAudioOnRef.current = isSystemAudioOn;
    systemAudioProducerRef.current = systemAudioProducer;
    }, [
        isWebcamOn, webcamProducer,
        isScreenShareOn, screenShareProducer,
        isMicrophoneOn, microphoneProducer,
        isSystemAudioOn, systemAudioProducer
    ]);
  
  //언마운트 로직 추가
  useEffect(() => {
      return () => {
        //각 스트림 종료 처리
        if (webcamOnRef.current && webcamProducerRef.current) {
          stopWebcamStream(webcamProducerRef.current, () => {});
          setWebcamProducer(null);
          setIsWebcamOn(false);
        }

        if (screenShareOnRef.current && screenShareProducerRef.current) {
            stopScreenShareStream(screenShareProducerRef.current, () => {});
            setScreenShareProducer(null);
            setIsScreenShareOn(false);
        }

        if (microphoneOnRef.current && microphoneProducerRef.current) {
            stopMicrophoneStream(microphoneProducerRef.current, () => {});
            setMicrophoneProducer(null);
            setIsMicrophoneOn(false);
        }

        if (systemAudioOnRef.current && systemAudioProducerRef.current) {
            stopSystemAudioStream(systemAudioProducerRef.current, () => {});
            setSystemAudioProducer(null);
            setIsSystemAudioOn(false);
        }

        //웹소캣 연결 종료
        DisconnectToServer();
        updateLiveStatus();
      };
  }, []);


  // 웹캠 스트림 시작/중지 핸들러
  const handleStartWebcam = async () => {
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

    if (!webcamProducer) {
        const producer = await startWebcamStream(classId, useSimulcast, setWebcamStatus, webcamVideoRef.current);
        setWebcamProducer(producer);
    }
  };

  // 웹캠 토글 핸들러
  const handleToggleWebcam = async () => {
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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
    if (!classId) {
      console.error('classId가 정의되지 않았습니다.');
      return;
    }

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

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Modal handler
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

      <div className={styles.controls}>
        <button onClick={handleToggleWebcam} style={{ backgroundColor: isWebcamOn ? '#4A4B4D' : '#FFFFFF' }}>
          <img src={isWebcamOn ? videoOn : videoOff} alt="캠" className={styles.icon} />
        </button>
        <button onClick={handleToggleScreenShare} style={{ backgroundColor: isScreenShareOn ? '#4A4B4D' : '#FFFFFF' }}>
          <img src={shareScreen} alt="화면 공유" className={styles.icon} />
        </button>
        <button onClick={handleToggleMicrophone} style={{ backgroundColor: isMicrophoneOn ? '#4A4B4D' : '#FFFFFF' }}>
          <img src={isMicrophoneOn ? micOn : micOff} alt="마이크" className={styles.icon} />
        </button>
        <button onClick={handleToggleSystemAudio} style={{ backgroundColor: isSystemAudioOn ? '#4A4B4D' : '#FFFFFF' }}>
          <img src={isSystemAudioOn ? audioOn : audioOff} alt="오디오" className={styles.icon} />
        </button>
      </div>

      <div className={styles.info}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.instructor}>{instructor}</p>
      </div>
      
      <div className={styles.chatSection}>
        <div className={styles.chatWindow} ref={chatWindowRef}>
          {messages.map((msg, index) => {
              // 현재 사용자가 보낸 메시지인지 확인
              const isMyMessage = msg.nickname === userInfo?.nickname;
              
              return (
                <div
                  key={index}
                  className={`${styles.chat} ${isMyMessage ? styles.myChat : ''}`} // 내가 보낸 메시지일 때 추가 클래스
                >
                  {/* 현재 사용자가 보낸 메시지일 때는 프로필 이미지 숨김 */}
                  {!isMyMessage && (
                    <div className={styles.profContainer}>
                      <img src={msg.profileImage} alt="프로필" className={styles.icon} />
                    </div>
                  )}
                  <div className={styles.chatContainer}>
                    <div className={styles.chatInfo}>
                      {!isMyMessage && <h5>{msg.nickname}</h5>}
                      <p>{msg.time}</p>
                    </div>
                    <div className={`${styles.chatBubble} ${isMyMessage ? styles.myChatBubble : ''}`}>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        <div className={styles.chatInput}>
          <textarea
            placeholder="채팅을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={1} // 기본 행의 높이 설정
            style={{ resize: 'none', overflow: 'hidden' }} // 크기 조정 방지 및 스크롤 숨김
          />
          <button 
            onClick={sendMessage}
            disabled={!connected}
          >
            Send
          </button>
        </div>
      </div>
    </Container>
  );
};

export default LiveTeacher;
