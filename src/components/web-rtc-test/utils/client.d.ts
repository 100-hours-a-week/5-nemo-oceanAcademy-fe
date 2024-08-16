export declare const connectToServer: (
    roomId: string, 
    setConnectionStatus: (status: string) => void, 
    setIsPublishingDisabled: (disabled: boolean) => void, 
    setIsSubscriptionDisabled: (disabled: boolean) => void
) => Promise<void>;