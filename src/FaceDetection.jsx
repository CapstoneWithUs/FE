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

const LoadCV = async () => {
  if (typeof cv === "undefined") {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://docs.opencv.org/4.x/opencv.js";
      script.async = true;
      script.onload = async () => {
        window.cv = await window.cv;
        resolve();
      }
      document.body.appendChild(script);
    });
  }
};

// 전역 변수 초기화
window.prvTime = performance.now();
window.startTime = Date.now();
window.accTime = [0, 0, 0, 0, 0, 0, 0];
window.STATE = 0;
window.isEyeClosed = false;
window.eyeClosedTime = 0;
window.isSleeping = false;
window.isSessionActive = false;

const FaceDetection = forwardRef(({ subject, displayMode = 'webcam', onSessionStatusChange, onNormalExit }, ref) => {
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 전역 변수 초기화
  useEffect(() => {
    window.prvTime = performance.now();
    window.startTime = Date.now();
    window.accTime = [0, 0, 0, 0, 0, 0, 0];
    window.STATE = 0;
    window.isEyeClosed = false;
    window.eyeClosedTime = 0;
    window.isSleeping = false;
    window.isSessionActive = false;
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
    if (videoRef.current && displayMode == "pip") videoRef.current.requestPictureInPicture();
  }, [displayMode]);

  const canvasRef = useRef(null);
  const canvasOverlayRef = useCanvas();
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);
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
    window.prvTime = performance.now();
    window.startTime = Date.now();
    window.accTime = [0, 0, 0, 0, 0, 0, 0];
    window.STATE = 0;
    window.isEyeClosed = false;
    window.eyeClosedTime = 0;
    window.isSleeping = false;
    window.isSessionActive = true;

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

      if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {      const timeScoreData = Array.from(
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

    if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {      const timeScoreData = Array.from(
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
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        setFaceLandmarker(await FaceLandmarker.createFromOptions(vision,
          {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU"
            },
            minFaceDetectionConfidence: 0.9,
            minFacePresenceConfidence: 0.9,
            outputFaceBlendshapes: false,
            runningMode: "VIDEO",
            numFaces: 1
          }
        ));
        setLoading(false);
      } catch (error) {
        console.error("Error setting up face landmarker:", error);
      }
    };

    const startCamera = async () => {
      if (!window.cv) await LoadCV();
      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          })
          .catch((error) => console.error("Error accessing webcam:", error));
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
      setTimeout(() => requestAnimationFrame(detectFaces), 75);
    };
    requestAnimationFrame(detectFaces);
  }, [faceLandmarker, sessionActive]);

  // [삭제] 빈 함수였던 handleModeChange 함수 제거
  // const handleModeChange = (mode) => {
  //   // displayMode 변경 로직은 FocusTrackerPage에서 처리
  // };

  return (
    <div style={styles.container}>
      <style>{styles.globalCss}</style>

      {/* [수정] onModeChange props에서 빈 함수 대신 undefined 전달 */}
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