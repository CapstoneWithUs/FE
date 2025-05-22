import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import FaceDetection from '../FaceDetection';
import styles from './FocusTrackerPage.module.css';

const DISPLAY_MODES = {
  WEBCAM: 'webcam',
  DEBUG: 'debug', 
  PIP: 'pip',
  FACE_OFF: 'faceOff'
};

const FocusTrackerPage = () => {
  const location = useLocation();
  const subject = location.state?.subject || '';
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.WEBCAM);
  
  if (!subject) {
    console.warn('FocusTrackerPage: 과목명이 전달되지 않았습니다.');
  } else {
    console.log('FocusTrackerPage: 과목명 수신:', subject);
    localStorage.setItem('currentSubject', subject);
  }

  const handleModeChange = (mode) => {
    setDisplayMode(mode);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {subject ? `${subject} - 순공 시간 측정` : '순공 시간 측정'}
      </h2>
      
      {/* 디스플레이 모드 토글 */}
      <div className={styles.modeSelector}>
        <h3 className={styles.modeSelectorTitle}>화면 모드 선택</h3>
        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleButton} ${displayMode === DISPLAY_MODES.WEBCAM ? styles.active : ''}`}
            onClick={() => handleModeChange(DISPLAY_MODES.WEBCAM)}
          >
            웹캠 화면
          </button>
          <button
            className={`${styles.toggleButton} ${displayMode === DISPLAY_MODES.DEBUG ? styles.active : ''}`}
            onClick={() => handleModeChange(DISPLAY_MODES.DEBUG)}
          >
            디버깅 화면
          </button>
          <button
            className={`${styles.toggleButton} ${displayMode === DISPLAY_MODES.PIP ? styles.active : ''}`}
            onClick={() => handleModeChange(DISPLAY_MODES.PIP)}
          >
            PIP 모드
          </button>
          <button
            className={`${styles.toggleButton} ${displayMode === DISPLAY_MODES.FACE_OFF ? styles.active : ''}`}
            onClick={() => handleModeChange(DISPLAY_MODES.FACE_OFF)}
          >
            얼굴 화면 OFF
          </button>
        </div>
      </div>

      {/* FaceDetection 컴포넌트에 displayMode prop 전달 */}
      <FaceDetection subject={subject} displayMode={displayMode} />
    </div>
  );
};

export default FocusTrackerPage;