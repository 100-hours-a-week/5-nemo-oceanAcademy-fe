import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/modal/Modal';
import styles from './LiveTeacher.module.css';
import { Container } from '../../../styles/GlobalStyles';

const LiveTeacher: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLeaveClick = () => {
    setShowModal(true);
  };

  const handleModalLeave = () => {
    setShowModal(false);
    navigate(-1); // 이전 화면으로 이동
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  return (
    <Container>
      {showModal && (
        <Modal 
          title="강의를 나가시겠습니까?"
          content="아직 강의 중이에요!"
          leftButtonText="나가기"
          rightButtonText="취소"
          onLeftButtonClick={handleModalLeave}
          onRightButtonClick={handleModalCancel}
        />
      )}
      <button className={styles.leaveButton} onClick={handleLeaveClick}>나가기</button>
      <div className={styles.videoSection}>
        <div className={styles.video}>강의 화면</div>
        <h2 className={styles.title}>스티븐의 이안이 좋아요</h2>
        <p className={styles.instructor}>강사: 스티븐</p>
      </div>
      <div className={styles.controls}>
        <button>녹화</button>
        <button>동영상 on</button>
        <button>음성 on</button>
        <button>화면공유</button>
      </div>
      <div className={styles.chatSection}>
        <div className={styles.chatWindow}>
          <p>채팅 메시지1</p>
          <p>채팅 메시지2</p>
        </div>
        <div className={styles.chatInput}>
          <input type="text" placeholder="메시지를 입력하세요" />
          <button>전송</button>
        </div>
      </div>
    </Container>
  );
};

export default LiveTeacher;