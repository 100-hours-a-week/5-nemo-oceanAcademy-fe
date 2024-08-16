import React, { useState } from 'react';
import { connectToServer, publishStream, subscribeToStream } from './utils/client';

const WebRTCTestComponent: React.FC = () => {

  const [roomId, setRoomId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('');
  const [webcamStatus, setWebcamStatus] = useState('');
  const [screenStatus, setScreenStatus] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [isPublishingDisabled, setIsPublishingDisabled] = useState(true);
  const [isSubscriptionDisabled, setIsSubscriptionDisabled] = useState(true);
  const [useSimulcast, setUseSimulcast] = useState(false);

  const handleConnect = async () => {
    // 연결 로직
    await connectToServer(roomId, setConnectionStatus, setIsPublishingDisabled, setIsSubscriptionDisabled);
  };

  const handleWebcam = async () => {
    setWebcamStatus('Publishing...');
    try {
      await publishStream(
        true, // 웹캠을 사용
        roomId,
        useSimulcast,
        setWebcamStatus,
        setIsPublishingDisabled,
        setIsSubscriptionDisabled
      );
    } catch (error) {
      console.error('Error starting webcam:', error);
      setWebcamStatus('Failed to start webcam');
    }
  };

  const handleScreenShare = async () => {
    setScreenStatus('Starting Screen Share...');
    try {
        await publishStream(false, roomId, useSimulcast, setScreenStatus, setIsPublishingDisabled, setIsSubscriptionDisabled);
    } catch (error) {
        setScreenStatus('Failed to start Screen Share');
        console.error('Error starting screen share stream:', error);
    }
  };

  const handleSubscribe = async () => {
    setSubStatus('Starting Subscription...');
    try {
        await subscribeToStream(roomId, setSubStatus, setIsSubscriptionDisabled);
    } catch (error) {
        setSubStatus('Failed to subscribe');
        console.error('Error during subscription:', error);
    }
  };


  return (
    <div>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <table>
        <tbody>
          <tr>
            <td>
              <div>Local</div>
              <video id="local_video" controls autoPlay playsInline></video>
            </td>
            <td>
              <div>Remote</div>
              <video id="remote_video" controls autoPlay playsInline></video>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <table>
        <tbody>
          <tr>
            <td>
              <fieldset id="fs_connection">
                <legend>Connection</legend>
                <div>
                  <button onClick={handleConnect}>Connect</button> 
                  <span>{connectionStatus}</span>
                </div>
              </fieldset>
            </td>
            <td>
              <fieldset id="fs_publish" disabled={isPublishingDisabled}>
                <legend>Publishing</legend>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      checked={useSimulcast}
                      onChange={(e) => setUseSimulcast(e.target.checked)}
                    />
                    Use Simulcast
                  </label>
                </div>
                <div>
                  <button onClick={handleWebcam}>Start Webcam</button> 
                  <span>{webcamStatus}</span>
                </div>
                <div>
                  <button onClick={handleScreenShare}>Share Screen</button> 
                  <span>{screenStatus}</span>
                </div>
              </fieldset>
            </td>
            <td>
              <fieldset id="fs_subscribe" disabled={isSubscriptionDisabled}>
                <legend>Subscription</legend>
                <div>
                  <button onClick={handleSubscribe}>Subscribe</button> 
                  <span>{subStatus}</span>
                </div>
              </fieldset>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WebRTCTestComponent;
