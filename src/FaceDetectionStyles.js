export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a202c 0%, #0f172a 100%)",
    color: "white",
    padding: "1.5rem",
    fontFamily: "system-ui, -apple-system, sans-serif"
  },
  header: {
    fontSize: "2.25rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
    background: "linear-gradient(90deg, #38bdf8, #4ade80)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 10px rgba(56, 189, 248, 0.2)"
  },
  mainContent: {
    display: "flex",
    flexDirection: "row", // Always use row direction to ensure panels are side by side
    alignItems: "flex-start", // Changed to flex-start for better alignment
    justifyContent: "center",
    gap: "2rem",
    width: "100%",
    maxWidth: "1400px"
  },
  panel: {
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem"
  },
  videoContainer: {
    position: "relative",
    width: "640px",
    height: "480px",
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem"
  },
  video: {
    width: "640px",
    height: "480px",
    position: "absolute",
    top: 0,
    lef: 0,
    borderRadius: "0.75rem",
    border: "2px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
  },
  canvas: {
    width: "640px",
    height: "480px",
    position: "absolute",
    top: 0,
    lef: 0,
    borderRadius: "0.75rem",
    border: "2px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
  },
  badge: {
    position: "absolute",
    background: "rgba(0, 0, 0, 0.7)",
    padding: "0.5rem 0.75rem",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 10 // 높은 z-index로 항상 보이도록 설정
  },
  stateBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "rgba(0, 0, 0, 0.7)",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    backdropFilter: "blur(4px)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.1)"
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
    background: "rgba(0, 0, 0, 0.8)",
    padding: "1.5rem 2rem",
    borderRadius: "1rem",
    backdropFilter: "blur(8px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 20
  },
  awayMessageText: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginTop: "0.75rem",
    color: "white",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },
  stateIndicator: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "9999px",
    fontWeight: "bold",
    color: "white"
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    width: "100%",
    marginTop: "1rem"
  },
  statCard: {
    background: "rgba(30, 41, 59, 0.6)",
    padding: "1rem",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  statHeader: {
    fontSize: "1rem",
    fontWeight: "600",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.8)"
  },
  timeValue: {
    fontSize: "1.75rem",
    fontFamily: "monospace",
    fontWeight: "bold"
  },
  sliderContainer: {
    marginTop: "1rem",
    width: "100%",
    padding: "0.75rem 1rem",
    background: "rgba(30, 41, 59, 0.6)",
    borderRadius: "0.75rem",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.05)"
  },
  sliderLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.5rem"
  },
  sliderLabelText: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "rgba(255, 255, 255, 0.8)"
  },
  sliderValue: {
    fontFamily: "monospace",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "0.25rem 0.5rem",
    borderRadius: "0.25rem",
    fontSize: "0.875rem"
  },
  slider: {
    width: "100%",
    height: "0.5rem",
    backgroundImage: "linear-gradient(to right, #3b82f6, #4ade80)",
    borderRadius: "0.25rem",
    appearance: "none",
    cursor: "pointer"
  },
  guideContainer: {
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    marginTop: "2rem",
    maxWidth: "800px",
    width: "100%"
  },
  guideHeader: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  guideList: {
    paddingLeft: "1.5rem",
    listStyleType: "disc",
    color: "rgba(255, 255, 255, 0.8)"
  },
  guideItem: {
    marginBottom: "0.5rem",
    lineHeight: "1.5"
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "400px",
    width: "100%",
    background: "rgba(30, 41, 59, 0.8)",
    borderRadius: "1rem",
    backdropFilter: "blur(10px)",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem"
  },
  spinner: {
    borderRadius: "50%",
    width: "3rem",
    height: "3rem",
    margin: "2rem",
    fontSize: "10px",
    position: "relative",
    borderTop: "0.3em solid rgba(255, 255, 255, 0.2)",
    borderRight: "0.3em solid rgba(255, 255, 255, 0.2)",
    borderBottom: "0.3em solid rgba(255, 255, 255, 0.2)",
    borderLeft: "0.3em solid #38bdf8",
    transform: "translateZ(0)",
    animation: "spinner 1.1s infinite linear"
  },
  globalCss: `
    @keyframes spinner {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    }
    
    input[type=range]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: white;
      cursor: pointer;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
      border: none;
    }
  `,
  getStateColor: (state) => {
    switch(state) {
      case 0: return "#3b82f6"; // blue-500 - Preparing
      case 1: return "#22c55e"; // green-500 - Studying
      case 2: return "#eab308"; // yellow-500 - Away
      case 3: return "#a855f7"; // purple-500 - Sleeping
      case 4: return "#f97316"; // orange-500 - Looking elsewhere
      default: return "#6b7280"; // gray-500
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