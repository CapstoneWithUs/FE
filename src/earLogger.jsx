import { useState } from 'react';
import { GRAPH_INTERVAL } from './constants';

export function useEarLogger() {
  const [leftEarHistory, setLeftEarHistory] = useState([]);
  const [rightEarHistory, setRightEarHistory] = useState([]);

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
    rightEarHistory,
    earLogger
  };
}
