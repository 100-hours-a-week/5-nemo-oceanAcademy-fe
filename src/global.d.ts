// src/global.d.ts
interface Window {
    Kakao: any;
}

declare module 'sockjs-client' {
    const SockJS: any;
    export default SockJS;
}