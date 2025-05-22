import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

export const CanvasContext = createContext(null);
export const useCanvas = () => useContext(CanvasContext);

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
