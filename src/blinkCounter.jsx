import { useState, useRef, useEffect } from 'react';
import { EAR_THRESHOLD, GRAPH_INTERVAL } from './constants';

export function useBlinkCounter() {
  const [leftBlinkHistory, setLeftBlinkHistory] = useState([]);
  const [rightBlinkHistory, setRightBlinkHistory] = useState([]);

  const leftBlinkHistoryRef = useRef([]);
  useEffect(() => { leftBlinkHistoryRef.current = leftBlinkHistory; }, [leftBlinkHistory]);
  const rightBlinkHistoryRef = useRef([]);
  useEffect(() => { rightBlinkHistoryRef.current = rightBlinkHistory; }, [rightBlinkHistory]);

  const prvLeftEar = useRef(0);
  const prvRightEar = useRef(0);

  const blinkCounter = (leftEar, rightEar) => {
    const now = performance.now();

    const leftBlink = prvLeftEar.current >= EAR_THRESHOLD && leftEar < EAR_THRESHOLD ? 1 : 0;
    const rightBlink = prvRightEar.current >= EAR_THRESHOLD && rightEar < EAR_THRESHOLD ? 1 : 0;

    setLeftBlinkHistory(prev => [
      ...prev,
      { value: leftBlink, time: now }
    ]);
    setRightBlinkHistory(prev => [
      ...prev,
      { value: rightBlink, time: now }
    ]);
    
    setLeftBlinkHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));
    setRightBlinkHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));

    prvLeftEar.current = leftEar;
    prvRightEar.current = rightEar;
  };
  
  return {
    leftBlinkHistory,
    leftBlinkHistoryRef,
    rightBlinkHistory,
    rightBlinkHistoryRef,
    blinkCounter,
  };
}
