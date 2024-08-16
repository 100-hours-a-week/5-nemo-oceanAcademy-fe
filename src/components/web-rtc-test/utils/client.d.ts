export declare const connectToServer: (
    roomId: string, 
    setConnectionStatus: (status: string) => void, 
    setIsPublishingDisabled: (disabled: boolean) => void, 
    setIsSubscriptionDisabled: (disabled: boolean) => void
) => Promise<void>;

export declare const loadDevice: (
    routerRtpCapabilities: any
    ) => Promise<void>;
    
    export declare const publishStream: (
    type: string,
    setPublishStatus: (status: string) => void,
    useSimulcast: boolean
    ) => Promise<void>;
    
    export declare const subscribeToStream: (
        setSubscriptionStatus: (status: string) => void
    ) => Promise<void>;