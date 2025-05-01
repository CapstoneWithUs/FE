import React from 'react';
import { Clock, Eye, EyeOff, ActivitySquare, User, Maximize2, Camera, Cpu, Sliders, AlertTriangle } from "lucide-react";
import { styles } from './FaceDetectionStyles';

export const formatTime = (ms) => {
  const hours = Math.floor(ms / 3600000).toString().padStart(2, '0');
  const minutes = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

export const getStateIcon = (state) => {
  switch(state) {
    case 0: return <ActivitySquare size={20} />; // Preparing
    case 1: return <Eye size={20} />; // Studying
    case 2: return <User size={20} />; // Away
    case 3: return <EyeOff size={20} />; // Sleeping
    case 4: return <Maximize2 size={20} />; // Looking elsewhere
    default: return <ActivitySquare size={20} />;
  }
};

export const Header = () => (
  <h1 style={styles.header}>
    <Camera size={32} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }} />
    집중력 모니터링 시스템
  </h1>
);

export const LoadingScreen = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.spinner}></div>
    <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>시스템 초기화 중...</p>
    <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "0.5rem" }}>
      <Cpu size={16} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }} />
      얼굴 랜드마크 모델 및 OpenCV 로딩 중
    </p>
  </div>
);

export const TimeBadge = ({ position, studyTime }) => {
  const positionStyle = position === 'left' ? 
    { top: "1rem", left: "1rem" } : 
    { top: "1rem", right: "1rem" };
    
  return (
    <div style={{...styles.badge, ...positionStyle}}>
      <Clock size={18} color="#ff0000" />
      <span style={{ 
        fontFamily: "monospace", 
        fontSize: "1.25rem", 
        color: "#ff0000", 
        fontWeight: "bold" 
      }}>{formatTime(studyTime)}</span>
    </div>
  );
};

export const StateBadge = ({ state }) => (
  <div style={styles.stateBadge}>
    <div style={{
      ...styles.stateIndicator,
      background: styles.getStateColor(state)
    }}>
      {getStateIcon(state)}
      <span>{styles.getStateText(state)}</span>
    </div>
  </div>
);

// 자리 비움 메시지 컴포넌트 추가
export const AwayMessage = () => (
  <div style={styles.awayMessageContainer}>
    <AlertTriangle size={36} color="#ffcc00" />
    <p style={styles.awayMessageText}>자리를 비웠습니다</p>
  </div>
);

// VideoPanel 컴포넌트에 자리 비움 메시지 추가
export const VideoPanel = ({ videoRef, studyTime, state }) => (
  <div style={styles.videoContainer}>
    <video ref={videoRef} autoPlay playsInline style={styles.video} />
    <TimeBadge position="left" studyTime={studyTime} />
    {state === 2 && <AwayMessage />}
  </div>
);

// CanvasPanel 컴포넌트에 자리 비움 메시지 추가 (이미 ProcessFrame에서 처리됨)
export const CanvasPanel = ({ canvasRef, state, studyTime }) => (
  <div style={styles.videoContainer}>
    <canvas ref={canvasRef} width="640" height="480" style={styles.canvas} />
    <TimeBadge position="right" studyTime={studyTime} />
  </div>
);

export const FocalLengthSlider = ({ focalLength, setFocalLength }) => (
  <div style={styles.sliderContainer}>
    <div style={styles.sliderLabel}>
      <div style={styles.sliderLabelText}>
        <Sliders size={16} />
        <span>초점 거리 조정</span>
      </div>
      <span style={styles.sliderValue}>{focalLength}px</span>
    </div>
    <input
      type="range"
      min="10"
      max="2000"
      step="10"
      value={focalLength}
      onChange={e => setFocalLength(parseInt(e.target.value))}
      style={styles.slider}
    />
  </div>
);

export const StatsCards = ({ studyTime, sleepTime }) => (
  <div style={styles.statsContainer}>
    <div style={styles.statCard}>
      <h3 style={styles.statHeader}>
        <Clock size={18} color="#4ade80" />
        공부 시간
      </h3>
      <p style={{ ...styles.timeValue, color: "#4ade80" }}>{formatTime(studyTime)}</p>
    </div>
    <div style={styles.statCard}>
      <h3 style={styles.statHeader}>
        <EyeOff size={18} color="#a855f7" />
        수면 시간
      </h3>
      <p style={{ ...styles.timeValue, color: "#a855f7" }}>{formatTime(sleepTime)}</p>
    </div>
  </div>
);

export const UserGuide = () => (
  <div style={styles.guideContainer}>
    <h3 style={styles.guideHeader}>
      <ActivitySquare size={20} color="#38bdf8" />
      사용 가이드
    </h3>
    <ul style={styles.guideList}>
      <li style={styles.guideItem}>웹캠이 얼굴을 인식하면 자동으로 시선 추적이 시작됩니다.</li>
      <li style={styles.guideItem}>눈을 5초 이상 감으면 수면 모드로 전환되며 공부 시간이 측정되지 않습니다.</li>
      <li style={styles.guideItem}>시선이 화면을 벗어나면 "다른 곳 응시" 상태로 변경됩니다.</li>
      <li style={styles.guideItem}>초점 거리를 조절하여 시선 추적의 정확도를 향상시킬 수 있습니다.</li>
    </ul>
  </div>
);