// FaceDetection.jsx - MediaPipe 오류 수정 버전
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
import { useNavigate } from 'react-router-dom';
import ProcessFrame from "./ProcessFrame";
import { styles } from './FaceDetectionStyles';
import {
  Header,
  LoadingScreen,
  VideoPanel,
  CanvasPanel,
  FocalLengthSlider,
  StatsCards,
  UserGuide,
  ScoreGraph,
  EndSessionButton,
  StartSessionButton,
  ModeSelector,
  MainContentLayout,
  VideoSection,
  RightPanel
} from './FaceDetectionComponents';

import calculateFocusScore from "./calculateFocusScore";
import getTimeDecayAvg from "./getTimeDecayAvg";
import getTimeDecaySum from "./getTimeDecaySum";

import { useBlinkCounter } from "./blinkCounter";
import { useEarLogger } from "./earLogger";
import { useHeadAngleVariation } from "./headAngleVariation";
import { useHeadMovement } from "./headMovement";
import { useScoreLogger } from "./useScoreLogger";

import { useCanvas } from "./components/CanvasOverlay";

// OpenCV 로딩 함수 개선
const LoadCV = async () => {
  if (typeof window.cv !== "undefined" && window.cv.Mat) {
    return Promise.resolve();
  }
  
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://docs.opencv.org/4.x/opencv.js";
    script.async = true;
    script.onload = () => {
      // OpenCV가 완전히 로드될 때까지 대기
      const checkCV = () => {
        if (typeof window.cv !== "undefined" && window.cv.Mat) {
          resolve();
        } else {
          setTimeout(checkCV, 100);
        }
      };
      checkCV();
    };
    script.onerror = () => {
      reject(new Error("OpenCV 로딩 실패"));
    };
    document.body.appendChild(script);
  });
};

// 전역 변수 초기화
if (typeof window !== 'undefined') {
  window.prvTime = performance.now();
  window.startTime = Date.now();
  window.accTime = [0, 0, 0, 0, 0, 0, 0];
  window.STATE = 0;
  window.isEyeClosed = false;
  window.eyeClosedTime = 0;
  window.isSleeping = false;
  window.isSessionActive = false;
}

const FaceDetection = forwardRef(({ subject, displayMode = 'webcam', onSessionStatusChange, onNormalExit }, ref) => {
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 전역 변수 초기화
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.prvTime = performance.now();
      window.startTime = Date.now();
      window.accTime = [0, 0, 0, 0, 0, 0, 0];
      window.STATE = 0;
      window.isEyeClosed = false;
      window.eyeClosedTime = 0;
      window.isSleeping = false;
      window.isSessionActive = false;
    }
    console.log('FaceDetection 컴포넌트 초기화됨');
  }, []);

  const [focalLength, setFocalLength] = useState(380);
  const focalRef = useRef(focalLength);
  useEffect(() => { focalRef.current = focalLength; }, [focalLength]);

  const { leftBlinkHistory, leftBlinkHistoryRef, rightBlinkHistory, rightBlinkHistoryRef, blinkCounter } = useBlinkCounter();
  const { leftEarHistory, leftEarHistoryRef, rightEarHistory, rightEarHistoryRef, earLogger } = useEarLogger();
  const { headAngleVariationHistory, headAngleVariationHistoryRef, headAngleVariation } = useHeadAngleVariation();
  const { headMovementHistory, headMovementHistoryRef, headMovement } = useHeadMovement();
  const { scoreLog, scoreLogger } = useScoreLogger(Date.now());

  const videoRef = useRef(null);
  const displayModeRef = useRef("webcam");
  useEffect(() => {
    displayModeRef.current = displayMode;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const canvasOverlay = canvasOverlayRef.current;
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      canvasOverlay.getContext("2d").clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
      if (displayMode == "webcam") canvas.style.backgroundColor = "transparent";
      if (displayMode == "debug") canvas.style.backgroundColor = "blue";
      if (displayMode == "pip") canvas.style.backgroundColor = "black";
      if (displayMode == "faceOff") canvas.style.backgroundColor = "black";
    }
    if (videoRef.current && displayMode == "pip") {
      videoRef.current.requestPictureInPicture().catch(console.warn);
    }
  }, [displayMode]);

  const canvasRef = useRef(null);
  const canvasOverlayRef = useCanvas();
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [stateInfo, setStateInfo] = useState({
    now: performance.now(),
    state: 0,
    startTime: Date.now(),
    accTime: [0, 0, 0, 0, 0, 0, 0],
    isEyeClosed: false,
    eyeClosedTime: 0,
    isSleeping: false
  });

  const [currentSubject, setCurrentSubject] = useState(
    subject || localStorage.getItem('currentSubject') || 'Blank'
  );

  useEffect(() => {
    if (subject) {
      setCurrentSubject(subject);
      localStorage.setItem('currentSubject', subject);
      console.log('측정 과목:', subject);
    }
  }, [subject]);

  // 외부에서 호출 가능한 함수들 정의
  useImperativeHandle(ref, () => ({
    saveSessionData: () => {
      return new Promise((resolve, reject) => {
        try {
          console.log('외부에서 저장 함수 호출됨');
          sendSessionDataToBackendAsync()
            .then(() => resolve())
            .catch((error) => reject(error));
        } catch (error) {
          console.error('저장 함수 호출 중 오류:', error);
          reject(error);
        }
      });
    },
    getSessionData: () => {
      return {
        gradeATime: Number(window.accTime[0]) || 0,
        gradeBTime: Number(window.accTime[1]) || 0,
        gradeCTime: Number(window.accTime[2]) || 0,
        gradeDTime: Number(window.accTime[3]) || 0,
        sleepTime: Number(window.accTime[5]) || 0,
        gazeAwayTime: Number(window.accTime[6]) || 0,
        absenceTime: Number(window.accTime[4]) || 0,
        focusScore: calculateAverageFocusScore(),
        startTime: Number(window.startTime) || 0,
        endTime: Number(Date.now()),
        subjectName: currentSubject,
      };
    },
    isSessionActive: () => sessionActive
  }), [sessionActive, currentSubject]);

  const startSession = () => {
    if (typeof window !== 'undefined') {
      window.prvTime = performance.now();
      window.startTime = Date.now();
      window.accTime = [0, 0, 0, 0, 0, 0, 0];
      window.STATE = 0;
      window.isEyeClosed = false;
      window.eyeClosedTime = 0;
      window.isSleeping = false;
      window.isSessionActive = true;
    }

    setSessionActive(true);
    // 상위 컴포넌트에 세션 시작 알림
    if (onSessionStatusChange) {
      onSessionStatusChange(true);
    }
    console.log('측정 시작됨:', currentSubject);
  };

  // Promise 기반 저장 함수 (외부 호출용)
  const sendSessionDataToBackendAsync = () => {
    return new Promise((resolve, reject) => {
      if (onNormalExit) {
        onNormalExit();
        console.log('외부 저장 시 정상 종료 콜백 호출됨');
      }

      const sessionData = {
        gradeATime: Number(window.accTime[0]) || 0,
        gradeBTime: Number(window.accTime[1]) || 0,
        gradeCTime: Number(window.accTime[2]) || 0,
        gradeDTime: Number(window.accTime[3]) || 0,
        sleepTime: Number(window.accTime[5]) || 0,
        gazeAwayTime: Number(window.accTime[6]) || 0,
        absenceTime: Number(window.accTime[4]) || 0,
        focusScore: calculateAverageFocusScore(),
        startTime: Number(window.startTime) || 0,
        endTime: Number(Date.now()),
        subjectName: currentSubject,
      };

      console.log('전송할 세션 데이터:', sessionData);

      // 상위 컴포넌트에 세션 종료 알림
      if (onSessionStatusChange) {
        onSessionStatusChange(false);
      }

      const timeScorePromises = [];

      if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {
        const timeScoreData = Array.from(
          new Map(scoreLog.current[0].map(p => [p.time, p])).values()
        );
       
        for (let i = 0; i < timeScoreData.length; i++) {
          const { time, value } = timeScoreData[i];
          const scoreData = {
            eachTime: time,
            eachScore: value,
            subjectName: currentSubject,
          };

          console.log('점수 데이터: ', scoreData);

          const promise = fetch('https://pocusmate.ddns.net/set-time-score-array-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(scoreData),
            credentials: 'include'
          }).then(response => {
            if (!response.ok) {
              return response.text().then(text => {
                console.error(`시간-점수 데이터 전송 오류! 상태: ${response.status}, 응답: ${text}`);
                throw new Error(`시간-점수 데이터 전송 오류! 상태: ${response.status}`);
              });
            }
            return response;
          }).catch(error => {
            console.error('시간-점수 데이터 전송 실패:', error);
            return null;
          });

          timeScorePromises.push(promise);
        }
      }

      fetch('https://pocusmate.ddns.net/set-statistics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData),
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              console.error(`HTTP 오류! 상태: ${response.status}, 응답: ${text}`);
              throw new Error(`HTTP 오류! 상태: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(data => {
          console.log('세션 데이터 전송 성공:', data);
          return Promise.allSettled(timeScorePromises);
        })
        .then(() => {
          console.log('모든 데이터 저장 완료');
          resolve();
        })
        .catch(error => {
          console.error('세션 데이터 전송 실패:', error);
          if (onSessionStatusChange) {
            onSessionStatusChange(true); // 세션을 다시 활성화
          }
          reject(error);
        });
    });
  };

  // 내부 버튼용 저장 함수
  const sendSessionDataToBackend = () => {
    if (onNormalExit) {
      onNormalExit();
      console.log('정상 종료 콜백 호출됨');
    }
    const sessionData = {
      gradeATime: Number(window.accTime[0]) || 0,
      gradeBTime: Number(window.accTime[1]) || 0,
      gradeCTime: Number(window.accTime[2]) || 0,
      gradeDTime: Number(window.accTime[3]) || 0,
      sleepTime: Number(window.accTime[5]) || 0,
      gazeAwayTime: Number(window.accTime[6]) || 0,
      absenceTime: Number(window.accTime[4]) || 0,
      focusScore: calculateAverageFocusScore(),
      startTime: Number(window.startTime) || 0,
      endTime: Number(Date.now()),
      subjectName: currentSubject,
    };

    console.log('전송할 세션 데이터:', sessionData);

    // 상위 컴포넌트에 세션 종료 알림
    if (onSessionStatusChange) {
      onSessionStatusChange(false);
    }

    const timeScorePromises = [];

    if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {
      const timeScoreData = Array.from(
        new Map(scoreLog.current[0].map(p => [p.time, p])).values()
      );
     
      for (let i = 0; i < timeScoreData.length; i++) {
        const { time, value } = timeScoreData[i];
        const scoreData = {
          eachTime: time,
          eachScore: value,
          subjectName: currentSubject,
        };

        console.log('점수 데이터: ', scoreData);

        const promise = fetch('https://pocusmate.ddns.net/set-time-score-array-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(scoreData),
          credentials: 'include'
        }).then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              console.error(`시간-점수 데이터 전송 오류! 상태: ${response.status}, 응답: ${text}`);
              throw new Error(`시간-점수 데이터 전송 오류! 상태: ${response.status}`);
            });
          }
          return response;
        }).catch(error => {
          console.error('시간-점수 데이터 전송 실패:', error);
          return null;
        });

        timeScorePromises.push(promise);
      }
    }

    fetch('https://pocusmate.ddns.net/set-statistics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionData),
      credentials: 'include'
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            console.error(`HTTP 오류! 상태: ${response.status}, 응답: ${text}`);
            throw new Error(`HTTP 오류! 상태: ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => {
        console.log('세션 데이터 전송 성공:', data);
        return Promise.allSettled(timeScorePromises);
      })
      .then(() => {
        alert("세션 데이터가 성공적으로 저장되었습니다!");
        navigate('/statistics', { state: { subject: currentSubject } });
      })
      .catch(error => {
        console.error('세션 데이터 전송 실패:', error);
        alert("세션 데이터 전송에 실패했습니다. 개발자 도구에서 자세한 오류를 확인하세요.");
        if (onSessionStatusChange) {
          onSessionStatusChange(true); // 세션을 다시 활성화
        }
      });
  };

  const calculateAverageFocusScore = () => {
    if (!scoreLog.current || !scoreLog.current[0] || scoreLog.current[0].length === 0) {
      return 0;
    }

    const scores = scoreLog.current[0];
    const sum = scores.reduce((total, item) => total + item.value, 0);
    return Math.round(sum / scores.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setStateInfo({
        now: performance.now(),
        state: window.STATE,
        startTime: window.startTime || performance.now(),
        accTime: window.accTime || [0, 0, 0, 0, 0, 0, 0],
        isEyeClosed: window.isEyeClosed || false,
        eyeClosedTime: window.eyeClosedTime || 0,
        isSleeping: window.isSleeping || false
      });
    }, 75);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const setupFaceLandmarker = async () => {
      try {
        setLoading(true);
        setLoadingError(null);
        
        console.log('MediaPipe 초기화 시작...');
        
        // 최신 버전의 CDN 경로 사용
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        console.log('FilesetResolver 성공');

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU"
          },
          minFaceDetectionConfidence: 0.9,
          minFacePresenceConfidence: 0.9,
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        console.log('FaceLandmarker 초기화 성공');
        setFaceLandmarker(landmarker);
        
      } catch (error) {
        console.error("MediaPipe 초기화 오류:", error);
        setLoadingError(`MediaPipe 초기화 실패: ${error.message}`);
        
        // 백업 CDN 시도
        try {
          console.log('백업 CDN으로 재시도...');
          const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm"
          );
          
          const landmarker = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "CPU" // GPU에서 실패할 경우 CPU 사용
            },
            minFaceDetectionConfidence: 0.9,
            minFacePresenceConfidence: 0.9,
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            numFaces: 1
          });
          
          console.log('백업 CDN으로 FaceLandmarker 초기화 성공');
          setFaceLandmarker(landmarker);
          setLoadingError(null);
          
        } catch (backupError) {
          console.error("백업 CDN도 실패:", backupError);
          setLoadingError(`MediaPipe 초기화 완전 실패: ${backupError.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    const startCamera = async () => {
      try {
        if (!window.cv) {
          console.log('OpenCV 로딩 시작...');
          await LoadCV();
          console.log('OpenCV 로딩 완료');
        }
        
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: 640, 
              height: 480,
              facingMode: 'user'
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          console.log('카메라 스트림 시작 성공');
        } else {
          throw new Error('getUserMedia가 지원되지 않습니다.');
        }
      } catch (error) {
        console.error("카메라 접근 오류:", error);
        setLoadingError(`카메라 접근 실패: ${error.message}`);
      }
    };

    setupFaceLandmarker();
    startCamera();
  }, []);

  useEffect(() => {
    faceLandmarkerRef.current = faceLandmarker;
    
    const detectFaces = async () => {
      if (!videoRef.current || !canvasRef.current) {
        requestAnimationFrame(detectFaces);
        return;
      }
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const canvasOverlay = canvasOverlayRef.current;

      if (typeof window.cv === "undefined" || !faceLandmarkerRef.current || video.readyState <= 2) {
        requestAnimationFrame(detectFaces);
        return;
      }

      if (!sessionActive || !window.isSessionActive) {
        requestAnimationFrame(detectFaces);
        return;
      }
      
      try {
        const faces = faceLandmarkerRef.current.detectForVideo(video, performance.now());

        const now = performance.now();
        const score = calculateFocusScore(
          window.STATE,
          getTimeDecaySum(leftBlinkHistoryRef.current, now),
          getTimeDecaySum(rightBlinkHistoryRef.current, now),
          getTimeDecayAvg(leftEarHistoryRef.current, now),
          getTimeDecayAvg(rightEarHistoryRef.current, now),
          getTimeDecayAvg(headAngleVariationHistoryRef.current, now),
          getTimeDecayAvg(headMovementHistoryRef.current, now)
        ) * 100;

        ProcessFrame(
          displayModeRef.current,
          window.cv, canvas, canvasOverlay, faces.faceLandmarks, focalRef.current, 640, 480,
          blinkCounter,
          earLogger,
          headAngleVariation,
          headMovement,
          score,
          scoreLogger,
        );
      } catch (error) {
        console.error('얼굴 감지 오류:', error);
      }
      setTimeout(() => requestAnimationFrame(detectFaces), 75);
    };
    
    if (faceLandmarker) {
      requestAnimationFrame(detectFaces);
    }
  }, [faceLandmarker, sessionActive]);

  // 로딩 오류가 있을 경우 오류 메시지 표시
  if (loadingError) {
    return (
      <div style={styles.container}>
        <style>{styles.globalCss}</style>
        <ModeSelector displayMode={displayMode} onModeChange={undefined} />
        <Header />
        <div style={styles.loadingContainer}>
          <div style={{ color: '#e74c3c', marginBottom: '1rem' }}>
            <h2>시스템 오류 발생</h2>
            <p>{loadingError}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            style={{
              ...styles.sessionButton,
              ...styles.startButton,
              marginTop: '1rem'
            }}
          >
            페이지 새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{styles.globalCss}</style>

      <ModeSelector displayMode={displayMode} onModeChange={undefined} />
      <Header />

      {loading ? (
        <LoadingScreen />
      ) : (
        <MainContentLayout>
          <VideoSection>
            <div style={styles.videoContainer}>
              <video ref={videoRef} autoPlay playsInline style={styles.video} />
              <canvas ref={canvasRef} width="640" height="480" style={styles.canvas} />

              {displayMode === 'faceOff' && (
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 170,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2rem',
                  padding: '2rem'
                }}>
                  {/* 과목명 */}
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '1rem',
                    padding: '1rem 2rem',
                    textAlign: 'center'
                  }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#bfdbfe' }}>
                      {currentSubject}
                    </h2>
                  </div>

                  {/* 큰 타이머 */}
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <span style={{
                      fontFamily: 'monospace',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      {(() => {
                        const ms = stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0);
                        const hours = Math.floor(ms / 3600000).toString().padStart(2, '0');
                        const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
                        const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
                        return `${hours}:${minutes}:${seconds}`;
                      })()}
                    </span>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                      총 공부 시간
                    </p>
                  </div>

                  {/* 현재 상태 */}
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center'
                  }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                      {(() => {
                        switch (stateInfo.state) {
                          case 0: return '준비 중';
                          case 1: return '공부 중';
                          case 2: return '자리 이탈';
                          case 3: return '수면';
                          case 4: return '다른 곳 응시';
                          default: return '준비 중';
                        }
                      })()}
                    </span>
                    <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.7)' }}>
                      현재 상태
                    </p>
                  </div>
                </div>
              )}

              <div style={{ ...styles.badge, top: "1rem", left: "1rem" }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "1.25rem",
                  color: "#FFFFFF",
                  fontWeight: "bold"
                }}>
                  {(() => {
                    const ms = stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0);
                    const hours = Math.floor(ms / 3600000).toString().padStart(2, '0');
                    const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
                    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
                    return `${hours}:${minutes}:${seconds}`;
                  })()}
                </span>
              </div>

              {stateInfo.state === 2 && (
                <div style={styles.awayMessageContainer}>
                  <p style={styles.awayMessageText}>자리를 비웠습니다</p>
                </div>
              )}

              {currentSubject && (
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  left: '1rem',
                  background: 'linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)',
                  color: '#FFFFFF',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  과목: {currentSubject}
                </div>
              )}
            </div>
          </VideoSection>

          <RightPanel
            studyTime={stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0)}
            sleepTime={stateInfo.accTime[5]}
            focalLength={focalLength}
            setFocalLength={setFocalLength}
            sessionActive={sessionActive}
            onStartSession={startSession}
            onEndSession={sendSessionDataToBackend}
          />
        </MainContentLayout>
      )}

      {/* 디버깅 화면일 때만 ScoreGraph 표시 */}
      {displayMode === 'debug' && (
        <ScoreGraph
          leftBlinkHistory={leftBlinkHistory}
          rightBlinkHistory={rightBlinkHistory}
          leftEarHistory={leftEarHistory}
          rightEarHistory={rightEarHistory}
          headAngleVariationHistory={headAngleVariationHistory}
          headMovementHistory={headMovementHistory}
          now={stateInfo.now}
        />
      )}
    </div>
  );
});

FaceDetection.displayName = 'FaceDetection';

export default FaceDetection;