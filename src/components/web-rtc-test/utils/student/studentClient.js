import * as mediasoup from 'mediasoup-client';
import * as socketClient from 'socket.io-client';
import { promise as socketPromise } from '../../utils/promise';
import { getServerUrl } from '../../secret';

let socket;
let device;

const Producers = {
    WEBCAM_VIDEO: 'webcamVideo',
    WEBCAM_AUDIO: 'webcamAudio',
    SCREEN_SHARE_VIDEO: 'screenShareVideo',
    SCREEN_SHARE_AUDIO: 'screenShareAudio'
}

// studentClient.js
export const connectToServerAsStudent = async (
    roomId, 
    setConnectionStatus, 
    setIsSubscriptionDisabled,
    webcamVideoRef,
    screenShareVideoRef
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
            setIsSubscriptionDisabled(false);

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
            setIsSubscriptionDisabled(true);
        });

        socket.on('connect_error', (error) => {
            console.error(`Could not connect to ${getServerUrl()}${opts.path}: ${error.message}`);
            setConnectionStatus('Connection failed');
        });

        const transport = await createConsumerTransport(roomId);

        // [ ] Producer 4개 (있는 것만) 받는 로직
        socket.on('getProducers', ()=>{
            
        });

        socket.on('newProducer', async ({ roomId, producerKind }) => {
            console.log('Received Room ID:', roomId); // 로그 추가
            console.log('Received Producer Kind:', producerKind); // 로그 추가
        
            const consumer = await createConsumer(transport, roomId, producerKind);
            
            if (consumer && consumer.track.kind === 'video') {
                const stream = new MediaStream([consumer.track]);

                if (producerKind === 'webcamVideo' && webcamVideoRef.current) {
                    webcamVideoRef.current.srcObject = stream;
                } else if (producerKind === 'screenShareVideo' && screenShareVideoRef.current) {
                    screenShareVideoRef.current.srcObject = stream;
                }
            } else if (consumer && consumer.track.kind === 'audio') {
                const stream = new MediaStream([consumer.track]);

                if (producerKind === 'webcamAudio') {
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = stream;
                    audioElement.play();
                } else if (producerKind === 'screenShareAudio') {
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = stream;
                    audioElement.play();
                }
            }
        });
    } catch (error) {
        console.error('Error connecting to server:', error);
        setConnectionStatus('Connection failed');
    }
};

/*
2. loadDevice(routerRtpCapabilities)
기능: mediasoup.Device를 로드하여 비디오 및 오디오 스트림을 전송할 수 있도록 설정합니다.
*/
export const loadDevice = async (routerRtpCapabilities) => {
    try {
        console.log('Attempting to create mediasoup.Device...');
        device = new mediasoup.Device();
        console.log('Device created:', device);
    } catch (error) {
        console.error('Failed to create Device:', error);
        return;
    }

    try {
        await device.load({ routerRtpCapabilities });
        console.log('Device loaded successfully');
    } catch (loadError) {
        console.error('Error loading device:', loadError);
    }
};

/*
3. createConsumerTransport
기능: 클라이언트가 서버에서 ConsumerTransport를 생성하도록 요청합니다.
*/
const createConsumerTransport = async (roomId) => {
    const data = await socket.request('createConsumerTransport', {
        roomId, // 방 ID 전달
        forceTcp: false,
    });

    if (data.error) {
        throw new Error('Failed to create transport');
    }

    const transport = device.createRecvTransport(data);

    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
        socket.request('connectConsumerTransport', {
            roomId,
            transportId: transport.id,
            dtlsParameters,
        })
        .then(callback)
        .catch(errback);
    });

    return transport;
};

/*
4. createConsumer
기능: 서버에서 제공하는 특정 Producer의 스트림을 구독(consume)합니다.
*/
const createConsumer = async (transport, roomId, producerKind) => {
    try {
        const { rtpCapabilities } = device;
        // [ ] consume 하는데, roomId랑 producerKind를 전달해야함
        const data = await socket.request('consume', {
            roomId,
            producerKind,
            rtpCapabilities
        });

        if (!data) {
            throw new Error('No data received from consume request');
        }

        const {
            id,
            kind,
            rtpParameters,
            producerId: returnedProducerId,
        } = data;

        if (!id || !kind || !rtpParameters) {
            throw new Error('Invalid data received from consume request');
        }

        const consumer = await transport.consume({
            id,
            producerId: returnedProducerId,
            kind,
            rtpParameters
        });

        return consumer;
    } catch (error) {
        console.error('Error creating consumer:', error);
        return null;
    }
};

