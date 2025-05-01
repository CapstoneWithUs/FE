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
  UserGuide
} from './FaceDetectionComponents';

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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const faceLandmarkerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [stateInfo, setStateInfo] = useState({
    state: 0,
    studyTime: 0,
    sleepTime: 0,
    isEyeClosed: false,
    eyeClosedTime: 0,
    isSleeping: false
  });

  // 타이머 설정 - UI 업데이트용 (100ms마다 업데이트)
  useEffect(() => {
    const timer = setInterval(() => {
      setStateInfo({
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
      ProcessFrame(window.cv, canvas, faces.faceLandmarks, focalRef.current, 640, 480);
      
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
    </div>
  );
};

export default FaceDetection;