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
        <fieldset id="fs_connection">
        <legend>Connection</legend>
        <div>
            <button onClick={handleConnect}>Connect</button> 
            <span>{connectionStatus}</span>
        </div>
        </fieldset>
        <fieldset id="fs_subscribe" disabled={isSubscriptionDisabled}>
        <legend>Subscription</legend>
        <div>
            <button onClick={handleSubscribe}>Subscribe</button> 
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