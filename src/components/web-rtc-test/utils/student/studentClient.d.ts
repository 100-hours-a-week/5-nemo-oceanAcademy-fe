// studentClient.d.ts

export declare function connectToServerAsStudent(
    roomId: string, 
    setConnectionStatus: (status: string) => void, 
    setIsSubscriptionDisabled: (disabled: boolean) => void
): Promise<void>;

export declare function subscribeToStreamAsStudent(
    roomId: string, 
    setSubStatus: (status: string) => void
): Promise<void>;
