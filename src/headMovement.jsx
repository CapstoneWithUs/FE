import { useState, useRef, useEffect } from 'react';
import { GRAPH_INTERVAL } from './constants';

export function useHeadMovement() {
  const [headMovementHistory, setHeadMovementHistory] = useState([]);
  const headMovementHistoryRef = useRef([]);
  useEffect(() => { headMovementHistoryRef.current = headMovementHistory; }, [headMovementHistory]);
  
  const prvX = useRef(0);
  const prvY = useRef(0);
  const prvZ = useRef(0);
  const prvT = useRef(0);

  const headMovement = (x, y, z) => {
    const now = performance.now();

    if (prvT.current === 0) {
      setHeadMovementHistory(prev => [[0, now]]);
    } else {
      const distance = Math.hypot(x - prvX.current, y - prvY.current, z - prvZ.current);
      setHeadMovementHistory(prev => [
        ...prev,
        { value: distance / (performance.now() - prvT.current) / 10, time: now }
      ]);
    }

    setHeadMovementHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));

    prvX.current = x;
    prvY.current = y;
    prvZ.current = z;
    prvT.current = now;
  };

  return {
    headMovementHistory,
    headMovementHistoryRef,
    headMovement,
  };
}
