import * as mediasoup from 'mediasoup-client';
import * as socketClient from 'socket.io-client';
import { promise as socketPromise } from '../../utils/promise';
import { getServerUrl } from '../../secret';

let device;
let socket;
let producer;

const Producers = {
    WEBCAM_VIDEO: 'webcamVideo',
    WEBCAM_AUDIO: 'webcamAudio',
    SCREEN_SHARE_VIDEO: 'screenShareVideo',
    SCREEN_SHARE_AUDIO: 'screenShareAudio'
}


/**
 * 
 * @param {*} roomId 방 번호
 * @param {*} setConnectionStatus 연결 상태 (화면 출력용)
 * @param {*} setIsPublishingDisabled 
 */
export const connectToServerAsTeacher = async (
    roomId, 
    setConnectionStatus, 
    setIsPublishingDisabled
    ) => {
        try {
            setConnectionStatus('Connecting...');
    
            const opts = {
                path: '/server',
                transports: ['websocket'],
            };
    
            socket = socketClient(getServerUrl(), opts);
            socket.request = socketPromise(socket);
    
            socket.on('connect', async () => {
                setConnectionStatus('Connected');
                setIsPublishingDisabled(false);
    
                if (!roomId) {
                    alert('Please enter a room ID.');
                    return;
                }

                socket.emit('startRoom', roomId);
    
                setConnectionStatus(`Connected to room ${roomId}`);
    
                const data = await socket.request('getRouterRtpCapabilities');
                await loadDevice(data);
            });
    
            socket.on('disconnect', () => {
                setConnectionStatus('Disconnected');
                setIsPublishingDisabled(true);
            });
    
            socket.on('connect_error', (error) => {
                console.error(`Could not connect to ${getServerUrl()}${opts.path}: ${error.message}`);
                console.error('Error details:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    code: error.code,
                    type: error.type,
                });
                console.error(error);
                setConnectionStatus('Connection failed');
            });

            socket.on('newProducer', (producer) => {
                console.log('New producer:', producer);
            });
        } catch (error) {
            console.error('Error connecting to server:', error);
            setConnectionStatus('Connection failed');
        }
    };

/*
4. getUserMedia(transport, isWebcam)
기능: 사용자의 웹캠 또는 화면에서 비디오 스트림을 가져옵니다.
*/
const getUserMedia = async (isWebcam) => {
    if (!device.canProduce('video')) {
        console.error('cannot produce video');
        return;
    }

    let stream;
    console.log(isWebcam);
    try {
        stream = isWebcam ?
        await navigator.mediaDevices.getUserMedia({ video: true }) :
        await navigator.mediaDevices.getDisplayMedia({ video: true });
    } catch (err) {
        console.error('getUserMedia() failed:', err.message);
        throw err;
    }
    return stream;
}

/*
2. loadDevice(routerRtpCapabilities)
기능: mediasoup.Device를 로드하여 비디오 및 오디오 스트림을 전송할 수 있도록 설정합니다.
*/
export const loadDevice = async (routerRtpCapabilities) => {
    try {
        console.log('Attempting to create mediasoup.Device...');
        device = new mediasoup.Device();
        console.log('Device created:', device);  // device 객체 출력
    } catch (error) {
        console.error('Failed to create Device:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);  // 에러가 발생한 스택 트레이스 출력

        if (error.name === 'UnsupportedError') {
            console.error('Browser not supported for mediasoup.');
        } else {
            console.error('Unexpected error during Device creation:', error);
        }
        return;  // 생성 실패 시 함수 종료
    }

    if (!device) {
        console.error('Device is undefined after creation attempt.');
        return;
    }

    try {
        await device.load({ routerRtpCapabilities });
        console.log('Device loaded successfully');
    } catch (loadError) {
        console.error('Error loading device:', loadError);
    }
};


const createProducer = async (roomId, producerKind, useSimulcast, isWebcam, isVideo, setStreamStatus, videoRef) => {
    try {
        const data = await socket.request('createProducerTransport', {
            roomId,
            producerKind,
            forceTcp: false,
            rtpCapabilities: device.rtpCapabilities,
        });

        if (data.error) {
            console.error(data.error);
            setStreamStatus('Failed to create transport');
            return null;
        }

        const transport = device.createSendTransport(data);

        transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                await socket.request('connectProducerTransport', { roomId, producerKind, dtlsParameters });
                callback();
            } catch (error) {
                errback(error);
            }
        });

        transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
            try {

                const producerKind = isWebcam 
                ? (isVideo ? Producers.WEBCAM_VIDEO : Producers.WEBCAM_AUDIO) 
                : (isVideo ? Producers.SCREEN_SHARE_VIDEO : Producers.SCREEN_SHARE_AUDIO);

                const { id } = await socket.request('produce', {
                    roomId,
                    transportId: transport.id,
                    kind,
                    rtpParameters,
                    producerKind
                });
                
                console.log('Producer ID:', id); // 로그 추가
                console.log('Producer Kind:', producerKind); // 로그 추가

                // socket.emit('newProducer', { roomId, producerId: id, producerKind });
                callback({ id });
            } catch (error) {
                errback(error);
            }
        });

        transport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    setStreamStatus('Publishing...');
                    break;
                case 'connected':
                    if (isVideo && videoRef) {
                        videoRef.srcObject = stream;
                    }
                    setStreamStatus('Published');
                    break;
                case 'failed':
                    transport.close();
                    setStreamStatus('Failed');
                    break;
                default:
                    break;
            }
        });

        let stream;
        try {
            stream = isVideo 
            if (isVideo) {
                stream = isWebcam 
                    ? await navigator.mediaDevices.getUserMedia({ video: true }) 
                    : await navigator.mediaDevices.getDisplayMedia({ video: true });
            } else {
                stream = isWebcam
                    ? await navigator.mediaDevices.getUserMedia({ audio: true })
                    : await getSystemAudioStream();
            }
                
                
                
            const track = isVideo ? stream.getVideoTracks()[0] : stream.getAudioTracks()[0];
            const params = { track };

            if (useSimulcast && isVideo) {
                params.encodings = [
                    { maxBitrate: 100000 },
                    { maxBitrate: 300000 },
                    { maxBitrate: 900000 },
                ];
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000,
                };
            }

            const producer = await transport.produce(params);
            return producer;
        } catch (err) {
            setStreamStatus('Failed to get user media');
            console.error('Error during stream publication:', err);
            return null;
        }
    } catch (error) {
        console.error('Error starting stream:', error);
        setStreamStatus('Failed to start stream');
        return null;
    }
};

const getSystemAudioStream = async () => {
    try {
        const systemAudioStream = await navigator.mediaDevices.getDisplayMedia({ audio: true });
        return systemAudioStream;
    } catch (err) {
        console.error('Error capturing system audio:', err.message);
        throw err;
    }
};


export const stopScreenShareStream = (producer, setStreamStatus) => {
    if (producer) {
        producer.close();
        setStreamStatus('Screen sharing stopped');
    }
};

export const startScreenShareStream = async (roomId, useSimulcast, setStreamStatus, videoRef) => {
    try {
        console.log(videoRef.current);
        const producer = await createProducer(roomId, Producers.SCREEN_SHARE_VIDEO, useSimulcast, false, true, setStreamStatus, videoRef);
        return producer;
    } catch (error) {
        console.error('Error starting screen share stream:', error);
        setStreamStatus('Failed to start screen share');
        return null;
    }
};

export const stopWebcamStream = (producer, setStreamStatus) => {
    if (producer) {
        producer.close();
        setStreamStatus('Webcam stopped');
    }
};

export const startWebcamStream = async (roomId, useSimulcast, setStreamStatus, videoRef) => {
    try {
        const producer = await createProducer(roomId, Producers.WEBCAM_VIDEO,useSimulcast, true, true, setStreamStatus, videoRef);
        return producer;
    } catch (error) {
        console.error('Error starting webcam stream:', error);
        setStreamStatus('Failed to start webcam');
        return null;
    }
};

export const startMicrophoneStream = async (roomId, setStreamStatus) => {
    try {
        const producer = await createProducer(roomId, Producers.WEBCAM_AUDIO, false, true, false, setStreamStatus);
        return producer;
    } catch (error) {
        console.error('Error starting microphone stream:', error);
        setStreamStatus('Failed to start microphone stream');
        return null;
    }
};

export const stopMicrophoneStream = (producer, setStreamStatus) => {
    if (producer) {
        producer.close();
        setStreamStatus('Microphone stream stopped');
    }
};

export const startSystemAudioStream = async (roomId, setStreamStatus) => {
    try {
        const producer = await createProducer(roomId, Producers.SCREEN_SHARE_AUDIO, false, false, false, setStreamStatus);
        return producer;
    } catch (error) {
        console.error('Error starting system audio stream:', error);
        setStreamStatus('Failed to start system audio stream');
        return null;
    }
};

export const stopSystemAudioStream = (producer, setStreamStatus) => {
    if (producer) {
        producer.close();
        setStreamStatus('System audio stream stopped');
    }
};
