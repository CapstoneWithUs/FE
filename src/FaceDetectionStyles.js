export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
    color: "white",
    padding: "2rem",
    fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  
  header: {
    fontSize: "2.5rem",
    fontWeight: "800",
    marginBottom: "2rem",
    textAlign: "center",
    background: "linear-gradient(135deg, #38bdf8, #4ade80, #a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 4px 20px rgba(56, 189, 248, 0.3)",
    letterSpacing: "-0.025em",
    animation: "headerGlow 3s ease-in-out infinite"
  },
  
  mainContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "2.5rem",
    width: "100%",
    maxWidth: "1600px",
    position: "relative",
    zIndex: 10
  },
  
  panel: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    transition: "all 0.3s ease"
  },
  
  videoContainer: {
    position: "relative",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    transition: "all 0.3s ease"
  },
  
  video: {
    width: "640px",
    height: "480px",
    borderRadius: "1rem",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `
      0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 10px 10px -5px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    objectFit: "cover"
  },
  
  canvas: {
    width: "640px",
    height: "480px",
    borderRadius: "1rem",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `
      0 20px 25px -5px rgba(0, 0, 0, 0.2),
      0 10px 10px -5px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `
  },
  
  badge: {
    position: "absolute",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)",
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    boxShadow: `
      0 10px 15px -3px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 20,
    animation: "badgeFloat 3s ease-in-out infinite"
  },
  
  stateBadge: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)",
    padding: "0.75rem",
    borderRadius: "0.75rem",
    backdropFilter: "blur(10px)",
    boxShadow: `
      0 10px 15px -3px rgba(0, 0, 0, 0.3),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(255, 255, 255, 0.1)",
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
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 100%)",
    padding: "2rem 2.5rem",
    borderRadius: "1.5rem",
    backdropFilter: "blur(15px)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(255, 255, 255, 0.2)",
    zIndex: 30,
    animation: "messageFloat 2s ease-in-out infinite"
  },

  awayMessageText: {
    fontWeight: "700",
    fontSize: "1.75rem",
    marginTop: "1rem",
    color: "white",
    textShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
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
    color: "white",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)"
  },

  statsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    width: "100%",
    marginTop: "1.5rem"
  },

  statCard: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    padding: "1.25rem",
    borderRadius: "1rem",
    boxShadow: `
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(255, 255, 255, 0.1)",
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
    color: "rgba(255, 255, 255, 0.9)",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },

  timeValue: {
    fontSize: "1.875rem",
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontWeight: "700",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },

  sliderContainer: {
    marginTop: "1.5rem",
    width: "100%",
    padding: "1rem 1.25rem",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    borderRadius: "1rem",
    boxShadow: `
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 4px 6px -2px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    border: "1px solid rgba(255, 255, 255, 0.1)",
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
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
  },

  sliderValue: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: "600",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(5px)"
  },

  slider: {
    width: "100%",
    height: "0.75rem",
    backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6, #4ade80)",
    borderRadius: "0.375rem",
    appearance: "none",
    cursor: "pointer",
    boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.2)"
  },

  guideContainer: {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    marginTop: "2.5rem",
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
    color: "#f8fafc",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)"
  },

  guideList: {
    paddingLeft: "1.75rem",
    listStyleType: "none",
    color: "rgba(255, 255, 255, 0.9)",
    position: "relative"
  },

  guideItem: {
    marginBottom: "0.75rem",
    lineHeight: "1.6",
    position: "relative",
    paddingLeft: "1.5rem",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
    fontSize: "0.95rem"
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "500px",
    width: "100%",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)",
    borderRadius: "1.5rem",
    backdropFilter: "blur(20px)",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1.5rem"
  },

  spinner: {
    borderRadius: "50%",
    width: "4rem",
    height: "4rem",
    margin: "2rem",
    fontSize: "10px",
    position: "relative",
    borderTop: "0.4em solid rgba(255, 255, 255, 0.2)",
    borderRight: "0.4em solid rgba(255, 255, 255, 0.2)",
    borderBottom: "0.4em solid rgba(255, 255, 255, 0.2)",
    borderLeft: "0.4em solid #38bdf8",
    transform: "translateZ(0)",
    animation: "spinner 1.1s infinite linear",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))"
  },

  globalCss: `
    @keyframes spinner {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes headerGlow {
      0%, 100% { 
        textShadow: 0 4px 20px rgba(56, 189, 248, 0.3);
        filter: brightness(1);
      }
      50% { 
        textShadow: 0 4px 30px rgba(56, 189, 248, 0.6);
        filter: brightness(1.1);
      }
    }
    
    @keyframes badgeFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-2px); }
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
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.5);
    }
    
    /* Guide list custom bullets */
    .guideItem::before {
      content: '✨';
      position: absolute;
      left: -1.5rem;
      color: #4ade80;
      filter: drop-shadow(0 0 4px rgba(74, 222, 128, 0.5));
    }
    
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      cursor: pointer;
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.3),
        0 0 0 2px rgba(59, 130, 246, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: all 0.2s ease;
    }
    
    input[type=range]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 
        0 6px 12px rgba(0, 0, 0, 0.4),
        0 0 0 3px rgba(59, 130, 246, 0.7),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    
    input[type=range]::-moz-range-thumb {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
      cursor: pointer;
      box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.3),
        0 0 0 2px rgba(59, 130, 246, 0.5);
      border: none;
      transition: all 0.2s ease;
    }
    
    input[type=range]::-moz-range-thumb:hover {
      transform: scale(1.1);
    }
  `,

  getStateColor: (state) => {
    switch(state) {
      case 0: return "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"; // blue - Preparing
      case 1: return "linear-gradient(135deg, #22c55e 0%, #15803d 100%)"; // green - Studying
      case 2: return "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)"; // yellow - Away
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