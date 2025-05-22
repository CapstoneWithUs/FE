import React, { useRef, useEffect, useState } from "react";
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
  StartSessionButton
} from './FaceDetectionComponents';

import calculateFocusScore from "./calculateFocusScore";
import getTimeDecayAvg from "./getTimeDecayAvg";
import getTimeDecaySum from "./getTimeDecaySum";

import { useBlinkCounter } from "./blinkCounter";
import { useEarLogger } from "./earLogger";
import { useHeadAngleVariation } from "./headAngleVariation";
import { useHeadMovement } from "./headMovement";
import { useScoreLogger } from "./useScoreLogger";

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

// 이 window 객체에 전역 변수 선언
window.prvTime = performance.now();
window.startTime = Date.now();
window.accTime = [0, 0, 0, 0, 0, 0, 0];
window.STATE = 0;
window.isEyeClosed = false;
window.eyeClosedTime = 0;
window.isSleeping = false;
window.isSessionActive = false;

const FaceDetection = ({ subject, displayMode = 'webcam' }) => {
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
  }, []); // 빈 배열로 마운트 시에만 실행
  
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
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      if (displayMode == "webcam") canvas.style.backgroundColor = "transparent";
      if (displayMode == "debug") canvas.style.backgroundColor = "blue";
      if (displayMode == "pip") canvas.style.backgroundColor = "transparent";
      if (displayMode == "faceOff") canvas.style.backgroundColor = "black";
    }
    if (videoRef.current && displayMode == "pip")  videoRef.current.requestPictureInPicture();
  }, [displayMode]);

  const canvasRef = useRef(null);
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
    console.log('측정 시작됨:', currentSubject);
  };

  const sendSessionDataToBackend = () => {
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

    const timeScorePromises = [];
    
    if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {
      for (let i = 0; i < scoreLog.current[0].length; i++) {
        const { time, value } = scoreLog.current[0][i];
        const scoreData = {
          eachTime: time,
          eachScore: value,
        };
        
        console.log('점수 데이터: ', scoreData);
        
        const promise = fetch('https://be-production-1350.up.railway.app/set-time-score-array-data', {
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

    fetch('https://be-production-1350.up.railway.app/set-statistics', {
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
    }, 100);

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
            minFaceDetectionConfidence: 0.7,
            minFacePresenceConfidence: 0.7,
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
        window.cv, canvas, faces.faceLandmarks, focalRef.current, 640, 480,
        blinkCounter,
        earLogger,
        headAngleVariation,
        headMovement,
        score,
        scoreLogger,
      );
      setTimeout(() => requestAnimationFrame(detectFaces), 100);
    };
    requestAnimationFrame(detectFaces);
  }, [faceLandmarker, sessionActive]);

  return (
    <div style={styles.container}>
      <style>{styles.globalCss}</style>

      <Header />

      {loading ? (
        <LoadingScreen />
      ) : (
        <div style={styles.mainContent}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={styles.videoContainer}>
              <video ref={videoRef} autoPlay playsInline style={styles.video} />
              <canvas ref={canvasRef} width="640" height="480" style={styles.canvas} />
              <div style={{...styles.badge, top: "1rem", left: "1rem"}}>
                <span style={{ 
                  fontFamily: "monospace", 
                  fontSize: "1.25rem", 
                  color: "#ff0000", 
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
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  과목: {currentSubject}
                </div>
              )}
            </div>
            <FocalLengthSlider focalLength={focalLength} setFocalLength={setFocalLength} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <StatsCards studyTime={stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0)} sleepTime={stateInfo.accTime[5]} />
          </div>
        </div>
      )}

      <UserGuide />
      
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {!sessionActive ? (
          <StartSessionButton onStartSession={startSession} />
        ) : (
          <EndSessionButton onEndSession={sendSessionDataToBackend} />
        )}
      </div>
      
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
};

export default FaceDetection;