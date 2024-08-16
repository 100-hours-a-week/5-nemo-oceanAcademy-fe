import React, { useEffect, useRef } from 'react';
import adapter from 'webrtc-adapter';

const WebRTCTestComponent: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        // 웹캠 스트림을 가져와서 비디오 요소에 설정
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('웹캠 접근 중 오류 발생:', error);
      }
    };

    startWebcam();

    // 컴포넌트 언마운트 시 웹캠 스트림 정지
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <h1>WebRTC 테스트</h1>
      <h5>안녕하세요 저희는 니모예요 저희의 바다서원을 많이 사랑해주세요</h5>
      <h5>주디의 CICD 완성! 이제 HTTPS 해볼게용</h5>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default WebRTCTestComponent;