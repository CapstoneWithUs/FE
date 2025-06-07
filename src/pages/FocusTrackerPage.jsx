// ==========================================
// 📁 FocusTrackerPage.jsx - 완전한 모달 연동
// ==========================================

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // ✅ useNavigate 추가
import FaceDetection from '../FaceDetection';
import SessionWarningModal from '../components/SessionWarningModal';
import styles from './FocusTrackerPage.module.css';

const DISPLAY_MODES = {
  WEBCAM: 'webcam',
  DEBUG: 'debug', 
  PIP: 'pip',
  FACE_OFF: 'faceOff'
};

const FocusTrackerPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ 추가
  const subject = location.state?.subject || '';
  const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.WEBCAM);
  const [sessionActive, setSessionActive] = useState(false);
  
  // 모달 관련 state
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // ✅ FaceDetection 컴포넌트 참조 추가
  const faceDetectionRef = useRef(null);
  
  if (!subject) {
    console.warn('FocusTrackerPage: 과목명이 전달되지 않았습니다.');
  } else {
    console.log('FocusTrackerPage: 과목명 수신:', subject);
    localStorage.setItem('currentSubject', subject);
  }

  // ✅ 수정된 네비게이션 클릭 차단 로직 - 커스텀 모달 사용
  useEffect(() => {
    const handleNavigationClick = (event) => {
      if (!sessionActive) return;

      const target = event.target;
      const isNavigationButton = 
        target.closest('[class*="navButton"]') ||
        target.closest('button[onclick*="navigate"]') ||
        target.closest('a[href]');

      if (isNavigationButton) {
        console.log('📍 네비게이션 버튼 클릭 감지됨');
        
        event.preventDefault();
        event.stopPropagation();
        
        // ✅ 브라우저 기본 confirm 대신 커스텀 모달 사용
        // 어떤 버튼이 클릭되었는지 저장
        const buttonText = target.textContent || target.innerText;
        let targetPath = '/';
        
        if (buttonText.includes('홈')) targetPath = '/';
        else if (buttonText.includes('통계')) targetPath = '/statistics';
        else if (buttonText.includes('랭킹')) targetPath = '/rankingPage';
        else if (buttonText.includes('더보기')) targetPath = '/settingPage';
        
        setPendingNavigation(targetPath);
        setShowWarningModal(true);
        
        console.log('📍 커스텀 모달 표시, 목적지:', targetPath);
      }
    };

    if (sessionActive) {
      document.addEventListener('click', handleNavigationClick, true);
      console.log('📍 네비게이션 클릭 차단 이벤트 리스너 등록됨');
    } else {
      document.removeEventListener('click', handleNavigationClick, true);
      console.log('📍 네비게이션 클릭 차단 이벤트 리스너 해제됨');
    }

    return () => {
      document.removeEventListener('click', handleNavigationClick, true);
      console.log('📍 네비게이션 클릭 차단 이벤트 리스너 정리됨');
    };
  }, [sessionActive]);

  // ✅ 수정된 브라우저 이벤트 차단 로직 - 커스텀 모달 사용
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (sessionActive) {
        event.preventDefault();
        event.returnValue = '';
        
        // ✅ 브라우저 창 닫기/새로고침의 경우 커스텀 모달 표시
        // beforeunload는 비동기 작업을 허용하지 않으므로 다른 방식 필요
        // 일단 기본 경고는 유지하되, 추후 popstate 이벤트도 고려
        
        return '측정 중입니다. 페이지를 나가면 데이터가 손실될 수 있습니다.';
      }
    };

    if (sessionActive) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      console.log('📍 beforeunload 이벤트 리스너 등록됨 (측정 중)');
    } else {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('📍 beforeunload 이벤트 리스너 해제됨 (측정 중지)');
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('📍 beforeunload 이벤트 리스너 정리됨 (컴포넌트 언마운트)');
    };
  }, [sessionActive]);

  const handleModeChange = (mode) => {
    setDisplayMode(mode);
  };

  const handleSessionStatusChange = (isActive) => {
    setSessionActive(isActive);
    console.log('📍 세션 상태 변경:', isActive ? '측정 시작' : '측정 중지');
  };

  // ✅ 완성된 모달 핸들러 함수들
  const handleSaveAndExit = async () => {
    console.log('📍 저장 후 나가기 선택됨');
    setShowWarningModal(false);
    
    try {
      // FaceDetection 컴포넌트의 저장 함수 호출
      if (faceDetectionRef.current && faceDetectionRef.current.saveSessionData) {
        await faceDetectionRef.current.saveSessionData();
        console.log('📍 데이터 저장 완료');
      }
      
      // 저장 완료 후 네비게이션 실행
      if (pendingNavigation) {
        console.log('📍 저장 후 네비게이션 실행:', pendingNavigation);
        navigate(pendingNavigation);
      } else {
        // 기본적으로 통계 페이지로 이동
        navigate('/statistics', { state: { subject } });
      }
    } catch (error) {
      console.error('📍 데이터 저장 실패:', error);
      alert('데이터 저장에 실패했습니다. 다시 시도해주세요.');
    }
    
    setPendingNavigation(null);
  };

  const handleExitWithoutSave = () => {
    console.log('📍 저장 없이 나가기 선택됨');
    setShowWarningModal(false);
    
    // 세션 상태 초기화
    setSessionActive(false);
    
    // 네비게이션 실행
    if (pendingNavigation) {
      console.log('📍 저장 없이 네비게이션 실행:', pendingNavigation);
      navigate(pendingNavigation);
    } else {
      // 기본적으로 홈으로 이동
      navigate('/');
    }
    
    setPendingNavigation(null);
  };

  const handleCancel = () => {
    console.log('📍 취소 선택됨 - 현재 화면 유지');
    setShowWarningModal(false);
    setPendingNavigation(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {subject ? `${subject} - 순공 시간 측정` : '순공 시간 측정'}
      </h2>
      
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

      {/* ✅ ref 추가 */}
      <FaceDetection 
        ref={faceDetectionRef}
        subject={subject} 
        displayMode={displayMode} 
        onSessionStatusChange={handleSessionStatusChange}
      />

      {/* 커스텀 모달 컴포넌트 */}
      <SessionWarningModal
        isOpen={showWarningModal}
        onSaveAndExit={handleSaveAndExit}
        onExitWithoutSave={handleExitWithoutSave}
        onCancel={handleCancel}
      />

      {/* ✅ 테스트용 버튼 (개발 중에만 사용) */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          onClick={() => setShowWarningModal(true)}
          style={{
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            zIndex: 9999,
            background: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          모달 테스트
        </button>
      )}
    </div>
  );
};

export default FocusTrackerPage;