import React, { useRef, useEffect, useState } from "react";
import { FilesetResolver, FaceLandmarker } from "@mediapipe/tasks-vision";
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
  EndSessionButton
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
window.startTime = Date.now(); // 공부 측정 시작 시간
window.accTime = [0, 0, 0, 0, 0, 0, 0]; // [A, B, C, D, absence, sleep, gaze_away]
window.STATE = 0;
window.isEyeClosed = false; // 눈 감은 상태 추적 변수
window.eyeClosedTime = 0; // 눈 감은 시간 추적 변수
window.isSleeping = false; // 수면 상태 추적 변수

const FaceDetection = ({ subject }) => {  // props로 subject 변수를 받음
  const [focalLength, setFocalLength] = useState(380);
  const focalRef = useRef(focalLength);
  useEffect(() => { focalRef.current = focalLength; }, [focalLength]);

  const { leftBlinkHistory, leftBlinkHistoryRef, rightBlinkHistory, rightBlinkHistoryRef, blinkCounter } = useBlinkCounter();
  const { leftEarHistory, leftEarHistoryRef, rightEarHistory, rightEarHistoryRef, earLogger } = useEarLogger();
  const { headAngleVariationHistory, headAngleVariationHistoryRef, headAngleVariation } = useHeadAngleVariation();
  const { headMovementHistory, headMovementHistoryRef, headMovement } = useHeadMovement();
  const { scoreLog, scoreLogger } = useScoreLogger(Date.now());

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stateInfo, setStateInfo] = useState({
    now: performance.now(),
    state: 0,
    startTime: Date.now(),
    accTime: [0, 0, 0, 0, 0, 0, 0],
    isEyeClosed: false,
    eyeClosedTime: 0,
    isSleeping: false
  });

  // localStorage에서 과목명을 가져오거나 props에서 받은 값 사용, 둘 다 없으면 'Blank' 사용
  const [currentSubject, setCurrentSubject] = useState(
    subject || localStorage.getItem('currentSubject') || 'Blank'
  );

  // subject prop이 변경되면 currentSubject 업데이트
  useEffect(() => {
    if (subject) {
      setCurrentSubject(subject);
      localStorage.setItem('currentSubject', subject); // localStorage에 저장
      console.log('측정 과목:', subject);
    }
  }, [subject]);

  const sendSessionDataToBackend = () => {
    // 최종 전송 데이터
    const sessionData = {
      gradeATime: Number(window.accTime[0]) || 0,
      gradeBTime: Number(window.accTime[1]) || 0,
      gradeCTime: Number(window.accTime[2]) || 0,
      gradeDTime: Number(window.accTime[3]) || 0,
      sleepTime: Number(window.accTime[5]) || 0,
      gazeAwayTime: Number(window.accTime[6]) || 0,
      absenceTime: Number(window.accTime[4]) || 0,
      focusScore: calculateAverageFocusScore(), // 평균 집중도 계산
      startTime: Number(window.startTime) || 0,
      endTime: Number(Date.now()),
      subjectName: currentSubject,
    };

    console.log('전송할 세션 데이터:', sessionData);

    // 시간-점수 데이터 전송 준비
    const timeScorePromises = [];
    
    // scoreLog 데이터 확인 및 처리
    if (scoreLog.current && scoreLog.current[0] && scoreLog.current[0].length > 0) {
      for (let i = 0; i < scoreLog.current[0].length; i++) {
        const { time, value } = scoreLog.current[0][i];
        const scoreData = {
          eachTime: time,
          eachScore: value,
        };
        
        console.log('점수 데이터: ', scoreData);
        
        // 각 시간-점수 데이터 전송
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
          // 개별 오류는 무시하고 진행
          return null;
        });
        
        timeScorePromises.push(promise);
      }
    }

    // 세션 데이터 전송
    fetch('http://localhost:8080/set-statistics', {
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
        
        // 모든 시간-점수 데이터 전송 시도 (결과는 무시)
        return Promise.allSettled(timeScorePromises);
      })
      .then(() => {
        alert("세션 데이터가 성공적으로 저장되었습니다!");
      })
      .catch(error => {
        console.error('세션 데이터 전송 실패:', error);
        alert("세션 데이터 전송에 실패했습니다. 개발자 도구에서 자세한 오류를 확인하세요.");
      });
  };

  // 평균 집중도 점수 계산
  const calculateAverageFocusScore = () => {
    if (!scoreLog.current || !scoreLog.current[0] || scoreLog.current[0].length === 0) {
      return 0;
    }
    
    const scores = scoreLog.current[0];
    const sum = scores.reduce((total, item) => total + item.value, 0);
    return Math.round(sum / scores.length);
  };

  // 타이머 설정 - UI 업데이트용 (100ms마다 업데이트)
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

      // ProcessFrame 함수 직접 호출
      ProcessFrame(
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
  }, [faceLandmarker]);

  return (
    <div style={styles.container}>
      <style>{styles.globalCss}</style>

      <Header />

      {loading ? (
        <LoadingScreen />
      ) : (
        <div style={styles.mainContent}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <VideoPanel
              videoRef={videoRef}
              studyTime={stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0)}
              state={stateInfo.state}
              subject={currentSubject} // 과목명 전달
            />
            <FocalLengthSlider focalLength={focalLength} setFocalLength={setFocalLength} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CanvasPanel
              canvasRef={canvasRef}
              state={stateInfo.state}
              studyTime={stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0)}
            />
            <StatsCards studyTime={stateInfo.accTime.slice(0, 4).reduce((acc, cur) => acc + cur, 0)} sleepTime={stateInfo.accTime[5]} />
          </div>
        </div>
      )}

      <UserGuide />
      {/* 세션 종료 버튼 */}
      <EndSessionButton onEndSession={sendSessionDataToBackend} />
      <ScoreGraph
        leftBlinkHistory={leftBlinkHistory}
        rightBlinkHistory={rightBlinkHistory}
        leftEarHistory={leftEarHistory}
        rightEarHistory={rightEarHistory}
        headAngleVariationHistory={headAngleVariationHistory}
        headMovementHistory={headMovementHistory}
        now={stateInfo.now}
      />
    </div>
  );
};

export default FaceDetection;