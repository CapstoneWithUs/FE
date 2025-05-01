import getPose from "./getPose";
import getEAR from "./getEAR";

import { 
  ORIGINAL_POINTS,
  LEFT_EYE,
  RIGHT_EYE,
  PNP_IDX,
  PPI,
  EAR_THRESHOLD,
  SLEEP_THRESHOLD,
} from './constants';

// 전역 변수는 window 객체에서 접근
// FaceDetection.jsx에서 선언됨:
// window.prvTime = performance.now();
// window.studyTime = 0;
// window.sleepTime = 0;
// window.STATE = 0;
// window.isEyeClosed = false; // 눈 감은 상태 추적 변수 추가
// window.eyeClosedTime = 0; // 눈 감은 시간 추적 변수 추가
// window.isSleeping = false; // 수면 상태 추적 변수 추가

//0: 준비 중, 1: 공부 중, 2: 자리 이탈, 3: 수면, 4: 다른 곳 응시
const ProcessFrame = (
  cv, canvas, landmarks, focal_length, w, h,
  blinkCounter,
  earLogger,
  headAngleVariation,
  headMovement
) => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 현재 시간 가져오기
  const currentTime = performance.now();
  const deltaTime = currentTime - window.prvTime;
  
  // 공부 중일 때만 시간 증가
  if (window.STATE == 1) {
    window.studyTime += deltaTime;
  }
  
  // 빨간색 큰 시간 표시
  ctx.fillStyle = "red";
  ctx.font = "30px Verdana";
  const hh = (Math.floor(window.studyTime/3600000)).toString().padStart(2, '0');
  const mm = (Math.floor(window.studyTime/60000)%60).toString().padStart(2, '0');
  const ss = (Math.floor(window.studyTime/1000)%60).toString().padStart(2, '0');
  
  // 오른쪽 화면에서 중앙에 빨간색으로 큰 시간을 표시
  ctx.fillText(`${hh}:${mm}:${ss}`, canvas.width/2 - 75, 40);

  // 얼굴이 감지되지 않으면 "자리 이탈" 상태로 변경
  if (landmarks.length == 0) {
    window.STATE = 2;
    
    // "자리를 비웠습니다" 메시지 표시
    ctx.fillStyle = "white";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    // 화면 중앙에 큰 메시지 표시
    ctx.fillText("자리를 비웠습니다", canvas.width/2, canvas.height/2);
    
    // 경고 아이콘 그리기 (노란색 삼각형)
    const triangleSize = 30;
    const triangleY = canvas.height/2 - 50;
    
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, triangleY - triangleSize);
    ctx.lineTo(canvas.width/2 - triangleSize, triangleY + triangleSize);
    ctx.lineTo(canvas.width/2 + triangleSize, triangleY + triangleSize);
    ctx.closePath();
    ctx.fill();
    
    // 느낌표 그리기
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Arial";
    ctx.fillText("!", canvas.width/2, triangleY);
    
    window.prvTime = currentTime;
    return;
  }
  
  // 얼굴이 감지되면 "공부 중" 상태로 변경 (수면 중이 아니라면)
  if (window.STATE !== 3) {
    window.STATE = 1;
  }
  
  ctx.fillStyle = "red";
  landmarks[0].forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x * w, point.y * h, 2, 0, 2 * Math.PI);
      ctx.fill();
  });
  
  let coordination = PNP_IDX.map(i => [landmarks[0][i].x * w, landmarks[0][i].y * h]);
  let [pitch, yaw, roll, x, y, z] = getPose(cv, ORIGINAL_POINTS, coordination, focal_length, w, h);
  
  // 측정 데이터를 원 안에 표시 (빨간색 원)
  const circleX = 100;
  const circleY = 100;
  const circleRadius = 70;
  
  // 빨간색 원 그리기
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(circleX, circleY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
  
  // 원 안에 데이터 표시
  ctx.font = "16px Verdana";
  ctx.fillStyle = "red";
  
  const yawPitchRoll = [yaw, pitch, roll].map(x => Math.round(x*180/Math.PI));
  const xyz = [x, y, z].map(x => Math.round(x));
  
  ctx.fillText(`${yawPitchRoll[0]},${yawPitchRoll[1]},${yawPitchRoll[2]}`, circleX - 50, circleY - 10);
  ctx.fillText(`${xyz[0]},${xyz[1]},${xyz[2]}`, circleX - 50, circleY + 10);
  
  let LEpts = LEFT_EYE.map(i => [landmarks[0][i].x * w, landmarks[0][i].y * h]);
  let REpts = RIGHT_EYE.map(i => [landmarks[0][i].x * w, landmarks[0][i].y * h]);

  const left_ear = getEAR(LEpts, yaw, pitch);
  const right_ear = getEAR(REpts, yaw, pitch);

  drawGaze(x, y, z, yaw, pitch);
  eyeClopen(ctx, landmarks, yaw, pitch, w, h, currentTime);
  blinkCounter(left_ear, right_ear);
  earLogger(left_ear, right_ear);
  headAngleVariation(yaw, pitch, roll);
  headMovement(x, y, z);

  // 현재 시간을 이전 시간으로 업데이트
  window.prvTime = currentTime;
};


var gazeCanvas;

const drawGaze = (tx, ty, tz, yaw, pitch) => {
  if (gazeCanvas == undefined) {
    gazeCanvas = document.createElement("canvas");
    gazeCanvas.style.position = "fixed";
    gazeCanvas.style.top = "0";
    gazeCanvas.style.left = "0";
    gazeCanvas.style.width = "100vw";
    gazeCanvas.style.height = "100vh";
    gazeCanvas.style.zIndex = "9999";
    gazeCanvas.style.pointerEvents = "none";

    gazeCanvas.width = window.innerWidth;
    gazeCanvas.height = window.innerHeight;

    document.body.appendChild(gazeCanvas);
  }
  const ctx = gazeCanvas.getContext("2d");
  
  let x = tx+Math.tan(yaw)*tz;
  let y = ty+Math.tan(pitch+10/180*Math.PI)*tz;
  if (x < -500 || x > 500 || y < -100) window.STATE = 4;

  ctx.clearRect(0, 0, gazeCanvas.width, gazeCanvas.height);

  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(x/25.4*PPI+gazeCanvas.width/2, y/25.4*PPI, 10, 0, 2*Math.PI);
  ctx.fill();

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.beginPath();
  let sz = tz*Math.sin(3/180*Math.PI);
  for (let i = 0; i <= 360; i += 5) {
    if (i == 0) {
      ctx.moveTo(
        (x+sz*Math.sin(i/180*Math.PI))/25.4*PPI+gazeCanvas.width/2,
        (y+sz*Math.cos(i/180*Math.PI))/25.4*PPI
      );
    }
    else {
      ctx.lineTo(
        (x+sz*Math.sin(i/180*Math.PI))/25.4*PPI+gazeCanvas.width/2,
        (y+sz*Math.cos(i/180*Math.PI))/25.4*PPI
      );
    }
  }
  ctx.stroke();
};

const eyeClopen = (ctx, landmarks, yaw, pitch, w, h, currentTime) => {
  const deltaTime = currentTime - window.prvTime;
  
  let LEpts = LEFT_EYE.map(i => [landmarks[0][i].x * w, landmarks[0][i].y * h]);
  let REpts = RIGHT_EYE.map(i => [landmarks[0][i].x * w, landmarks[0][i].y * h]);
  const left_ear = getEAR(LEpts, yaw, pitch);
  const right_ear = getEAR(REpts, yaw, pitch);

  // 눈 감음 상태 확인
  if (left_ear < EAR_THRESHOLD && right_ear < EAR_THRESHOLD) {
    // 눈이 감겨 있을 때
    console.log(window.eyeClosedTime, deltaTime);
    window.eyeClosedTime += deltaTime; // 눈 감은 시간 누적
    window.isEyeClosed = true;
    
    // 초록색으로 눈 감은 시간 표시 (5초까지)
    ctx.font = "30px Verdana";
    ctx.fillStyle = "#00FF00";
    const totalSeconds = Math.min(Math.floor(window.eyeClosedTime / 1000), 5);
    const milliseconds = Math.floor((window.eyeClosedTime % 1000) / 10).toString().padStart(2, '0');
    ctx.fillText(`0${totalSeconds}:${milliseconds}`, 240, 70);
    
    // 5초 이상 눈을 감고 있으면 수면 모드로 전환
    if (window.eyeClosedTime >= SLEEP_THRESHOLD && !window.isSleeping) {
      window.STATE = 3; // 수면 상태로 변경
      window.isSleeping = true; // 수면 상태 설정
    }
    
    // 수면 상태일 때만 수면 시간 증가
    if (window.isSleeping) {
      window.sleepTime += deltaTime;
    }
  } 
  else {
    // 눈이 떠진 경우
    window.eyeClosedTime = 0; // 눈 감은 시간 초기화
    window.isEyeClosed = false;
    
    // 수면 상태였다면 공부 상태로 변경
    if (window.isSleeping) {
      window.STATE = 1; // 공부 상태로 변경
      window.isSleeping = false; // 수면 상태 해제
    }
    
    // 수면 시간은 초기화하지 않음 (누적)
  }
};

export default ProcessFrame;