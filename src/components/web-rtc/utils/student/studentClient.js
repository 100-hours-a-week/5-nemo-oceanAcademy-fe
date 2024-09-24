import * as mediasoup from 'mediasoup-client';
import * as socketClient from 'socket.io-client';
import { promise as socketPromise } from '../../utils/promise';
import { getServerUrl } from '../../serverUrl';
import { useNavigate } from 'react-router-dom';

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

            const mediaProducers = await socket.request('getProducers', roomId);
            console.log("mediaProducer 출력 : ", mediaProducers);

            // 각 프로듀서에 대해 존재 여부를 확인하고 작업 수행
            Object.values(Producers).forEach( async (producerKind) => {
                const producer = mediaProducers[producerKind];
                
                if (producer) {
                    // [x] 프로듀서가 존재하는 경우, consumer를 만들어서 재생할 수 있어야 함
                    console.log(`Producer ${producerKind} is present.`);

                    const transport = await createConsumerTransport(roomId, producerKind); 

                    transport.on('connect', ({ dtlsParameters }, callback, errback) => {
                    socket.request('connectConsumerTransport', {
                        roomId, // 방 ID 전달
                        //  [x] 서버 코드 수정 필요
                        producerKind,
                        transportId: transport.id,
                        dtlsParameters,
                    })
                        .then(callback)
                        .catch(errback);
                    });

                    // consume() 함수 내용
                    
                    const consumer = await createConsumer(transport, roomId, producerKind);

                    if (consumer && consumer.track.kind === 'video') {
                        const stream = new MediaStream([consumer.track]);

                        if (producerKind == Producers.WEBCAM_VIDEO && webcamVideoRef.current) {
                            webcamVideoRef.current.srcObject = stream;
                        } else if (producerKind == Producers.SCREEN_SHARE_VIDEO && screenShareVideoRef.current) {
                            screenShareVideoRef.current.srcObject = stream;
                        }
                    } else if (consumer && consumer.track.kind === 'audio') {
                        const stream = new MediaStream([consumer.track]);

                        if (producerKind == Producers.WEBCAM_AUDIO) {
                            const audioElement = document.createElement('audio');
                            audioElement.srcObject = stream;
                            audioElement.play();
                        } else if (producerKind == Producers.SCREEN_SHARE_AUDIO) {
                            const audioElement = document.createElement('audio');
                            audioElement.srcObject = stream;
                            audioElement.play();
                        }
                    }
                    await socket.request('resume', {roomId, producerKind, consumerId: consumer.id});
                } 
            });
        });

        //강사에 의한 강의종료시
        socket.on('teacherLeft', async () => {
            console.log('bye');
            socket.disconnect();
            if (window.confirm('강의가 종료되었습니다.')) {
                window.location.href = `/dashboard/student/${roomId}`;
            }
        });

        socket.on('disconnect', () => {
            setConnectionStatus('Disconnected');
            setIsSubscriptionDisabled(true);
        });

        socket.on('connect_error', (error) => {
            console.error(`Could not connect to ${getServerUrl()}${opts.path}: ${error.message}`);
            setConnectionStatus('Connection failed');
        });


        socket.on('newProducer', async ({ roomId, producerKind }) => {
            console.log('Received Room ID:', roomId); // 로그 추가
            console.log('Received Producer Kind:', producerKind); // 로그 추가
        
            const transport = await createConsumerTransport(roomId, producerKind); 

            transport.on('connect', ({ dtlsParameters }, callback, errback) => {
            console.log("transport connect!!!");
            socket.request('connectConsumerTransport', {
                roomId, // 방 ID 전달
                //  [x] 서버 코드 수정 필요
                producerKind,
                transportId: transport.id,
                dtlsParameters,
            })
                .then(callback)
                .catch(errback);
            });

            // consume() 함수 내용
            
            const consumer = await createConsumer(transport, roomId, producerKind);

            if (consumer && consumer.track.kind === 'video') {
                const stream = new MediaStream([consumer.track]);

                if (producerKind == Producers.WEBCAM_VIDEO && webcamVideoRef.current) {
                    webcamVideoRef.current.srcObject = stream;
                } else if (producerKind == Producers.SCREEN_SHARE_VIDEO && screenShareVideoRef.current) {
                    screenShareVideoRef.current.srcObject = stream;
                }
            } else if (consumer && consumer.track.kind === 'audio') {
                const stream = new MediaStream([consumer.track]);

                if (producerKind == Producers.WEBCAM_AUDIO) {
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = stream;
                    audioElement.play();
                } else if (producerKind == Producers.SCREEN_SHARE_AUDIO) {
                    const audioElement = document.createElement('audio');
                    audioElement.srcObject = stream;
                    audioElement.play();
                }
            }
            await socket.request('resume', {roomId, producerKind, consumerId: consumer.id});
        
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
const createConsumerTransport = async (roomId, producerKind) => {
    const data = await socket.request('createConsumerTransport', {
        roomId, // 방 ID 전달
        producerKind,
        forceTcp: false,
    });

    if (data.error) {
        throw new Error('Failed to create transport');
    }

    const transport = device.createRecvTransport(data);

    return transport;
};

/*
4. createConsumer
기능: 서버에서 제공하는 특정 Producer의 스트림을 구독(consume)합니다.
*/
const createConsumer = async (transport, roomId, producerKind) => {
    try {
        const { rtpCapabilities } = device;
        console.log(device)
        // [x] consume 하는데, roomId랑 producerKind를 전달해야함
        const data = await socket.request('consume', {
            roomId,
            producerKind,
            transportId: transport.id,
            rtpCapabilities
        });

        if (!data) {
            throw new Error('No data received from consume request');
        }
        console.log(data);

        const {
            id,
            kind,
            rtpParameters,
            producerId,
        } = data;

        if (!id || !kind || !rtpParameters) {
            throw new Error('Invalid data received from consume request');
        }

        let codecOptions = {};
        console.log(111);
        const consumer = await transport.consume({
            id,
            producerId,
            kind,
            rtpParameters,
            codecOptions
        });
        console.log("consumer는", consumer);

        return consumer;
    } catch (error) {
        console.error('Error creating consumer:', error);
        return null;
    }
};

