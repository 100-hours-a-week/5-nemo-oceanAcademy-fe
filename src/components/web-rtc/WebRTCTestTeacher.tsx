import React, { useState, useEffect, useRef } from 'react';
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
} from './utils/teacher/teacherClient';
// 기능 구현 확인하고 리팩토링 예정, streamUtil.js 
// import { startStream, stopStream } from './utils/streamUtils';

const WebRTCTestTeacher: React.FC = () => {
    const [roomId, setRoomId] = useState('');
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

    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const screenShareVideoRef = useRef<HTMLVideoElement>(null);

    const handleConnect = async () => {
        await connectToServerAsTeacher(roomId, setConnectionStatus, setIsPublishingDisabled);
    };

    useEffect(() => {
        if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
            setScreenStatus('Not supported');
            setIsScreenShareSupported(false);
        }
    }, []);

    const handleStartWebcam = async () => {
        if (!webcamProducer) {
            const producer = await startWebcamStream(roomId, useSimulcast, setWebcamStatus, webcamVideoRef.current);
            setWebcamProducer(producer);
        }
    };

    const handleStopWebcam = () => {
        if (webcamProducer) {
            stopWebcamStream(webcamProducer, setWebcamStatus);
            setWebcamProducer(null);
        }
    };

    const handleStartScreenShare = async () => {
        if (!screenShareProducer) {
            const producer = await startScreenShareStream(roomId, useSimulcast, setScreenStatus, screenShareVideoRef.current);
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
            const producer = await startMicrophoneStream(roomId, setMicrophoneStatus);
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
            const producer = await startSystemAudioStream(roomId, setSystemAudioStatus);
            setSystemAudioProducer(producer);
        }
    };

    const handleStopSystemAudio = () => {
        if (systemAudioProducer) {
            stopSystemAudioStream(systemAudioProducer, setSystemAudioStatus);
            setSystemAudioProducer(null);
        }
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
                    <button onClick={handleStartScreenShare} disabled={!!screenShareProducer || !isScreenShareSupported}>Start Screen Share</button>
                    <button onClick={handleStopScreenShare} disabled={!screenShareProducer}>Stop Screen Share</button>
                    <span>{screenStatus}</span>
                </div>
                <div>
                    <button onClick={handleStartMicrophone} disabled={!!microphoneProducer}>Start Microphone</button>
                    <button onClick={handleStopMicrophone} disabled={!microphoneProducer}>Stop Microphone</button>
                    <span>{microphoneStatus}</span>
                </div>
                <div>
                    <button onClick={handleStartSystemAudio} disabled={!!systemAudioProducer}>Start System Audio</button>
                    <button onClick={handleStopSystemAudio} disabled={!systemAudioProducer}>Stop System Audio</button>
                    <span>{systemAudioStatus}</span>
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

export default WebRTCTestTeacher;
