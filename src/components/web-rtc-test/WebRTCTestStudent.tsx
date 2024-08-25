import React, { useState, useRef, useEffect } from 'react';
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

    useEffect(() => {
        const handleWebcamLoadedMetadata = () => {
            console.log('Webcam video metadata loaded');
        };

        const handleWebcamCanPlay = () => {
            console.log('Webcam video can play');
        };

        const handleWebcamPlaying = () => {
            console.log('Webcam video is playing');
        };

        const handleScreenShareLoadedMetadata = () => {
            console.log('Screen share video metadata loaded');
        };

        const handleScreenShareCanPlay = () => {
            console.log('Screen share video can play');
        };

        const handleScreenSharePlaying = () => {
            console.log('Screen share video is playing');
        };

        if (webcamVideoRef.current) {
            const webcamVideo = webcamVideoRef.current;
            webcamVideo.addEventListener('loadedmetadata', handleWebcamLoadedMetadata);
            webcamVideo.addEventListener('canplay', handleWebcamCanPlay);
            webcamVideo.addEventListener('playing', handleWebcamPlaying);
        }

        if (screenShareVideoRef.current) {
            const screenShareVideo = screenShareVideoRef.current;
            screenShareVideo.addEventListener('loadedmetadata', handleScreenShareLoadedMetadata);
            screenShareVideo.addEventListener('canplay', handleScreenShareCanPlay);
            screenShareVideo.addEventListener('playing', handleScreenSharePlaying);
        }

        return () => {
            if (webcamVideoRef.current) {
                const webcamVideo = webcamVideoRef.current;
                webcamVideo.removeEventListener('loadedmetadata', handleWebcamLoadedMetadata);
                webcamVideo.removeEventListener('canplay', handleWebcamCanPlay);
                webcamVideo.removeEventListener('playing', handleWebcamPlaying);
            }

            if (screenShareVideoRef.current) {
                const screenShareVideo = screenShareVideoRef.current;
                screenShareVideo.removeEventListener('loadedmetadata', handleScreenShareLoadedMetadata);
                screenShareVideo.removeEventListener('canplay', handleScreenShareCanPlay);
                screenShareVideo.removeEventListener('playing', handleScreenSharePlaying);
            }
        };
    }, []);
    

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
                    style={{ border: '1px solid black', width: '400px', height: 'auto', maxWidth: '100%' }} 
                ></video>
                <video 
                    ref={screenShareVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    style={{ border: '1px solid black', width: '400px', height: 'auto', maxWidth: '100%' }} 
                ></video>
            </div>
        </div>
    );
}

export default WebRTCTestStudent;
