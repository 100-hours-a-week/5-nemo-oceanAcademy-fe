export declare const connectToServer: (
    roomId: string, 
    setConnectionStatus: (status: string) => void, 
    setIsPublishingDisabled: (disabled: boolean) => void, 
    setIsSubscriptionDisabled: (disabled: boolean) => void
) => Promise<void>;

export declare const loadDevice: (
    routerRtpCapabilities: any
    ) => Promise<void>;
    

export declare function publishStream(
    isWebcam: boolean, // 웹캠 사용 여부
    roomId: string, // 방 ID
    useSimulcast: boolean, // 시뮬캐스트 사용 여부
    setPublishStatus: (status: string) => void, // 퍼블리싱 상태 업데이트 함수
    setPublishingDisabled: (disabled: boolean) => void, // 퍼블리싱 버튼 비활성화 함수
    setSubscriptionDisabled: (disabled: boolean) => void // 구독 버튼 비활성화 함수
): Promise<void>;
    

export declare function subscribeToStream(
    roomId: string,
    setSubscriptionStatus: (status: string) => void,
    setSubscriptionDisabled: (disabled: boolean) => void
): Promise<void>;


export declare function consume(
    transport: any, // transport의 정확한 타입을 알고 있다면 이를 변경해야 합니다.
    roomId: string
): Promise<MediaStream>;

export declare function getUserMedia(
    transport: any, // transport의 정확한 타입을 알고 있다면 이를 사용해야 합니다.
    isWebcam: boolean
): Promise<MediaStream | undefined>;