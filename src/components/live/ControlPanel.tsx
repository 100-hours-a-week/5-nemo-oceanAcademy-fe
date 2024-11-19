import React from 'react';
import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onToggleWebcam: () => void;
  onToggleScreenShare: () => void;
  onToggleMicrophone: () => void;
  onToggleSystemAudio: () => void;
  isWebcamOn: boolean;
  isScreenShareOn: boolean;
  isMicrophoneOn: boolean;
  isSystemAudioOn: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onToggleWebcam,
  onToggleScreenShare,
  onToggleMicrophone,
  onToggleSystemAudio,
  isWebcamOn,
  isScreenShareOn,
  isMicrophoneOn,
  isSystemAudioOn,
}) => {
  return (
    <div className={styles.controlPanel}>
      <button onClick={onToggleWebcam}>
        {isWebcamOn ? 'Webcam Off' : 'Webcam On'}
      </button>
      <button onClick={onToggleScreenShare}>
        {isScreenShareOn ? 'Stop Share' : 'Share Screen'}
      </button>
      <button onClick={onToggleMicrophone}>
        {isMicrophoneOn ? 'Mic Off' : 'Mic On'}
      </button>
      <button onClick={onToggleSystemAudio}>
        {isSystemAudioOn ? 'Audio Off' : 'Audio On'}
      </button>
    </div>
  );
};

export default ControlPanel;
