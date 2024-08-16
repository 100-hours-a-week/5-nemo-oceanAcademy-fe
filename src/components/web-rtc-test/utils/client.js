import * as mediasoup from 'mediasoup-client';
import * as socketClient from 'socket.io-client';
import { promise as socketPromise } from '../utils/promise';

const serverUrl = "https://192.168.36.125:3000";

let device;
let socket;
let producer;

export const connectToServer = async (roomId, setConnectionStatus, setIsPublishingDisabled, setIsSubscriptionDisabled) => {
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
            setIsPublishingDisabled(true);
            setIsSubscriptionDisabled(true);
        });

        socket.on('connect_error', (error) => {
            console.error(`Could not connect to ${serverUrl}${opts.path}: ${error.message}`);
            setConnectionStatus('Connection failed');
        });

        socket.on('newProducer', () => {
            setIsSubscriptionDisabled(false);
        });
    } catch (error) {
        console.error('Error connecting to server:', error);
        setConnectionStatus('Connection failed');
    }
};


// if (typeof navigator.mediaDevices.getDisplayMedia === 'undefined') {
//     $txtScreen.innerHTML = 'Not supported';
//     $btnScreen.disabled = true;
// }



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



/*
3. publish(e)
기능: 비디오 스트림을 게시합니다.
*/
export const publishStream = async (
    isWebcam, 
    roomId, 
    useSimulcast, 
    setPublishStatus, 
    setPublishingDisabled, 
    setSubscriptionDisabled
) => {
    try {
        const data = await socket.request('createProducerTransport', {
            roomId, // 방 ID 전달
            forceTcp: false,
            rtpCapabilities: device.rtpCapabilities,
        });

        if (data.error) {
            console.error(data.error);
            setPublishStatus('failed');
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
                    setPublishStatus('publishing...');
                    setPublishingDisabled(true);
                    setSubscriptionDisabled(true);
                    break;

                case 'connected':
                    document.querySelector('#local_video').srcObject = stream;
                    setPublishStatus('published');
                    setPublishingDisabled(true);
                    setSubscriptionDisabled(false);
                    break;

                case 'failed':
                    transport.close();
                    setPublishStatus('failed');
                    setPublishingDisabled(false);
                    setSubscriptionDisabled(true);
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
            setPublishStatus('failed');
            console.error('Error during stream publication:', err);
        }
    } catch (error) {
        setPublishStatus('failed');
        console.error('Error during publish stream setup:', error);
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

export const subscribeToStream = async (
    roomId, 
    setSubscriptionStatus, 
    setSubscriptionDisabled
) => {
    try {
        const data = await socket.request('createConsumerTransport', {
            roomId, // 방 ID 전달
            forceTcp: false,
        });

        if (data.error) {
            console.error(data.error);
            setSubscriptionStatus('failed');
            return;
        }

        const transport = device.createRecvTransport(data);

        transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            socket.request('connectConsumerTransport', {
                roomId, // 방 ID 전달
                transportId: transport.id,
                dtlsParameters,
            })
            .then(callback)
            .catch(errback);
        });

        transport.on('connectionstatechange', async (state) => {
            switch (state) {
                case 'connecting':
                    setSubscriptionStatus('subscribing...');
                    setSubscriptionDisabled(true);
                    break;

                case 'connected':
                    const stream = await consume(transport, roomId);
                    document.querySelector('#remote_video').srcObject = stream;
                    await socket.request('resume', { roomId }); // 방 ID 전달
                    setSubscriptionStatus('subscribed');
                    setSubscriptionDisabled(true);
                    break;

                case 'failed':
                    transport.close();
                    setSubscriptionStatus('failed');
                    setSubscriptionDisabled(false);
                    break;

                default:
                    break;
            }
        });

        const stream = await consume(transport, roomId);
    } catch (error) {
        console.error('Error during subscription setup:', error);
        setSubscriptionStatus('failed');
    }
};

/*
6. consume(transport)
기능: 서버에서 전송된 스트림을 소비합니다.
*/
export const consume = async (transport, roomId) => {
    console.log(transport);
    console.log(roomId);
    const { rtpCapabilities } = device;
    const data = await socket.request('consume', { roomId, rtpCapabilities }); // 방 ID 전달

    if (!data) {
        throw new Error('No data received from consume request');
    }

    const {
        producerId,
        id,
        kind,
        rtpParameters,
    } = data;

    let codecOptions = {};
    const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions,
    });
    const stream = new MediaStream();
    stream.addTrack(consumer.track);
    return stream;
};

