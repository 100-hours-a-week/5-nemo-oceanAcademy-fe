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


export interface Producer {
    close: () => void;
}

export type SetStreamStatus = (status: string) => void;

/**
 * Stops the screen share stream by closing the given Producer instance.
 * 
 * @param producer - The Producer instance to close.
 * @param setStreamStatus - Function to set the status of the stream.
 */
export function stopScreenShareStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;

/**
 * Starts the screen share stream and returns the Producer instance.
 * 
 * @param roomId - The ID of the room to connect to.
 * @param useSimulcast - Boolean indicating whether to use simulcast.
 * @param setStreamStatus - Function to set the status of the stream.
 * @param videoElement - The HTMLVideoElement where the stream will be played.
 * @returns Promise that resolves to the Producer instance or null if failed.
 */
export function startScreenShareStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus, 
    videoElement: HTMLVideoElement | null
): Promise<Producer | null>;

/**
 * Stops the webcam stream by closing the given Producer instance.
 * 
 * @param producer - The Producer instance to close.
 * @param setStreamStatus - Function to set the status of the stream.
 */
export function stopWebcamStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;

/**
 * Starts the webcam stream and returns the Producer instance.
 * 
 * @param roomId - The ID of the room to connect to.
 * @param useSimulcast - Boolean indicating whether to use simulcast.
 * @param setStreamStatus - Function to set the status of the stream.
 * @param videoElement - The HTMLVideoElement where the stream will be played.
 * @returns Promise that resolves to the Producer instance or null if failed.
 */
export function startWebcamStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus, 
    videoElement: HTMLVideoElement | null
): Promise<Producer | null>;


export interface Producer {
    close: () => void;
}

export type SetStreamStatus = (status: string) => void;

/**
 * Stops the screen share stream by closing the given Producer instance.
 * 
 * @param producer - The Producer instance to close.
 * @param setStreamStatus - Function to set the status of the stream.
 */
export function stopScreenShareStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;

/**
 * Starts the screen share stream and returns the Producer instance.
 * 
 * @param roomId - The ID of the room to connect to.
 * @param useSimulcast - Boolean indicating whether to use simulcast.
 * @param setStreamStatus - Function to set the status of the stream.
 * @param videoElement - The HTMLVideoElement where the stream will be played.
 * @returns Promise that resolves to the Producer instance or null if failed.
 */
export function startScreenShareStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus, 
    videoElement: HTMLVideoElement | null
): Promise<Producer | null>;

/**
 * Stops the webcam stream by closing the given Producer instance.
 * 
 * @param producer - The Producer instance to close.
 * @param setStreamStatus - Function to set the status of the stream.
 */
export function stopWebcamStream(
    producer: Producer | null, 
    setStreamStatus: SetStreamStatus
): void;

/**
 * Starts the webcam stream and returns the Producer instance.
 * 
 * @param roomId - The ID of the room to connect to.
 * @param useSimulcast - Boolean indicating whether to use simulcast.
 * @param setStreamStatus - Function to set the status of the stream.
 * @param videoElement - The HTMLVideoElement where the stream will be played.
 * @returns Promise that resolves to the Producer instance or null if failed.
 */
export function startWebcamStream(
    roomId: string, 
    useSimulcast: boolean, 
    setStreamStatus: SetStreamStatus, 
    videoElement: HTMLVideoElement | null
): Promise<Producer | null>;


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