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
window.studyTime = 0;
window.sleepTime = 0;
window.STATE = 0;
window.isEyeClosed = false; // 눈 감은 상태 추적 변수
window.eyeClosedTime = 0; // 눈 감은 시간 추적 변수
window.isSleeping = false; // 수면 상태 추적 변수

const FaceDetection = () => {
  const [focalLength, setFocalLength] = useState(300);
  const focalRef = useRef(focalLength);
  useEffect(() => { focalRef.current = focalLength; }, [focalLength]);

  const { leftBlinkHistory, rightBlinkHistory, blinkCounter } = useBlinkCounter();
  const { leftEarHistory, rightEarHistory, earLogger } = useEarLogger();
  const { headAngleVariationHistory, headAngleVariation } = useHeadAngleVariation();
  const { headMovementHistory, headMovement } = useHeadMovement();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stateInfo, setStateInfo] = useState({
    now: performance.now(),
    state: 0,
    studyTime: 0,
    sleepTime: 0,
    isEyeClosed: false,
    eyeClosedTime: 0,
    isSleeping: false
  });

  // FaceDetection.jsx - Fixed sendSessionDataToBackend function
  const sendSessionDataToBackend = () => {
    const now = performance.now();

    // 현재 집중도 점수 계산
    const currentFocusScore = calculateFocusScore(
      getTimeDecaySum(leftBlinkHistory, now),
      getTimeDecaySum(rightBlinkHistory, now),
      getTimeDecayAvg(leftEarHistory, now),
      getTimeDecayAvg(rightEarHistory, now),
      getTimeDecayAvg(headAngleVariationHistory, now),
      getTimeDecayAvg(headMovementHistory, now)
    ) * 100;

    // 백엔드로 전송할 데이터
    const sessionData = {
      studyTimeMs: Number(window.studyTime) || 0,
      sleepTimeMs: Number(window.sleepTime) || 0,
      focusScore: Number(currentFocusScore) || 0
    };

    console.log('전송할 세션 데이터:', sessionData);

    // 백엔드 API 호출 - 수정된 부분
    fetch('http://localhost:8080/session/set-study-info', {
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
        alert("세션 데이터가 성공적으로 저장되었습니다!");
      })
      .catch(error => {
        console.error('세션 데이터 전송 실패:', error);
        alert("세션 데이터 전송에 실패했습니다. 개발자 도구에서 자세한 오류를 확인하세요.");
      });
  };

  // 타이머 설정 - UI 업데이트용 (100ms마다 업데이트)
  useEffect(() => {
    const timer = setInterval(() => {
      setStateInfo({
        now: performance.now(),
        state: window.STATE,
        studyTime: window.studyTime || 0,
        sleepTime: window.sleepTime || 0,
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

      // ProcessFrame 함수 직접 호출
      ProcessFrame(
        window.cv, canvas, faces.faceLandmarks, focalRef.current, 640, 480,
        blinkCounter,
        earLogger,
        headAngleVariation,
        headMovement,
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
              studyTime={stateInfo.studyTime}
              state={stateInfo.state} // 상태 정보 전달
            />
            <FocalLengthSlider focalLength={focalLength} setFocalLength={setFocalLength} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CanvasPanel
              canvasRef={canvasRef}
              state={stateInfo.state}
              studyTime={stateInfo.studyTime}
            />
            <StatsCards studyTime={stateInfo.studyTime} sleepTime={stateInfo.sleepTime} />
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