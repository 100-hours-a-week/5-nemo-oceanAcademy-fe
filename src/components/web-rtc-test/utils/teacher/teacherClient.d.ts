// teacherClient.d.ts

export declare function connectToServerAsTeacher(
    roomId: string, 
    setConnectionStatus: (status: string) => void, 
    setIsPublishingDisabled: (disabled: boolean) => void
): Promise<void>;

export declare function publishStreamAsTeacher(
    isWebcam: boolean, 
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: (status: string) => void
): Promise<void>;


export function startWebcamStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus
): Promise<Producer | null>;

export function startScreenShareStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus
): Promise<Producer | null>;


export function stopWebcamStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;

export function stopScreenShareStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;