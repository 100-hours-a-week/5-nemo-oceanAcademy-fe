// studentClient.js
export const connectToServerAsStudent = async (
    roomId, 
    setConnectionStatus, 
    setIsSubscriptionDisabled
    ) => {
    try {
        // 서버에 연결하는 로직
        setConnectionStatus('Connected');
        setIsSubscriptionDisabled(false);
    } catch (error) {
        console.error('Error connecting to server:', error);
        setConnectionStatus('Failed to connect');
    }
    };

    export const subscribeToStreamAsStudent = async (
    roomId, 
    setSubStatus
    ) => {
    try {
        setSubStatus('Subscribing...');
        // 스트림 구독 로직
        // 예: WebRTC로 방에서 스트림을 구독
        setSubStatus('Subscribed');
    } catch (error) {
        console.error('Error during subscription:', error);
        setSubStatus('Failed to subscribe');
    }
};
