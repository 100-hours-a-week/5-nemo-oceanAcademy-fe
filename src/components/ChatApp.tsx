import React, { useState, useEffect } from 'react';
import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

interface Message {
  room: string;
  message: string;
}

const ChatApp: React.FC = () => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [currentRoom, setCurrentRoom] = useState<string>("1");
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const setConnectedState = (connected: boolean) => {
    setConnected(connected);
    const conversationElement = document.getElementById("conversation");
    if (conversationElement) {
      conversationElement.style.display = connected ? "block" : "none";
    }
    if (!connected) {
      setMessages([]); // Clear messages when disconnected
    }
  };

  const connect = () => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
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

  useEffect(() => {
    if (stompClient && connected) {
      console.log(stompClient);
      console.log("Attempting to subscribe...");
      subscribeToRoom(currentRoom);
      loadChatHistory(currentRoom);
    }
  }, [stompClient, connected, currentRoom]);

  const disconnect = () => {
    if (stompClient) {
      stompClient.deactivate();
      setConnectedState(false);
      console.log("Disconnected");
    }
  };

  const subscribeToRoom = (roomId: string) => {
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
      subscription.unsubscribe();
    }

    console.log("Attempting to subscribe to roomId = " + roomId);
    console.log("currentRoom = " + currentRoom);

    try {
      const newSubscription = stompClient.subscribe(`/topic/greetings/${roomId}`, (greeting: IMessage) => {
        const messageContent = JSON.parse(greeting.body).content;
        console.log(`Received message: ${messageContent}`);
        showGreeting(roomId, messageContent);
      });

      setSubscription(newSubscription);
      console.log("Successfully subscribed to room " + roomId);
    } catch (error) {
      console.error("Failed to subscribe: ", error);
    }
  };

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      const chatMessage = {
        roomId: Number(currentRoom),
        content: content,
        writerId: 123,
        createdDate: new Date().toISOString()
      };

      console.log("chat message = " + JSON.stringify(chatMessage));

      stompClient.publish({
        destination: "/app/hello",
        body: JSON.stringify(chatMessage),
      });

      setContent('');
    } else {
      console.error('STOMP client is not connected. Cannot send message.');
    }
  };

  const showGreeting = (room: string, message: string) => {
    setMessages(prevMessages => [...prevMessages, { room, message }]);
  };

  const loadChatHistory = (roomId: string) => {
    axios.get(`http://localhost:8080/find/chat/list/${roomId}`)
      .then(response => {
        setMessages(response.data.map((msg: any) => ({
          room: roomId,
          message: msg.content
        })));
      })
      .catch(error => {
        console.error("Failed to load chat history:", error);
      });
  };

  return (
    <div className="container" id="main-content">
      <div className="row">
        <div className="col-md-6">
          <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>WebSocket connection:</label>
              <button
                type="button"
                className="btn btn-default"
                onClick={connect}
                disabled={connected}
              >
                Connect
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={disconnect}
                disabled={!connected}
              >
                Disconnect
              </button>
            </div>
            <div className="form-group">
              <label>Select Room:</label>
              <select
                className="form-control"
                value={currentRoom}
                onChange={(e) => {
                  const newRoom = e.target.value;
                  setCurrentRoom(newRoom);
                  if (connected && stompClient) {
                    subscribeToRoom(newRoom);
                    loadChatHistory(newRoom);
                  }
                }}
              >
                <option value="1">Room 1</option>
                <option value="2">Room 2</option>
                <option value="3">Room 3</option>
              </select>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Chatting</label>
              <input
                type="text"
                className="form-control"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your message"
              />
            </div>
            <button
              type="button"
              className="btn btn-default"
              onClick={sendMessage}
              disabled={!connected}
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <h3>Messages</h3>
          <table className="table table-striped" id="conversation" style={{ display: 'none' }}>
            <thead>
              <tr>
                <th>Room</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody id="greetings">
              {messages.map((msg, index) => (
                <tr key={index}>
                  <td>Room {msg.room}</td>
                  <td>{msg.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;