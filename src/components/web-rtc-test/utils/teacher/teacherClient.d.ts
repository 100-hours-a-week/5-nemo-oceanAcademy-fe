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
