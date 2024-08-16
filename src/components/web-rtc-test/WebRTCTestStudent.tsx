import React, { useState } from 'react';
import { connectToServerAsStudent, subscribeToStreamAsStudent} from './utils/student/studentClient';


const WebRTCTestStudent: React.FC = () => {

    const [roomId, setRoomId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('');
    const [subStatus, setSubStatus] = useState('');
    const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState(true);

    const handleConnect = async () => {
        await connectToServerAsStudent(roomId, setConnectionStatus, setIsSubscriptionDisabled);
    };

    const handleSubscribe = async () => {
        await subscribeToStreamAsStudent(roomId, setSubStatus, setIsSubscriptionDisabled);
    };

    const joinLiveLecture = async () => {
        await handleConnect();
        await handleSubscribe();
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
            <button onClick={joinLiveLecture}>강의 참여하기</button>
        </div>
        <span>{connectionStatus}</span>
        <div>
        <span>{subStatus}</span>
        </div>
        </fieldset>
        <div>
        <video id="remote_video" controls autoPlay playsInline></video>
        </div>
    </div>
    );
}

export default WebRTCTestStudent;