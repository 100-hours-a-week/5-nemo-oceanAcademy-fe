import * as mediasoup from 'mediasoup-client';
import * as socketClient from 'socket.io-client';
import { promise as socketPromise } from '../../utils/promise';

const serverUrl = "https://52.79.217.180:3000";

let device;
let socket;
let producer;

/** 
* 웹 캠 스트리밍 코드
*/
export const startWebcamStream = async (roomId, useSimulcast, setStreamStatus) => {
    return await createProducer(roomId, useSimulcast, true, setStreamStatus);
};

export const stopWebcamStream = (webCamProducer, setStreamStatus) => {
    if (webCamProducer) {
        webCamProducer.close();
        setStreamStatus('Webcam Stopped');
    }
};

/**
* 화면 공유 스트리밍 코드
*/
export const startScreenShareStream = async (roomId, useSimulcast, setStreamStatus) => {
    return await createProducer(roomId, useSimulcast, false, setStreamStatus);
};

export const stopScreenShareStream = (screenProducer, setStreamStatus) => {
    if (screenProducer) {
        screenProducer.close();
        setStreamStatus('Screen Sharing Stopped');
    }
};

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
    
            socket = socketClient(serverUrl, opts);
            socket.request = socketPromise(socket);
    
            socket.on('connect', async () => {
                setConnectionStatus('Connected');
                setIsPublishingDisabled(false);
    
                if (!roomId) {
                    alert('Please enter a room ID.');
                    return;
                }
                socket.emit('joinRoom', roomId);
    
                setConnectionStatus(`Connected to room ${roomId}`);
    
                const data = await socket.request('getRouterRtpCapabilities');
                await loadDevice(data);
            });
    
            socket.on('disconnect', () => {
                setConnectionStatus('Disconnected');
                setIsPublishingDisabled(true);
            });
    
            socket.on('connect_error', (error) => {
                console.error(`Could not connect to ${serverUrl}${opts.path}: ${error.message}`);
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

export const publishStreamAsTeacher = async (
    roomId, 
    useSimulcast, 
    setStreamStatus
) => {
    try {
        setStreamStatus('Publishing...');

        // 웹캠 스트림과 화면 공유 스트림을 위한 두 개의 프로듀서 생성
        const webcamProducer = await createProducer(roomId, useSimulcast, true, setStreamStatus);
        const screenShareProducer = await createProducer(roomId, useSimulcast, false, setStreamStatus);

        if (webcamProducer && screenShareProducer) {
            setStreamStatus('Both Webcam and Screen Sharing Started');
        } else if (webcamProducer) {
            setStreamStatus('Webcam Started, Screen Sharing failed');
        } else if (screenShareProducer) {
            setStreamStatus('Screen Sharing Started, Webcam failed');
        } else {
            setStreamStatus('Failed to start streams');
        }

    } catch (error) {
        console.error('Error starting streams:', error);
        setStreamStatus('Failed to start streams');
    }
};


export const __publishStreamAsTeacher = async (
    isWebcam, 
    roomId, 
    useSimulcast, 
    setStreamStatus
) => {
try {
    setStreamStatus('Publishing...');
    
    const data = await socket.request('createProducerTransport', {
        roomId, // 방 ID 전달
        forceTcp: false,
        rtpCapabilities: device.rtpCapabilities,
    });

    if (data.error) {
        console.error(data.error);
        setStreamStatus('failed');
        return;
    }

    const transport = device.createSendTransport(data);

    transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
        try {
            await socket.request('connectProducerTransport', { roomId, dtlsParameters });
            callback();
        } catch (error) {
            errback(error);
        }
    });

    transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
        try {
            const { id } = await socket.request('produce', {
                roomId, // 방 ID 전달
                transportId: transport.id,
                kind,
                rtpParameters,
            });
            callback({ id });
        } catch (error) {
            errback(error);
        }
    });

    transport.on('connectionstatechange', (state) => {
        switch (state) {
            case 'connecting':
                setStreamStatus('publishing...');
                break;

            case 'connected':
                document.querySelector('#local_video').srcObject = stream;
                setStreamStatus('published');
                break;

            case 'failed':
                transport.close();
                setStreamStatus('failed');
                break;

            default:
                break;
        }
    });

    let stream;
    try {
        stream = await getUserMedia(transport, isWebcam);
        const track = stream.getVideoTracks()[0];
        const params = { track };

        if (useSimulcast) {
            params.encodings = [
                { maxBitrate: 100000 },
                { maxBitrate: 300000 },
                { maxBitrate: 900000 },
            ];
            params.codecOptions = {
                videoGoogleStartBitrate: 1000,
            };
        }

        producer = await transport.produce(params);
    } catch (err) {
        setStreamStatus('failed');
        console.error('Error during stream publication:', err);
    }

    if (isWebcam) {
        // 웹캠 스트림 시작
        setStreamStatus('Webcam Started');
    } else {
        // 화면 공유 스트림 시작
        setStreamStatus('Screen Sharing Started');
    }
    } catch (error) {
    console.error('Error starting stream:', error);
    setStreamStatus('Failed to start stream');
}
};




const createProducer = async (roomId, useSimulcast, isWebcam, setStreamStatus) => {
    try {
        const data = await socket.request('createProducerTransport', {
            roomId,
            forceTcp: false,
            rtpCapabilities: device.rtpCapabilities,
        });

        if (data.error) {
            console.error(data.error);
            setStreamStatus('failed');
            return null;
        }

        const transport = device.createSendTransport(data);

        transport.on('connect', async ({ dtlsParameters }, callback, errback) => {
            try {
                await socket.request('connectProducerTransport', { roomId, dtlsParameters });
                callback();
            } catch (error) {
                errback(error);
            }
        });

        transport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
            try {
                const { id } = await socket.request('produce', {
                    roomId,
                    transportId: transport.id,
                    kind,
                    rtpParameters,
                });
                callback({ id });
            } catch (error) {
                errback(error);
            }
        });

        transport.on('connectionstatechange', (state) => {
            switch (state) {
                case 'connecting':
                    setStreamStatus('publishing...');
                    break;

                case 'connected':
                    if (isWebcam) {
                        document.querySelector('#local_video').srcObject = stream;
                    }
                    setStreamStatus('published');
                    break;

                case 'failed':
                    transport.close();
                    setStreamStatus('failed');
                    break;

                default:
                    break;
            }
        });

        let stream;
        try {
            stream = await getUserMedia(transport, isWebcam);
            const track = stream.getVideoTracks()[0];
            const params = { track };

            if (useSimulcast) {
                params.encodings = [
                    { maxBitrate: 100000 },
                    { maxBitrate: 300000 },
                    { maxBitrate: 900000 },
                ];
                params.codecOptions = {
                    videoGoogleStartBitrate: 1000,
                };
            }

            return await transport.produce(params);
        } catch (err) {
            setStreamStatus('failed');
            console.error('Error during stream publication:', err);
            return null;
        }

    } catch (error) {
        console.error('Error starting stream:', error);
        setStreamStatus('Failed to start stream');
        return null;
    }
};


/*
4. getUserMedia(transport, isWebcam)
기능: 사용자의 웹캠 또는 화면에서 비디오 스트림을 가져옵니다.
*/
export const getUserMedia = async (transport, isWebcam) => {
    if (!device.canProduce('video')) {
        console.error('cannot produce video');
        return;
    }

    let stream;
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