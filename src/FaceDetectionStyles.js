export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)",
    color: "#212529",
    padding: "1rem",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  
  header: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#5B9BD5",
    textShadow: "0 2px 4px rgba(91, 155, 213, 0.2)",
    letterSpacing: "-0.025em"
  },

  // 모드 선택 버튼들을 왼쪽 세로 배치
  modeSelector: {
    position: "fixed",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    zIndex: 100,
    background: "rgba(255, 255, 255, 0.95)",
    padding: "1rem",
    borderRadius: "1rem",
    border: "2px solid #B4D2F7",
    boxShadow: "0 4px 16px rgba(91, 155, 213, 0.15)",
    backdropFilter: "blur(10px)"
  },

  modeSelectorTitle: {
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#4472C4",
    marginBottom: "0.5rem",
    textAlign: "center",
    whiteSpace: "nowrap"
  },

  modeButton: {
    padding: "0.75rem 1rem",
    border: "2px solid #8BB3E8",
    borderRadius: "0.75rem",
    background: "#FFFFFF",
    color: "#5B9BD5",
    fontSize: "0.75rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
    minWidth: "80px",
    whiteSpace: "nowrap"
  },

  modeButtonActive: {
    background: "linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%)",
    color: "#FFFFFF",
    borderColor: "#5B9BD5",
    transform: "scale(1.05)"
  },

  // 세션 컨트롤 버튼들을 상단으로 이동
  sessionControls: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    zIndex: 10
  },

  sessionButton: {
    padding: "0.875rem 1.5rem",
    borderRadius: "0.75rem",
    fontWeight: "600",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },

  startButton: {
    background: "linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%)",
    color: "#FFFFFF"
  },

  endButton: {
    background: "linear-gradient(135deg, #4472C4 0%, #5B9BD5 100%)",
    color: "#FFFFFF"
  },
  
  mainContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: "1200px",
    position: "relative",
    zIndex: 10,
    marginLeft: "120px" // 왼쪽 모드 버튼 공간 확보
  },
  
  videoContainer: {
    position: "relative",
    width: "690px",
    height: "530px",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(233, 236, 239, 0.8) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(91, 155, 213, 0.2)",
    overflow: "hidden",
    border: "2px solid #B4D2F7",
    padding: "1.5rem",
    transition: "all 0.3s ease"
  },
  
  video: {
    width: "640px",
    height: "480px",
    position: "absolute",
    top: 20,
    left: 25,
    borderRadius: "1rem",
    border: "2px solid rgba(91, 155, 213, 0.3)",
    boxShadow: "0 4px 16px rgba(91, 155, 213, 0.15)",
    objectFit: "cover"
  },
  
  canvas: {
    width: "640px",
    height: "480px",
    position: "absolute",
    top: 20,
    left: 25,
    borderRadius: "1rem",
    border: "2px solid rgba(91, 155, 213, 0.3)",
    boxShadow: "0 4px 16px rgba(91, 155, 213, 0.15)"
  },
  
  badge: {
    position: "absolute",
    background: "linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)",
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    boxShadow: "0 4px 12px rgba(91, 155, 213, 0.3)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#FFFFFF",
    zIndex: 20
  },
  
  stateBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)",
    padding: "0.75rem",
    borderRadius: "0.75rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 12px rgba(91, 155, 213, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    zIndex: 20
  },

  // 자리 비움 메시지 스타일
  awayMessageContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, rgba(91, 155, 213, 0.95) 0%, rgba(68, 114, 196, 0.9) 100%)",
    padding: "2rem 2.5rem",
    borderRadius: "1.5rem",
    backdropFilter: "blur(15px)",
    boxShadow: "0 8px 32px rgba(91, 155, 213, 0.4)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    zIndex: 30,
    animation: "messageFloat 2s ease-in-out infinite"
  },

  awayMessageText: {
    fontWeight: "700",
    fontSize: "1.75rem",
    marginTop: "1rem",
    color: "#FFFFFF",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    letterSpacing: "0.025em"
  },

  stateIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.75rem 1rem",
    borderRadius: "9999px",
    fontWeight: "700",
    color: "#FFFFFF",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)"
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    width: "100%",
    marginTop: "1.5rem",
    maxWidth: "600px"
  },

  statCard: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%)",
    padding: "1.25rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 16px rgba(91, 155, 213, 0.15)",
    border: "2px solid #B4D2F7",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease"
  },

  statHeader: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "#4472C4",
    textShadow: "0 1px 2px rgba(68, 114, 196, 0.1)"
  },

  timeValue: {
    fontSize: "1.875rem",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: "700",
    textShadow: "0 2px 4px rgba(91, 155, 213, 0.2)"
  },

  sliderContainer: {
    marginTop: "1.5rem",
    width: "100%",
    maxWidth: "600px",
    padding: "1rem 1.25rem",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%)",
    borderRadius: "1rem",
    boxShadow: "0 4px 16px rgba(91, 155, 213, 0.15)",
    border: "2px solid #B4D2F7",
    backdropFilter: "blur(10px)"
  },

  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem"
  },

  sliderLabelText: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.9rem",
    color: "#4472C4",
    fontWeight: "600",
    textShadow: "0 1px 2px rgba(68, 114, 196, 0.1)"
  },

  sliderValue: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    backgroundColor: "rgba(91, 155, 213, 0.1)",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    border: "1px solid #B4D2F7",
    backdropFilter: "blur(5px)",
    color: "#4472C4"
  },

  slider: {
    width: "100%",
    height: "0.75rem",
    backgroundImage: "linear-gradient(to right, #5B9BD5, #8BB3E8, #B4D2F7)",
    borderRadius: "0.375rem",
    appearance: "none",
    cursor: "pointer",
    boxShadow: "inset 0 1px 2px rgba(91, 155, 213, 0.2)"
  },

  guideContainer: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(91, 155, 213, 0.2)",
    overflow: "hidden",
    border: "2px solid #B4D2F7",
    padding: "1.5rem",
    marginTop: "2rem",
    maxWidth: "900px",
    width: "100%",
    animation: "guideSlideIn 1s ease-out 0.5s both"
  },

  guideHeader: {
    fontSize: "1.375rem",
    fontWeight: "700",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "#4472C4",
    textShadow: "0 2px 4px rgba(68, 114, 196, 0.1)"
  },

  guideList: {
    paddingLeft: "1.75rem",
    listStyleType: "none",
    color: "#495057",
    position: "relative"
  },

  guideItem: {
    marginBottom: "0.75rem",
    lineHeight: "1.6",
    position: "relative",
    paddingLeft: "1.5rem",
    textShadow: "0 1px 2px rgba(73, 80, 87, 0.1)",
    fontSize: "0.95rem"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "500px",
    width: "100%",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 249, 250, 0.8) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: "0 8px 32px rgba(91, 155, 213, 0.2)",
    overflow: "hidden",
    border: "2px solid #B4D2F7",
    padding: "1.5rem"
  },

  spinner: {
    borderRadius: "50%",
    width: "4rem",
    height: "4rem",
    margin: "2rem",
    fontSize: "10px",
    position: "relative",
    borderTop: "0.4em solid rgba(91, 155, 213, 0.2)",
    borderRight: "0.4em solid rgba(91, 155, 213, 0.2)",
    borderBottom: "0.4em solid rgba(91, 155, 213, 0.2)",
    borderLeft: "0.4em solid #5B9BD5",
    transform: "translateZ(0)",
    animation: "spinner 1.1s infinite linear",
    filter: "drop-shadow(0 4px 8px rgba(91, 155, 213, 0.3))"
  },

  globalCss: `
    @keyframes spinner {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes messageFloat {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.02); }
    }
    
    @keyframes guideSlideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(91, 155, 213, 0.1);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: rgba(91, 155, 213, 0.3);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(91, 155, 213, 0.5);
    }
    
    /* Guide list custom bullets */
    .guideItem::before {
      content: '📚';
      position: absolute;
      left: -1.5rem;
      color: #5B9BD5;
      filter: drop-shadow(0 0 4px rgba(91, 155, 213, 0.5));
    }
    
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%);
      cursor: pointer;
      box-shadow: 
        0 4px 8px rgba(91, 155, 213, 0.3),
        0 0 0 2px rgba(255, 255, 255, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.2s ease;
    }
    
    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 
        0 6px 12px rgba(91, 155, 213, 0.4),
        0 0 0 3px rgba(255, 255, 255, 0.9),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    input[type=range]::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%);
      cursor: pointer;
      box-shadow: 
        0 4px 8px rgba(91, 155, 213, 0.3),
        0 0 0 2px rgba(255, 255, 255, 0.8);
      border: none;
      transition: all 0.2s ease;
    }
    
    input[type=range]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }

    .mode-button:hover {
      background: linear-gradient(135deg, #8BB3E8 0%, #B4D2F7 100%) !important;
      color: #4472C4 !important;
      transform: translateX(2px);
      box-shadow: 0 4px 12px rgba(91, 155, 213, 0.2);
    }

    .session-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(91, 155, 213, 0.3);
    }
  `,

  getStateColor: (state) => {
    switch(state) {
      case 0: return "linear-gradient(135deg, #5B9BD5 0%, #8BB3E8 100%)"; // blue - Preparing
      case 1: return "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"; // green - Studying
      case 2: return "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)"; // yellow - Away
      case 3: return "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"; // purple - Sleeping
      case 4: return "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"; // orange - Looking elsewhere
      default: return "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"; // gray
    }
  },

  getStateText: (state) => {
    switch(state) {
      case 0: return "준비 중";
      case 1: return "공부 중";
      case 2: return "자리 이탈";
      case 3: return "수면";
      case 4: return "다른 곳 응시";
      default: return "상태 알 수 없음";
    }
  }
}