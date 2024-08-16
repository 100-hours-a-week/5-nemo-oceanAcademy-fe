import * as socketClient from 'socket.io-client';
import { loadDevice } from '../client';
import {promise as socketPromise} from '../../utils/promise';

const serverUrl = "https://192.168.200.222:3000";

let socket;

// studentClient.js
export const connectToServerAsStudent = async (
    roomId, 
    setConnectionStatus, 
    setIsSubscriptionDisabled
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