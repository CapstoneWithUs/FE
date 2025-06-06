import React, { useState, useEffect } from 'react';
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
  const [sessionActive, setSessionActive] = useState(false);

  if (!subject) {
    console.warn('FocusTrackerPage: 과목명이 전달되지 않았습니다.');
  } else {
    console.log('FocusTrackerPage: 과목명 수신:', subject);
    localStorage.setItem('currentSubject', subject);
  }

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // 측정 중일 때만 경고 표시
      if (sessionActive) {
        event.preventDefault();
        event.returnValue = ''; // Chrome에서 필요
        return '측정 중입니다. 페이지를 나가면 데이터가 손실될 수 있습니다.';
      }
    };

    // 측정 중일 때만 이벤트 리스너 등록
    if (sessionActive) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      console.log('beforeunload 이벤트 리스너 등록됨 (측정 중)');
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('beforeunload 이벤트 리스너 해제됨 (측정 중지)');
    }

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('beforeunload 이벤트 리스너 정리됨 (컴포넌트 언마운트)');
    };
  }, [sessionActive]);

  const handleModeChange = (mode) => {
    setDisplayMode(mode);
  };

  const handleSessionStatusChange = (isActive) => {
    setSessionActive(isActive);
    console.log('세션 상태 변경:', isActive ? '측정 시작' : '측정 중지');
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
      <FaceDetection subject={subject} displayMode={displayMode} onSessionStatusChange={handleSessionStatusChange} />
    </div>
  );
};

export default FocusTrackerPage;