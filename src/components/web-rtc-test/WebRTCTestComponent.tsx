import React, { useState } from 'react';
import { connectToServer } from './utils/client';

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
    // setConnectionStatus('Connected');
    // setIsPublishingDisabled(false);
    // setIsSubscriptionDisabled(false);
    await connectToServer(roomId, setConnectionStatus, setIsPublishingDisabled, setIsSubscriptionDisabled);
  };

  const handleWebcam = () => {
    // 웹캠 시작 로직
    setWebcamStatus('Webcam Started');
  };

  const handleScreenShare = () => {
    // 화면 공유 로직
    setScreenStatus('Screen Sharing Started');
  };

  const handleSubscribe = () => {
    // 구독 로직
    setSubStatus('Subscribed');
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
