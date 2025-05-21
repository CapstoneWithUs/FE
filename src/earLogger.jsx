import { useState, useRef, useEffect } from 'react';
import { GRAPH_INTERVAL } from './constants';

export function useEarLogger() {
  const [leftEarHistory, setLeftEarHistory] = useState([]);
  const [rightEarHistory, setRightEarHistory] = useState([]);
  
  const leftEarHistoryRef = useRef([]);
  useEffect(() => { leftEarHistoryRef.current = leftEarHistory; }, [leftEarHistory]);
  const rightEarHistoryRef = useRef([]);
  useEffect(() => { rightEarHistoryRef.current = rightEarHistory; }, [rightEarHistory]);

  const earLogger = (leftEar, rightEar) => {
    const now = performance.now();

    setLeftEarHistory(prev => [
      ...prev,
      { value: leftEar, time: now }
    ]);
    setRightEarHistory(prev => [
      ...prev,
      { value: rightEar, time: now }
    ]);

    setLeftEarHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));
    setRightEarHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));
  };

  return {
    leftEarHistory,
    leftEarHistoryRef,
    rightEarHistory,
    rightEarHistoryRef,
    earLogger
  };
}
