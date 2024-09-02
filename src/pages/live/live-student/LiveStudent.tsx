import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<{ room: string; message: string; nickname: string; profileImage: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [content, setContent] = useState("");
  const [userInfo, setUserInfo] = useState<{ nickname: string; profileImage: string } | null>(null);

  const webcamVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareVideoRef = useRef<HTMLVideoElement>(null);

  // 유저 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(endpoints.userInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log('LiveStudent: 유저 정보를 정상적으로 받아왔습니다: ', response.data);
          setUserInfo(response.data.data);
        }
      } catch (error) {
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
          console.error('LiveStudent: 강의 정보를 불러오는 데 실패했습니다 > ', error);
        }
      } else {
        console.error('Invalid classId');
      }
    };

    fetchLectureInfo();
  }, [classId]);

  // WebRTC Connection
  useEffect(() => {
    const handleConnect = async () => {
      await connectToServerAsStudent(
        classId ?? '',
        setConnectionStatus,
        setIsSubscriptionDisabled,
        webcamVideoRef,
        screenShareVideoRef
      );
    };

    if (classId) {
      handleConnect();
    }
  }, [classId]);

  // WebSocket Connection
  useEffect(() => {
    const connect = () => {
      const socket = new SockJS(endpoints.connectWebSocket);
      console.log('connect 시도 중, url: ', endpoints.connectWebSocket)
      const client = new Client({
        webSocketFactory: () => socket,

        beforeConnect: () => {
          client.connectHeaders = {
            Authorization: `Bearer ${token}`
          };
        },

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
        const nickname = userInfo?.nickname || 'Anonymous';
        const profileImage = userInfo?.profileImage || profImage;

        console.log(`Received message: ${messageContent}`);
        showGreeting(roomId, messageContent, nickname, profileImage);
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
      alert('STOMP client is not connected. Cannot send message.');
      console.error('STOMP client is not connected. Cannot send message.');
    }
  };

  const showGreeting = (room: string, message: string, nickname: string, profileImage: string) => {
    setMessages(prevMessages => [...prevMessages, { room, message, nickname, profileImage }]);
  };

  const loadChatHistory = (roomId: string) => {
    axios.get(endpoints.getChatHistory.replace('{classId}', roomId))
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

export default LiveStudent;
