import React, { useState, useRef } from 'react';
import { connectToServerAsStudent } from './utils/student/studentClient';

const WebRTCTestStudent: React.FC = () => {

    const [roomId, setRoomId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('');
    const [subStatus, setSubStatus] = useState('');
    const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState(true);

    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const screenShareVideoRef = useRef<HTMLVideoElement>(null);

    const handleConnect = async () => {
        await connectToServerAsStudent(
            roomId, 
            setConnectionStatus, 
            setIsSubscriptionDisabled, 
            webcamVideoRef, 
            screenShareVideoRef
        );
    };

    const joinLiveLecture = async () => {
        await handleConnect();
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />
            <fieldset id="그냥 이뻐서 넣음">
                <div>
                    <button onClick={joinLiveLecture} disabled={!roomId}>강의 참여하기</button>
                </div>
                <span>{connectionStatus}</span>
                <div>
                    <span>{subStatus}</span>
                </div>
            </fieldset>
            <div>
                <video 
                    ref={webcamVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    style={{ width: '400px', height: 'auto', maxWidth: '100%' }} 
                ></video>
                <video 
                    ref={screenShareVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    style={{ width: '400px', height: 'auto', maxWidth: '100%' }} 
                ></video>
            </div>
        </div>
    );
}

export default WebRTCTestStudent;
