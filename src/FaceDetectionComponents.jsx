// 모드 선택 컴포넌트 - 왼쪽 세로 배치
export const ModeSelector = ({ displayMode, onModeChange }) => {
  const modes = [
    { key: 'webcam', label: '웹캠 화면' },
    { key: 'debug', label: '디버깅 화면' },
    { key: 'pip', label: 'PIP 모드' },
    { key: 'faceOff', label: '얼굴 화면 OFF' }
  ];

  return (
    <div style={styles.modeSelector} className="mode-selector">
      <div style={styles.modeSelectorTitle}>화면 모드</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="toggle-group">
        {modes.map(mode => (
          <button
            key={mode.key}
            onClick={() => onModeChange(mode.key)}
            style={{
              ...styles.modeButton,
              ...(displayMode === mode.key ? styles.modeButtonActive : {})
            }}
            className="mode-button"
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};import React from 'react';
import { Clock, Eye, EyeOff, ActivitySquare, User, Maximize2, Camera, Cpu, Sliders, AlertTriangle, Play, Monitor, Minimize2 } from "lucide-react";
import { styles } from './FaceDetectionStyles';

import TimeLineChart from "./TimeLineChart";

import getTimeDecayAvg from "./getTimeDecayAvg";
import getTimeDecaySum from "./getTimeDecaySum";
import calculateFocusScore from "./calculateFocusScore";

export const StartSessionButton = ({ onStartSession }) => (
  <button 
    onClick={onStartSession}
    style={{
      ...styles.sessionButton,
      ...styles.startButton
    }}
    className="session-button"
  >
    <Play size={18} />
    측정 시작
  </button>
);

export const EndSessionButton = ({ onEndSession }) => (
  <button 
    onClick={onEndSession}
    style={{
      ...styles.sessionButton,
      ...styles.endButton
    }}
    className="session-button"
  >
    <Clock size={18} />
    세션 종료 및 저장
  </button>
);

// 메인 컨텐츠 레이아웃 컴포넌트 (카메라 + 우측 패널)
export const MainContentLayout = ({ children }) => (
  <div style={styles.mainContent} className="main-content">
    {children}
  </div>
);

// 비디오 섹션 컴포넌트
export const VideoSection = ({ children }) => (
  <div style={styles.videoSection}>
    {children}
  </div>
);

// 우측 패널 컴포넌트 (통계 + 가이드 + 버튼)
export const RightPanel = ({ 
  studyTime, 
  sleepTime, 
  focalLength, 
  setFocalLength, 
  sessionActive, 
  onStartSession, 
  onEndSession 
}) => (
  <div style={styles.rightPanel} className="right-panel">
    <SessionControls 
      sessionActive={sessionActive} 
      onStartSession={onStartSession} 
      onEndSession={onEndSession} 
    />
    <StatsCards studyTime={studyTime} sleepTime={sleepTime} />
    <FocalLengthSlider focalLength={focalLength} setFocalLength={setFocalLength} />
    <UserGuide />
  </div>
);

// 세션 컨트롤 컴포넌트 - 우측 패널 내부로 이동
export const SessionControls = ({ sessionActive, onStartSession, onEndSession }) => (
  <div style={styles.sessionControls} className="session-controls">
    {!sessionActive ? (
      <StartSessionButton onStartSession={onStartSession} />
    ) : (
      <EndSessionButton onEndSession={onEndSession} />
    )}
  </div>
);

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
    <p style={{ fontSize: "1.25rem", marginTop: "1rem", color: "#4472C4" }}>시스템 초기화 중...</p>
    <p style={{ fontSize: "0.875rem", color: "#6C757D", marginTop: "0.5rem" }}>
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
      <Clock size={18} color="#FFFFFF" />
      <span style={{ 
        fontFamily: "monospace", 
        fontSize: "1.25rem", 
        color: "#FFFFFF", 
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

export const AwayMessage = () => (
  <div style={styles.awayMessageContainer}>
    <AlertTriangle size={36} color="#FFFFFF" />
    <p style={styles.awayMessageText}>자리를 비웠습니다</p>
  </div>
);

export const VideoPanel = ({ videoRef, studyTime, state, subject }) => (
  <div style={styles.videoContainer}>
    <video ref={videoRef} autoPlay playsInline style={styles.video} />
    <TimeBadge position="left" studyTime={studyTime} />
    {state === 2 && <AwayMessage />}
    {subject && (
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '1rem',
        background: 'linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)',
        color: '#FFFFFF',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 4px 12px rgba(91, 155, 213, 0.3)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 10
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          과목: {subject}
        </span>
      </div>
    )}
  </div>
);

export const CanvasPanel = ({ canvasRef, state, studyTime }) => (
  <div style={styles.videoContainer}>
    <canvas ref={canvasRef} width="640" height="480" style={styles.canvas} />
    <TimeBadge position="right" studyTime={studyTime} />
  </div>
);

// PIP 모드 패널 (작은 웹캠과 큰 디버깅 화면)
export const PIPPanel = ({ videoRef, canvasRef, studyTime, state, subject }) => (
  <div style={{
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  }}>
    {/* 메인 디버깅 화면 */}
    <div style={styles.videoContainer}>
      <canvas ref={canvasRef} width="640" height="480" style={styles.canvas} />
      <TimeBadge position="right" studyTime={studyTime} />
    </div>
    
    {/* PIP 웹캠 화면 */}
    <div style={{
      position: 'relative',
      width: '240px',
      height: '180px',
      border: '2px solid #B4D2F7',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(91, 155, 213, 0.2)'
    }}>
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {/* PIP 라벨 */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        left: '0.5rem',
        background: 'linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)',
        color: '#FFFFFF',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        <Minimize2 size={12} style={{ display: "inline", marginRight: "0.25rem", verticalAlign: "middle" }} />
        웹캠
      </div>
      {subject && (
        <div style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          background: 'linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)',
          color: '#FFFFFF',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '10px',
          fontWeight: 'bold'
        }}>
          {subject}
        </div>
      )}
      {state === 2 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(245, 158, 11, 0.95)',
          color: '#FFFFFF',
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          자리 비움
        </div>
      )}
    </div>
  </div>
);

// 얼굴 화면 OFF 패널 (통계와 상태만 표시)
export const FaceOffPanel = ({ studyTime, state, subject }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    padding: '2rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%)',
    borderRadius: '1.5rem',
    backdropFilter: 'blur(20px)',
    border: '2px solid #B4D2F7',
    minWidth: '400px',
    boxShadow: '0 8px 32px rgba(91, 155, 213, 0.2)'
  }}>
    {/* 과목명 표시 */}
    <div style={{
      background: 'linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '1rem',
      padding: '1rem 2rem',
      textAlign: 'center'
    }}>
      <h2 style={{
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#FFFFFF'
      }}>
        {subject || 'Blank'}
      </h2>
      <p style={{
        margin: '0.5rem 0 0 0',
        fontSize: '0.875rem',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        현재 과목
      </p>
    </div>

    {/* 큰 타이머 */}
    <div style={{
      background: 'linear-gradient(135deg, rgba(91, 155, 213, 0.1) 0%, rgba(139, 179, 232, 0.1) 100%)',
      border: '2px solid #B4D2F7',
      borderRadius: '1rem',
      padding: '2rem',
      textAlign: 'center',
      minWidth: '300px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <Clock size={32} color="#5B9BD5" />
        <span style={{
          fontFamily: 'monospace',
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#4472C4'
        }}>
          {formatTime(studyTime)}
        </span>
      </div>
      <p style={{
        margin: 0,
        fontSize: '1rem',
        color: '#6C757D'
      }}>
        총 공부 시간
      </p>
    </div>

    {/* 현재 상태 */}
    <div style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 249, 250, 0.6) 100%)',
      border: '2px solid #E9ECEF',
      borderRadius: '1rem',
      padding: '1.5rem',
      textAlign: 'center',
      minWidth: '280px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          padding: '0.5rem',
          borderRadius: '50%',
          background: styles.getStateColor(state),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {getStateIcon(state)}
        </div>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#4472C4'
        }}>
          {styles.getStateText(state)}
        </span>
      </div>
      <p style={{
        margin: 0,
        fontSize: '0.875rem',
        color: '#6C757D'
      }}>
        현재 상태
      </p>
    </div>

    {/* 안내 메시지 */}
    <div style={{
      background: 'rgba(139, 179, 232, 0.1)',
      border: '1px solid #B4D2F7',
      borderRadius: '0.5rem',
      padding: '1rem',
      textAlign: 'center'
    }}>
      <Monitor size={20} style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }} />
      <span style={{
        fontSize: '0.875rem',
        color: '#4472C4'
      }}>
        얼굴 화면이 숨겨져 있지만 측정은 계속 진행됩니다
      </span>
    </div>
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
  <div style={styles.statsContainer} className="stats-container">
    <div style={styles.statCard}>
      <h3 style={styles.statHeader}>
        <Clock size={18} color="#5B9BD5" />
        공부 시간
      </h3>
      <p style={{ ...styles.timeValue, color: "#4472C4", fontSize: "1.5rem" }}>{formatTime(studyTime)}</p>
    </div>
    <div style={styles.statCard}>
      <h3 style={styles.statHeader}>
        <EyeOff size={18} color="#a855f7" />
        수면 시간
      </h3>
      <p style={{ ...styles.timeValue, color: "#a855f7", fontSize: "1.5rem" }}>{formatTime(sleepTime)}</p>
    </div>
  </div>
);

export const UserGuide = () => (
  <div style={styles.guideContainer}>
    <h3 style={styles.guideHeader}>
      <ActivitySquare size={20} color="#5B9BD5" />
      사용 가이드
    </h3>
    <ul style={styles.guideList}>
      <li style={styles.guideItem} className="guideItem">먼저 "측정 시작" 버튼을 눌러 측정을 시작하세요.</li>
      <li style={styles.guideItem} className="guideItem">웹캠이 얼굴을 인식하면 자동으로 시선 추적이 시작됩니다.</li>
      <li style={styles.guideItem} className="guideItem">눈을 5초 이상 감으면 수면 모드로 전환되며 공부 시간이 측정되지 않습니다.</li>
      <li style={styles.guideItem} className="guideItem">시선이 화면을 벗어나면 "다른 곳 응시" 상태로 변경됩니다.</li>
      <li style={styles.guideItem} className="guideItem">초점 거리를 조절하여 시선 추적의 정확도를 향상시킬 수 있습니다.</li>
      <li style={styles.guideItem} className="guideItem">"세션 종료 및 저장" 버튼을 누르면 데이터가 저장되고 통계 페이지로 이동합니다.</li>
    </ul>
  </div>
);

export const ScoreGraph = ({
  leftBlinkHistory,
  rightBlinkHistory,
  leftEarHistory,
  rightEarHistory,
  headAngleVariationHistory,
  headMovementHistory,
  now
}) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "2rem"
  }}>
    <p style={{ color: "#4472C4", fontSize: "1.1rem", fontWeight: "600" }}>
      Score: {(calculateFocusScore(
        window.STATE,
        getTimeDecaySum(leftBlinkHistory, now),
        getTimeDecaySum(rightBlinkHistory, now),
        getTimeDecayAvg(leftEarHistory, now),
        getTimeDecayAvg(rightEarHistory, now),
        getTimeDecayAvg(headAngleVariationHistory, now),
        getTimeDecayAvg(headMovementHistory, now),
      )*100).toFixed(2)}
    </p>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={leftBlinkHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>초당 눈 깜빡임(왼쪽): {getTimeDecaySum(leftBlinkHistory, now).toFixed(2)}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={rightBlinkHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>초당 눈 깜빡임(오른쪽): {getTimeDecaySum(rightBlinkHistory, now).toFixed(2)}</p>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={leftEarHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>EAR (왼쪽): {getTimeDecayAvg(leftEarHistory, now).toFixed(2)}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={rightEarHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>EAR (오른쪽): {getTimeDecayAvg(rightEarHistory, now).toFixed(2)}</p>
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={headAngleVariationHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>머리 각속력 (deg/ms): {getTimeDecayAvg(headAngleVariationHistory, now).toFixed(2)}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <TimeLineChart data={headMovementHistory}></TimeLineChart>
        <p style={{ color: "#4472C4", fontSize: "0.9rem" }}>머리 속력 (m/s): {getTimeDecayAvg(headMovementHistory, now).toFixed(2)}</p>
      </div>
    </div>
  </div>
);