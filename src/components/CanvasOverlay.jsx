import { createContext, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const CanvasContext = createContext(null);

// useCanvas 훅을 더 안전하게 수정
export const useCanvas = () => {
  const canvasRef = useRef(null);
  
  // 캔버스 초기화
  if (!canvasRef.current) {
    if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '10';
      canvasRef.current = canvas;
    }
  }
  
  return canvasRef;
};

export function CanvasOverlay({ canvasRef, page }) {
  const location = useLocation();
  return location.pathname == page ? (<canvas
    width={window.innerWidth}
    height={window.innerHeight}
    ref={canvasRef}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none',
    }}
  />) : null;
}