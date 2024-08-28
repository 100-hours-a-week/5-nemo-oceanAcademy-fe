// utils/streamUtils.ts

import { Producer } from './teacher/teacherClient';

export const startStream = async (
    startFunction: () => Promise<Producer | null>,
    setStatus: (status: string) => void,
    setProducer: (producer: Producer | null) => void
) => {
    setStatus('Starting...');
    try {
        const producer = await startFunction();
        setProducer(producer);
        setStatus('Started');
    } catch (error) {
        setStatus('Failed to start');
        console.error('Error starting stream:', error);
    }
};

export const stopStream = (
    stopFunction: (producer: Producer | null, setStatus: (status: string) => void) => void,
    producer: Producer | null,
    setStatus: (status: string) => void,
    setProducer: (producer: Producer | null) => void
) => {
    if (producer) {
        stopFunction(producer, setStatus);
        setProducer(null);
        setStatus('Stopped');
    }
};
