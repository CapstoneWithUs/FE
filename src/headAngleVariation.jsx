import { useState, useRef, useEffect } from 'react';
import { GRAPH_INTERVAL } from './constants';

export function useHeadAngleVariation() {
  const [headAngleVariationHistory, setHeadAngleVariationHistory] = useState([]);
  const headAngleVariationHistoryRef = useRef([]);
  useEffect(() => { headAngleVariationHistoryRef.current = headAngleVariationHistory; }, [headAngleVariationHistory]);
  
  const prvYaw = useRef(0);
  const prvPitch = useRef(0);
  const prvRoll = useRef(0);
  const prvT = useRef(0);

  const headAngleVariation = (yaw, pitch, roll) => {
    const now = performance.now();

    if (prvT.current === 0) {
      setHeadAngleVariationHistory(prev => [[0, now]]);
    } else {
      const delta = Math.hypot(yaw - prvYaw.current, pitch - prvPitch.current, roll - prvRoll.current);
      setHeadAngleVariationHistory(prev => [
        ...prev,
        { value: delta / (performance.now() - prvT.current), time: now }
      ]);
    }

    setHeadAngleVariationHistory(prev => prev.filter(p => (now-p.time <= GRAPH_INTERVAL)));

    prvYaw.current = yaw;
    prvPitch.current = pitch;
    prvRoll.current = roll;
    prvT.current = now;
  };

  return {
    headAngleVariationHistory,
    headAngleVariationHistoryRef,
    headAngleVariation,
  };
}
