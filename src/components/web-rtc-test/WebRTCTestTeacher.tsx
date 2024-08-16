import React, { useState, useEffect } from 'react';
import {connectToServerAsTeacher, publishStreamAsTeacher} from './utils/teacher/teacherClient';

const Teacher: React.FC = () => {

    const [roomId, setRoomId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('');
    const [webcamStatus, setWebcamStatus] = useState('');
    const [screenStatus, setScreenStatus] = useState('');
    const [isPublishingDisabled, setIsPublishingDisabled] = useState(true);
    const [useSimulcast, setUseSimulcast] = useState(false);
    const [isScreenShareSupported, setIsScreenShareSupported] = useState(true);

    useEffect(() => {
        if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
        setScreenStatus('Not supported');
        setIsScreenShareSupported(false);
        }
    }, []);

    const handleConnect = async () => {
        await connectToServerAsTeacher(roomId, setConnectionStatus, setIsPublishingDisabled);
    };

    const handleWebcam = async () => {
        await publishStreamAsTeacher(true, roomId, useSimulcast, setWebcamStatus);
    };

    const handleScreenShare = async () => {
        await publishStreamAsTeacher(false, roomId, useSimulcast, setScreenStatus);
    };

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
        <fieldset id="fs_publish" disabled={isPublishingDisabled}>
            <legend>Publishing</legend>
            <div>
            <label>
                <input
                type="checkbox"
                checked={useSimulcast}
                onChange={(e) => setUseSimulcast(e.target.checked)}
                />
                Use Simulcast
            </label>
            </div>
            <div>
            <button onClick={handleWebcam}>Start Webcam</button> 
            <span>{webcamStatus}</span>
            </div>
            <div>
            <button onClick={handleScreenShare} disabled={!isScreenShareSupported}>Share Screen</button> 
            <span>{screenStatus}</span>
            </div>
        </fieldset>
        <div>
            <video id="local_video" controls autoPlay playsInline></video>
        </div>
        </div>
    );
}

export default Teacher;
