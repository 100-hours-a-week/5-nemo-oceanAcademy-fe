import React, { useState, useEffect, useRef } from 'react';
import {connectToServerAsTeacher, publishStreamAsTeacher, startWebcamStream, startScreenShareStream, stopScreenShareStream, stopWebcamStream} from './utils/teacher/teacherClient';

const WebRTCTestTeacher: React.FC = () => {

    const [roomId, setRoomId] = useState('');
    const [connectionStatus, setConnectionStatus] = useState('');
    const [webcamStatus, setWebcamStatus] = useState('');
    const [screenStatus, setScreenStatus] = useState('');
    const [isPublishingDisabled, setIsPublishingDisabled] = useState(true);
    const [useSimulcast, setUseSimulcast] = useState(false);
    const [isScreenShareSupported, setIsScreenShareSupported] = useState(true);

    const [webcamProducer, setWebcamProducer] = useState(null);
    const [screenShareProducer, setScreenShareProducer] = useState(null);
    const [streamStatus, setStreamStatus] = useState('');

    // Ref to store video elements
    const webcamVideoRef = useRef(null);
    const screenShareVideoRef = useRef(null);


    const handleStartWebcam = async () => {
        if (!webcamProducer) {
            const producer = await startWebcamStream(roomId, useSimulcast, setStreamStatus);
            setWebcamProducer(producer);
        }
    };

    const handleStopWebcam = () => {
        if (webcamProducer) {
            stopWebcamStream(webcamProducer, setStreamStatus);
            setWebcamProducer(null);
        }
    };

    const handleStartScreenShare = async () => {
        if (!screenShareProducer) {
            const producer = await startScreenShareStream(roomId, useSimulcast, setStreamStatus);
            setScreenShareProducer(producer);
        }
    };

    const handleStopScreenShare = () => {
        if (screenShareProducer) {
            stopScreenShareStream(screenShareProducer, setStreamStatus);
            setScreenShareProducer(null);
        }
    };

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
                <button onClick={handleStartWebcam} disabled={!!webcamProducer}>Start Webcam</button>
                <button onClick={handleStopWebcam} disabled={!webcamProducer}>Stop Webcam</button>
                <span>{webcamStatus}</span>
            </div>
            <div>
                <button onClick={handleStartScreenShare} disabled={!!screenShareProducer}>Start Screen Share</button>
                <button onClick={handleStopScreenShare} disabled={!screenShareProducer}>Stop Screen Share</button>
                <span>{screenStatus}</span>
            </div>
        </fieldset>
        <div>
            <video id="local_video" controls autoPlay playsInline></video>
        </div>
        </div>
    );
}

export default WebRTCTestTeacher;
