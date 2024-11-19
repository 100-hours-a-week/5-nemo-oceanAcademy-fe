import { useState, useEffect } from 'react';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import endpoints from '../api/endpoints';
import axios from 'axios';

interface Message {
  room: string;
  message: string;
  nickname: string;
  profileImage: string;
  time: string;
}

const useChat = (classId: string | undefined, token: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS(endpoints.connectWebSocket);
      const client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          setConnected(true);
          setStompClient(client);
          console.log('STOMP client connected');
        },
        onDisconnect: () => {
          setConnected(false);
          console.log('Disconnected');
        },
      });
      client.activate();
    };

    if (token) {
      connect();
    }

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [classId, token]);

  const sendMessage = (content: string, nickname: string, profileImage: string) => {
    if (stompClient && connected) {
      const chatMessage = {
        roomId: classId,
        content,
        writer: nickname,
        profile_image_path: profileImage,
        createdDate: new Date().toISOString(),
      };
      stompClient.publish({
        destination: '/app/hello',
        body: JSON.stringify(chatMessage),
      });
    }
  };

  const loadChatHistory = async () => {
    if (!classId) return;

    try {
      const response = await axios.get(endpoints.getChatHistory.replace('{classId}', classId));
      setMessages(
        response.data.map((msg: any) => ({
          room: msg.roomId,
          message: msg.content,
          nickname: msg.writer || '익명',
          profileImage: msg.profile_image_path || 'defaultProfileImage', // 기본 이미지 처리
          time: new Date(msg.createdDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }))
      );
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  return { messages, sendMessage, loadChatHistory };
};

export default useChat;
